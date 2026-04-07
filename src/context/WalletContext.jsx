import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { createPublicClient, erc20Abi, formatUnits, http } from 'viem'
import {
  mainnet, polygon, bsc, arbitrum, optimism, base, avalanche,
} from 'viem/chains'
import { coins as staticCoins, transactions as staticTxs } from '../data/coins'
import { EVM_NATIVE, TOKEN_CONTRACTS, TOKEN_DECIMALS } from '../config/walletConnect'

const WalletContext = createContext(null)

const SUPPORTED_CHAINS = {
  1: mainnet,
  137: polygon,
  56: bsc,
  42161: arbitrum,
  10: optimism,
  8453: base,
  43114: avalanche,
}

const publicClients = Object.fromEntries(
  Object.entries(SUPPORTED_CHAINS).map(([chainId, chain]) => [
    Number(chainId),
    createPublicClient({
      chain,
      transport: http(chain.rpcUrls.default.http[0]),
    }),
  ])
)

function genTxHash() {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

const initialBalances = Object.fromEntries(staticCoins.map(c => [c.id, c.balance]))

export function WalletProvider({ children }) {
  const { address, isConnected } = useAppKitAccount()
  const [balances, setBalances] = useState(initialBalances)
  const [balancesLoading, setBalancesLoading] = useState(false)
  const [balanceError, setBalanceError] = useState('')
  const [txHistory, setTxHistory] = useState(
    staticTxs.map(t => ({ ...t, status: 'confirmed', txHash: genTxHash(), network: 'Unknown' }))
  )

  const fallbackTxHistory = useMemo(
    () => staticTxs.map(t => ({ ...t, status: 'confirmed', txHash: genTxHash(), network: 'Unknown' })),
    []
  )

  useEffect(() => {
    if (!isConnected || !address) {
      setBalances(initialBalances)
      setBalanceError('')
      setBalancesLoading(false)
      setTxHistory(prev => (prev.length ? prev : fallbackTxHistory))
      return
    }

    let cancelled = false

    async function loadOnchainBalances() {
      setBalancesLoading(true)

      try {
        const next = Object.fromEntries(staticCoins.map(c => [c.id, 0]))

        for (const [chainIdText, client] of Object.entries(publicClients)) {
          const chainId = Number(chainIdText)

          const nativeCoinId = EVM_NATIVE[chainId]
          if (nativeCoinId) {
            const raw = await client.getBalance({ address })
            const nativeAmount = Number(formatUnits(raw, 18))
            next[nativeCoinId] = (next[nativeCoinId] ?? 0) + nativeAmount
          }

          for (const [coinId, contractsByChain] of Object.entries(TOKEN_CONTRACTS)) {
            const tokenAddress = contractsByChain[chainId]
            if (!tokenAddress) continue

            const decimals = TOKEN_DECIMALS[coinId] ?? 18
            const raw = await client.readContract({
              address: tokenAddress,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [address],
            })

            const tokenAmount = Number(formatUnits(raw, decimals))
            next[coinId] = (next[coinId] ?? 0) + tokenAmount
          }
        }

        if (cancelled) return
        setBalances(next)
        setBalanceError('')
      } catch {
        if (cancelled) return
        setBalanceError('Could not load live on-chain balances, showing local snapshot')
      } finally {
        if (!cancelled) setBalancesLoading(false)
      }
    }

    loadOnchainBalances()
    const id = setInterval(loadOnchainBalances, 30_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [address, fallbackTxHistory, isConnected])

  function sendCoin({ coinId, symbol, amount, usdValue, toAddress, network }) {
    const parsedAmount = parseFloat(amount)
    const txHash = genTxHash()
    const date = new Date().toISOString().split('T')[0]

    setBalances(prev => ({
      ...prev,
      [coinId]: Math.max(0, (prev[coinId] ?? 0) - parsedAmount),
    }))

    const newTx = {
      id: Date.now(),
      type: 'send',
      coin: symbol,
      coinId,
      amount: parsedAmount,
      value: usdValue,
      date,
      to: toAddress.length > 14
        ? `${toAddress.slice(0, 6)}...${toAddress.slice(-4)}`
        : toAddress,
      txHash,
      network: network.name,
      status: 'pending',
    }

    setTxHistory(prev => [newTx, ...prev])

    setTimeout(() => {
      setTxHistory(prev =>
        prev.map(t => t.id === newTx.id ? { ...t, status: 'confirmed' } : t)
      )
    }, 4000)

    return { txHash, tx: newTx }
  }

  function recordOnchainTx({ coinId, symbol, amount, usdValue, toAddress, network, txHash, status }) {
    const parsedAmount = parseFloat(amount)
    const date = new Date().toISOString().split('T')[0]

    const nextTx = {
      id: txHash,
      type: 'send',
      coin: symbol,
      coinId,
      amount: parsedAmount,
      value: usdValue,
      date,
      to: toAddress.length > 14
        ? `${toAddress.slice(0, 6)}...${toAddress.slice(-4)}`
        : toAddress,
      txHash,
      network: network.name,
      status,
    }

    setTxHistory(prev => {
      const idx = prev.findIndex(t => t.txHash === txHash)
      if (idx === -1) return [nextTx, ...prev]

      const updated = [...prev]
      updated[idx] = { ...updated[idx], ...nextTx }
      return updated
    })
  }

  function sellP2P({ coinId, symbol, amount, inrValue, bankName, accountNumber, ifsc, holderName }) {
    const parsedAmount = parseFloat(amount)
    const parsedInr = parseFloat(inrValue)

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error('Enter a valid crypto amount')
    }
    if (!Number.isFinite(parsedInr) || parsedInr <= 0) {
      throw new Error('INR value must be greater than 0')
    }

    const currentBalance = balances[coinId] ?? 0
    if (parsedAmount > currentBalance) {
      throw new Error('Insufficient balance for this sell request')
    }

    const date = new Date().toISOString().split('T')[0]
    const txHash = genTxHash()
    const maskedAccount = accountNumber.length > 4
      ? `****${accountNumber.slice(-4)}`
      : accountNumber

    setBalances(prev => ({
      ...prev,
      [coinId]: Math.max(0, (prev[coinId] ?? 0) - parsedAmount),
    }))

    const newTx = {
      id: Date.now(),
      type: 'p2p_sell',
      coin: symbol,
      coinId,
      amount: parsedAmount,
      value: parsedInr,
      date,
      to: `${bankName} ${maskedAccount}`,
      ifsc,
      holderName,
      txHash,
      network: 'P2P',
      status: 'pending',
    }

    setTxHistory(prev => [newTx, ...prev])

    setTimeout(() => {
      setTxHistory(prev =>
        prev.map(t => t.id === newTx.id ? { ...t, status: 'confirmed' } : t)
      )
    }, 5000)

    return { txHash, tx: newTx }
  }

  return (
    <WalletContext.Provider
      value={{
        balances,
        txHistory,
        sendCoin,
        recordOnchainTx,
        sellP2P,
        balancesLoading,
        balanceError,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
