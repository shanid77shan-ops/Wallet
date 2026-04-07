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
    <WalletContext.Provider value={{ balances, txHistory, sendCoin, sellP2P }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
