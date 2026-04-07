import { createContext, useContext, useState } from 'react'
import { coins as staticCoins, transactions as staticTxs } from '../data/coins'

const WalletContext = createContext(null)

function genTxHash() {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

const initialBalances = Object.fromEntries(staticCoins.map(c => [c.id, c.balance]))

export function WalletProvider({ children }) {
  const [balances, setBalances] = useState(initialBalances)
  const [txHistory, setTxHistory] = useState(
    staticTxs.map(t => ({ ...t, status: 'confirmed', txHash: genTxHash(), network: 'Unknown' }))
  )

  function sendCoin({ coinId, symbol, amount, usdValue, toAddress, network }) {
    const parsedAmount = parseFloat(amount)
    const txHash = genTxHash()
    const date = new Date().toISOString().split('T')[0]

    // Deduct balance
    setBalances(prev => ({
      ...prev,
      [coinId]: Math.max(0, (prev[coinId] ?? 0) - parsedAmount),
    }))

    // Add pending tx
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

    // Simulate confirmation after 4 seconds
    setTimeout(() => {
      setTxHistory(prev =>
        prev.map(t => t.id === newTx.id ? { ...t, status: 'confirmed' } : t)
      )
    }, 4000)

    return { txHash, tx: newTx }
  }

  return (
    <WalletContext.Provider value={{ balances, txHistory, sendCoin }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
