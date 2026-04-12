/**
 * XDTWalletContext.jsx
 * Self-custodial HD wallet context for xdt-wallet.
 * Manages wallet keys (in-memory only), balances, prices and transaction history.
 */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { loadWalletData, unlockWallet } from '../services/walletKeyService'

/** Stable per-device ID — scopes wallet storage without requiring email auth */
function getOrCreateDeviceId() {
  try {
    let id = localStorage.getItem('xdt_device_id')
    if (!id) {
      id = 'dev_' + (crypto.randomUUID?.().replace(/-/g, '') ??
        Math.random().toString(36).slice(2) + Date.now().toString(36))
      localStorage.setItem('xdt_device_id', id)
    }
    return id
  } catch { return 'dev_default' }
}
import { getETHBalance, getUSDTERC20Balance, sendETH, sendUSDTERC20, getRecentETHTxs, getRecentUSDTERC20Txs } from '../services/ethChainService'
import { getUSDTTRC20Balance, getTRXBalance, sendUSDTTRC20, getRecentTRC20Txs } from '../services/tronChainService'
import { fetchPrices } from '../services/xdtPriceService'
import { saveWalletAddresses, syncTransactions, fetchTransactions, saveBalances } from '../services/mongoService'

const XDTWalletContext = createContext(null)

// Initial token list — balances filled in after unlock
const TOKEN_DEFAULTS = [
  { id: 'eth',       symbol: 'ETH',  name: 'Ethereum',  network: 'Ethereum',   color: '#627eea', balance: 0 },
  { id: 'usdt-erc',  symbol: 'USDT', name: 'Tether USD', network: 'ERC-20',   color: '#26a17b', balance: 0 },
  { id: 'usdt-trc',  symbol: 'USDT', name: 'Tether USD', network: 'TRC-20',   color: '#eb0029', balance: 0 },
]

function txKey(userId) {
  return userId ? `xdt_tx_history_${userId}` : 'xdt_tx_history'
}

function loadStoredTxHistory(userId) {
  try {
    const raw = localStorage.getItem(txKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveTxHistory(txs, userId) {
  try { localStorage.setItem(txKey(userId), JSON.stringify(txs.slice(0, 100))) } catch {}
}

export function XDTWalletProvider({ children }) {
  const userId = getOrCreateDeviceId()

  // ── Wallet key state (in-memory only, never persisted post-setup) ────────────
  const [isUnlocked,    setIsUnlocked]    = useState(false)
  const [isLocked,      setIsLocked]      = useState(false) // wallet exists but needs PIN
  const [keys,          setKeys]          = useState(null)  // { ethAddress, ethPrivateKey, tronAddress, … }
  const [unlockError,   setUnlockError]   = useState('')

  // ── Market data ──────────────────────────────────────────────────────────────
  const [prices, setPrices] = useState({ eth: 0, ethChange: 0, usdt: 1, usdtChange: 0 })

  // ── Per-token balances ────────────────────────────────────────────────────────
  const [tokens,         setTokens]         = useState(TOKEN_DEFAULTS)
  const [trxBalance,     setTrxBalance]      = useState(0)
  const [balancesLoading, setBalancesLoading] = useState(false)
  const [balanceError,    setBalanceError]   = useState('')

  // ── Transaction history (persisted to localStorage, per user) ───────────────
  const [txHistory, setTxHistory] = useState([])

  const refreshIntervalRef = useRef(null)

  // ── On mount: check whether a wallet exists for this device ─────────────────
  useEffect(() => {
    const stored = loadWalletData(userId)
    setIsLocked(!!stored)
    setTxHistory(loadStoredTxHistory(userId))
  }, [])

  // ── Price polling (every 60 s) ────────────────────────────────────────────────
  useEffect(() => {
    fetchPrices().then(setPrices)
    const id = setInterval(() => fetchPrices().then(setPrices), 60_000)
    return () => clearInterval(id)
  }, [])

  // ── Refresh balances whenever the wallet is unlocked ─────────────────────────
  const refreshBalances = useCallback(async () => {
    if (!keys) return
    setBalancesLoading(true)
    setBalanceError('')

    try {
      const [ethBal, usdtErc, usdtTrc, trx, trc20Txs, ethTxs, usdtErcTxs] = await Promise.allSettled([
        getETHBalance(keys.ethAddress),
        getUSDTERC20Balance(keys.ethAddress),
        getUSDTTRC20Balance(keys.tronAddress),
        getTRXBalance(keys.tronAddress),
        getRecentTRC20Txs(keys.tronAddress, 25),
        getRecentETHTxs(keys.ethAddress, 25),
        getRecentUSDTERC20Txs(keys.ethAddress, 25),
      ])

      setTokens(prev => prev.map(t => {
        if (t.id === 'eth')      return { ...t, balance: ethBal.value  ?? 0 }
        if (t.id === 'usdt-erc') return { ...t, balance: usdtErc.value ?? 0 }
        if (t.id === 'usdt-trc') return { ...t, balance: usdtTrc.value ?? 0 }
        return t
      }))

      setTrxBalance(trx.value ?? 0)

      // Merge all three sources: TRC-20, ETH, USDT ERC-20
      const incoming = [
        ...(trc20Txs.status   === 'fulfilled' ? trc20Txs.value   : []),
        ...(ethTxs.status     === 'fulfilled' ? ethTxs.value     : []),
        ...(usdtErcTxs.status === 'fulfilled' ? usdtErcTxs.value : []),
      ]

      if (incoming.length > 0) {
        setTxHistory(prev => {
          const seen = new Set(incoming.map(t => t.txID))
          const merged = [
            ...incoming,
            ...prev.filter(t => !seen.has(t.txID)),
          ].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)).slice(0, 100)
          saveTxHistory(merged, userId)
          return merged
        })
      }
    } catch (err) {
      setBalanceError('Could not refresh balances')
    } finally {
      setBalancesLoading(false)
    }
  }, [keys, userId])

  useEffect(() => {
    if (!isUnlocked || !keys) return
    refreshBalances()
    refreshIntervalRef.current = setInterval(refreshBalances, 30_000)
    return () => clearInterval(refreshIntervalRef.current)
  }, [isUnlocked, keys, refreshBalances])

  // ── Unlock wallet with PIN ────────────────────────────────────────────────────
  async function unlock(pin) {
    setUnlockError('')
    try {
      const walletKeys = await unlockWallet(pin, userId)
      setKeys(walletKeys)
      setIsUnlocked(true)
      setIsLocked(false)
      return true
    } catch (err) {
      setUnlockError(err.message || 'Wrong PIN')
      return false
    }
  }

  // Called after Setup completes — walletKeys already derived there
  function setWalletAfterSetup(walletKeys) {
    setKeys(walletKeys)
    setIsUnlocked(true)
    setIsLocked(false)
  }

  // ── Send functions ────────────────────────────────────────────────────────────
  function friendlyTxError(err) {
    const code = err?.code ?? ''
    const msg  = (err?.message ?? '').toLowerCase()
    if (code === 'INSUFFICIENT_FUNDS' || msg.includes('insufficient funds'))
      return 'Insufficient balance to cover amount + gas fees.'
    if (code === 'UNPREDICTABLE_GAS_LIMIT' || msg.includes('gas'))
      return 'Gas estimation failed. The transaction may not be possible.'
    if (code === 'NONCE_EXPIRED' || msg.includes('nonce'))
      return 'Transaction nonce error. Please try again.'
    if (code === 'NETWORK_ERROR' || msg.includes('network'))
      return 'Network error. Check your connection and try again.'
    if (msg.includes('rejected') || msg.includes('denied'))
      return 'Transaction was rejected.'
    return 'Transaction failed. Please try again.'
  }

  async function sendToken({ tokenId, toAddress, amount }) {
    if (!keys) throw new Error('Wallet not unlocked')

    let txHash
    const date = new Date().toISOString()

    try {
      if (tokenId === 'eth') {
        const tx = await sendETH(keys.ethPrivateKey, toAddress, amount)
        txHash = tx.hash
      } else if (tokenId === 'usdt-erc') {
        const tx = await sendUSDTERC20(keys.ethPrivateKey, toAddress, amount)
        txHash = tx.hash
      } else if (tokenId === 'usdt-trc') {
        const { txID } = await sendUSDTTRC20(
          keys.tronPrivateKey, keys.tronAddress, toAddress, amount
        )
        txHash = txID
      } else {
        throw new Error('Unknown token')
      }
    } catch (err) {
      throw new Error(friendlyTxError(err))
    }

    // Optimistically update history and persist
    const token = tokens.find(t => t.id === tokenId)
    setTxHistory(prev => {
      const updated = [{
        txID:      txHash,
        type:      'send',
        amount:    parseFloat(amount),
        symbol:    token?.symbol ?? '?',
        network:   token?.network ?? '?',
        to:        toAddress,
        timestamp: Date.now(),
      }, ...prev].slice(0, 100)
      saveTxHistory(updated, userId)
      return updated
    })

    // Optimistically reduce balance
    setTokens(prev => prev.map(t =>
      t.id === tokenId
        ? { ...t, balance: Math.max(0, t.balance - parseFloat(amount)) }
        : t
    ))

    // Refresh real balances after 5 s
    setTimeout(refreshBalances, 5_000)

    return txHash
  }

  // ── Computed totals ───────────────────────────────────────────────────────────
  const totalUSD = tokens.reduce((sum, t) => {
    const price = t.symbol === 'ETH' ? prices.eth : prices.usdt
    return sum + t.balance * price
  }, 0)

  return (
    <XDTWalletContext.Provider value={{
      // Wallet state
      isUnlocked,
      isLocked,
      unlockError,
      unlock,
      setWalletAfterSetup,
      keys,
      userId,

      // Market
      prices,

      // Tokens & balances
      tokens,
      trxBalance,
      balancesLoading,
      balanceError,
      totalUSD,

      // Transactions
      txHistory,

      // Actions
      sendToken,
      refreshBalances,
    }}>
      {children}
    </XDTWalletContext.Provider>
  )
}

export function useXDTWallet() {
  const ctx = useContext(XDTWalletContext)
  if (!ctx) throw new Error('useXDTWallet must be used inside XDTWalletProvider')
  return ctx
}
