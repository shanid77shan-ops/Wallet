import { useEffect, useMemo, useState } from 'react'
import { IndianRupee, Landmark, ShieldCheck, Clock3 } from 'lucide-react'
import { useCoins } from '../context/CoinContext'
import { useXDTWallet } from '../context/XDTWalletContext'
import { fetchUsdInrRate } from '../services/forexApi'
import CoinImage from '../components/CoinImage'
import BackButton from '../components/BackButton'
import './P2P.css'

const DEFAULT_INR_RATE = 83.2
const PLATFORM_FEE_PCT = 0.35

const fmtInr = (n) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtUsd = (n) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function P2P() {
  const { coins, loading } = useCoins()
  const { txHistory } = useXDTWallet()
  // P2P sell is not yet wired to the HD wallet — show coming-soon placeholder
  const sellP2P = () => { throw new Error('P2P sell coming soon') }

  const sellableCoins = useMemo(() => coins.filter((c) => c.balance > 0), [coins])
  const [selectedId, setSelectedId] = useState('')
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [holderName, setHolderName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [inrRate, setInrRate] = useState(DEFAULT_INR_RATE)

  useEffect(() => {
    let cancelled = false

    async function loadRate() {
      try {
        const nextRate = await fetchUsdInrRate()
        if (!cancelled) setInrRate(nextRate)
      } catch {
        if (!cancelled) setInrRate(DEFAULT_INR_RATE)
      }
    }

    loadRate()
    const id = setInterval(loadRate, 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const selectedCoin = useMemo(
    () => sellableCoins.find((c) => c.id === selectedId) ?? sellableCoins[0],
    [sellableCoins, selectedId]
  )

  const parsedAmount = parseFloat(amount || 0)
  const usdValue = (selectedCoin?.price ?? 0) * (Number.isFinite(parsedAmount) ? parsedAmount : 0)
  const grossInr = usdValue * inrRate
  const fee = grossInr * (PLATFORM_FEE_PCT / 100)
  const netInr = Math.max(0, grossInr - fee)

  const recentP2P = txHistory.filter((tx) => tx.type === 'p2p_sell').slice(0, 5)

  const setPctAmount = (pct) => {
    if (!selectedCoin) return
    const value = (selectedCoin.balance * pct) / 100
    setAmount(value.toFixed(6))
  }

  const validate = () => {
    if (!selectedCoin) return 'No sellable coins available.'
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return 'Enter a valid crypto amount.'
    if (parsedAmount > selectedCoin.balance) return 'Amount exceeds your available balance.'
    if (bankName.trim().length < 2) return 'Enter your bank name.'
    if (!/^\d{9,18}$/.test(accountNumber.trim())) return 'Account number must be 9-18 digits.'
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())) return 'Enter a valid IFSC (example: HDFC0123456).'
    if (holderName.trim().length < 3) return 'Enter account holder name.'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setFeedback('')

    const issue = validate()
    if (issue) {
      setError(issue)
      return
    }

    try {
      setSubmitting(true)
      const res = sellP2P({
        coinId: selectedCoin.id,
        symbol: selectedCoin.symbol,
        amount: parsedAmount,
        inrValue: netInr,
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        holderName: holderName.trim(),
      })

      setFeedback(`Sell order placed. Payout will be credited shortly. Ref: ${res.txHash.slice(0, 12)}...`)
      setAmount('')
    } catch (err) {
      setError(err?.message || 'Unable to place P2P sell order.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p2p-page">
      <div className="p2p-top-bar">
        <BackButton to="/" />
        <h1 className="p2p-page-title">P2P Exchange</h1>
        <div />
      </div>
      <div className="p2p-hero">
        <div className="p2p-header">
          <p>Sell crypto and receive INR directly in your bank account.</p>
        </div>

        <div className="p2p-hero-stats">
          <div className="hero-stat">
            <span>Rate</span>
            <strong>1 USD = {inrRate.toFixed(2)} INR</strong>
          </div>
          <div className="hero-stat">
            <span>Fee</span>
            <strong>{PLATFORM_FEE_PCT}%</strong>
          </div>
        </div>
      </div>

      <div className="p2p-trust-row">
        <div className="trust-chip"><ShieldCheck size={14} /> Verified payout partner</div>
        <div className="trust-chip"><Clock3 size={14} /> Typical settlement: 5-15 min</div>
      </div>

      <div className="p2p-layout">
        <form className="p2p-card trade-card" onSubmit={handleSubmit}>
          <div className="section-title">Sell Crypto</div>

          <label className="field-label">Coin</label>
          <select
            className="p2p-input"
            value={selectedCoin?.id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loading || sellableCoins.length === 0}
          >
            {sellableCoins.length === 0 && <option value="">No assets available</option>}
            {sellableCoins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.symbol} - {coin.name} (Balance: {coin.balance})
              </option>
            ))}
          </select>

          {selectedCoin && (
            <div className="selected-coin-row">
              <CoinImage coin={selectedCoin} size={34} />
              <div className="selected-coin-meta">
                <div>{selectedCoin.name}</div>
                <span>
                  Available: {selectedCoin.balance} {selectedCoin.symbol}
                </span>
              </div>
            </div>
          )}

          <label className="field-label">Amount ({selectedCoin?.symbol ?? 'Coin'})</label>
          <input
            className="p2p-input"
            type="number"
            min="0"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="amount-shortcuts">
            {[25, 50, 75, 100].map((p) => (
              <button type="button" key={p} className="shortcut-btn" onClick={() => setPctAmount(p)}>
                {p}%
              </button>
            ))}
          </div>

          <div className="quote-box">
            <div className="quote-row">
              <span>Estimated USD Value</span>
              <strong>${fmtUsd(usdValue)}</strong>
            </div>
            <div className="quote-row">
              <span>INR Conversion</span>
              <strong><IndianRupee size={14} /> {fmtInr(grossInr)}</strong>
            </div>
            <div className="quote-row muted">
              <span>Platform Fee ({PLATFORM_FEE_PCT}%)</span>
              <strong>- <IndianRupee size={14} /> {fmtInr(fee)}</strong>
            </div>
            <div className="quote-row total">
              <span>You Receive</span>
              <strong><IndianRupee size={14} /> {fmtInr(netInr)}</strong>
            </div>
          </div>

          <div className="section-title with-gap">Bank Details</div>

          <label className="field-label">Account Holder Name</label>
          <input
            className="p2p-input"
            type="text"
            placeholder="Enter account holder name"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
          />

          <label className="field-label">Bank Name</label>
          <input
            className="p2p-input"
            type="text"
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />

          <div className="bank-grid">
            <div>
              <label className="field-label">Account Number</label>
              <input
                className="p2p-input"
                type="text"
                inputMode="numeric"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div>
              <label className="field-label">IFSC Code</label>
              <input
                className="p2p-input"
                type="text"
                placeholder="e.g. HDFC0123456"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {error && <div className="p2p-message error">{error}</div>}
          {feedback && <div className="p2p-message success">{feedback}</div>}

          <button
            type="submit"
            className="p2p-submit"
            disabled={submitting || !selectedCoin || sellableCoins.length === 0}
          >
            <Landmark size={16} />
            {submitting ? 'Placing order...' : 'Sell Crypto to Bank'}
          </button>
        </form>

        <div className="p2p-card history-card">
          <div className="section-title">Recent P2P Orders</div>
          {recentP2P.length === 0 ? (
            <p className="empty-note">No P2P orders yet.</p>
          ) : (
            <div className="p2p-history-list">
              {recentP2P.map((tx) => (
                <div key={tx.id} className="history-row">
                  <div>
                    <strong>{tx.amount} {tx.coin}</strong>
                    <span>{tx.to}</span>
                  </div>
                  <div className="history-right">
                    <strong>{tx.value.toLocaleString('en-IN')} INR</strong>
                    <span className={tx.status === 'confirmed' ? 'ok' : 'pending'}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
