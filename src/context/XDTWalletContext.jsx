/**
 * XDTWalletContext.jsx
 * Self-custodial HD wallet context for xdt-wallet.
 * Manages wallet keys (in-memory only), balances, prices and transaction history.
 */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { loadWalletData, unlockWallet } from '../services/walletKeyService'
import { getETHBalance, getUSDTERC20Balance, sendETH, sendUSDTERC20 } from '../services/ethChainService'
import { getUSDTTRC20Balance, getTRXBalance, sendUSDTTRC20, getRecentTRC20Txs } from '../services/tronChainService'
import { fetchPrices } from '../services/xdtPriceService'

const XDTWalletContext = createContext(null)

// Initial token list — balances filled in after unlock
const TOKEN_DEFAULTS = [
  { id: 'eth',       symbol: 'ETH',  name: 'Ethereum',  network: 'Ethereum',   color: '#627eea', balance: 0 },
  { id: 'usdt-erc',  symbol: 'USDT', name: 'Tether USD', network: 'ERC-20',   color: '#26a17b', balance: 0 },
  { id: 'usdt-trc',  symbol: 'USDT', name: 'Tether USD', network: 'TRC-20',   color: '#eb0029', balance: 0 },
]

export function XDTWalletProvider({ children }) {
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

  // ── Transaction history ───────────────────────────────────────────────────────
  const [txHistory, setTxHistory] = useState([])

  const refreshIntervalRef = useRef(null)

  // ── Check on mount whether a wallet already exists ───────────────────────────
  useEffect(() => {
    const stored = loadWalletData()
    if (stored) setIsLocked(true)
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
      const [ethBal, usdtErc, usdtTrc, trx, trc20Txs] = await Promise.allSettled([
        getETHBalance(keys.ethAddress),
        getUSDTERC20Balance(keys.ethAddress),
        getUSDTTRC20Balance(keys.tronAddress),
        getTRXBalance(keys.tronAddress),
        getRecentTRC20Txs(keys.tronAddress, 20),
      ])

      setTokens(prev => prev.map(t => {
        if (t.id === 'eth')      return { ...t, balance: ethBal.value      ?? 0 }
        if (t.id === 'usdt-erc') return { ...t, balance: usdtErc.value     ?? 0 }
        if (t.id === 'usdt-trc') return { ...t, balance: usdtTrc.value     ?? 0 }
        return t
      }))

      setTrxBalance(trx.value ?? 0)

      if (trc20Txs.status === 'fulfilled') {
        setTxHistory(prev => {
          const newIds = new Set(trc20Txs.value.map(t => t.txID))
          const merged = [
            ...trc20Txs.value,
            ...prev.filter(t => !newIds.has(t.txID)),
          ]
          return merged.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)).slice(0, 50)
        })
      }
    } catch (err) {
      setBalanceError('Could not refresh balances')
    } finally {
      setBalancesLoading(false)
    }
  }, [keys])

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
      const walletKeys = await unlockWallet(pin)
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
  async function sendToken({ tokenId, toAddress, amount }) {
    if (!keys) throw new Error('Wallet not unlocked')

    let txHash
    const date = new Date().toISOString()

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

    // Optimistically update history
    const token = tokens.find(t => t.id === tokenId)
    setTxHistory(prev => [{
      txID:      txHash,
      type:      'send',
      amount:    parseFloat(amount),
      symbol:    token?.symbol ?? '?',
      network:   token?.network ?? '?',
      to:        toAddress,
      timestamp: Date.now(),
    }, ...prev])

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
