import { useState, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, Info, Zap, Search, X } from 'lucide-react'
import { useCoins } from '../context/CoinContext'
import CoinImage from '../components/CoinImage'
import './Trade.css'

const fmt = (n) => n >= 1 ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toFixed(6)

const pcts = [25, 50, 75, 100]

function CoinPickerModal({ coins, onSelect, onClose, title }) {
  const [q, setQ] = useState('')
  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.symbol.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-drag" />
        <div className="picker-header">
          <span className="picker-title">{title}</span>
          <button className="picker-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="picker-search-wrap">
          <Search size={15} color="var(--text-muted)" />
          <input
            className="picker-search"
            placeholder="Search coins..."
            value={q}
            onChange={e => setQ(e.target.value)}
            autoFocus
          />
          {q && <button className="picker-clear" onClick={() => setQ('')}>✕</button>}
        </div>
        <div className="picker-list">
          {filtered.length === 0 && (
            <div className="picker-empty">No coins found for "{q}"</div>
          )}
          {filtered.map(c => (
            <button key={c.id} className="picker-row" onClick={() => { onSelect(c); onClose() }}>
              <CoinImage coin={c} size={40} />
              <div className="picker-coin-info">
                <span className="picker-coin-name">{c.name}</span>
                <span className="picker-coin-sym">{c.symbol}</span>
              </div>
              <div className="picker-coin-right">
                <span className="picker-coin-price">
                  ${(c.price ?? 0) >= 1
                    ? (c.price ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })
                    : (c.price ?? 0).toFixed(6)}
                </span>
                <span className={(c.change24h ?? 0) >= 0 ? 'positive' : 'negative'}>
                  {(c.change24h ?? 0) >= 0 ? '+' : ''}{(c.change24h ?? 0).toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Trade() {
  const { coins, loading } = useCoins()
  const [mode, setMode] = useState('buy')
  const [fromCoin, setFromCoin] = useState(null)
  const [toCoin, setToCoin] = useState(null)
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSlippage, setShowSlippage] = useState(false)
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker] = useState(false)

  useEffect(() => {
    if (coins.length > 0 && !fromCoin) {
      setFromCoin(coins[0])
      setToCoin(coins[1])
    }
  }, [coins, fromCoin])

  // Keep fromCoin/toCoin price in sync with live updates
  useEffect(() => {
    if (fromCoin) {
      const updated = coins.find(c => c.id === fromCoin.id)
      if (updated) setFromCoin(updated)
    }
    if (toCoin) {
      const updated = coins.find(c => c.id === toCoin.id)
      if (updated) setToCoin(updated)
    }
  }, [coins])

  const price = fromCoin?.price ?? 0
  const outCoinPrice = toCoin?.price ?? 1
  const usdValue = parseFloat(amount || 0) * price
  const receiveAmt = outCoinPrice > 0 ? usdValue / outCoinPrice : 0

  const handlePct = (pct) => {
    if (!fromCoin) return
    if (mode === 'sell' || mode === 'swap') {
      setAmount((fromCoin.balance * pct / 100).toFixed(6))
    } else {
      setAmount(((10000 * pct / 100) / (price || 1)).toFixed(6))
    }
  }

  if (loading || !fromCoin || !toCoin) {
    return (
      <div className="trade-page">
        <div className="page-header"><h1>Trade</h1></div>
        <div className="mode-tabs">
          {['buy', 'sell', 'swap'].map(m => (
            <button key={m} className={`mode-tab${mode === m ? ' active ' + m : ''}`} onClick={() => setMode(m)}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div className="trade-skeleton" />
        <div className="trade-skeleton" style={{ height: 48, marginTop: 8 }} />
      </div>
    )
  }

  return (
    <div className="trade-page">
      <div className="page-header">
        <h1>Trade</h1>
        <button className="icon-btn-sm" onClick={() => setShowSlippage(s => !s)}>
          <Zap size={18} />
        </button>
      </div>

      <div className="mode-tabs">
        {['buy', 'sell', 'swap'].map(m => (
          <button key={m} className={`mode-tab${mode === m ? ' active ' + m : ''}`} onClick={() => setMode(m)}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {showSlippage && (
        <div className="slippage-panel">
          <div className="slippage-header">
            <span>Slippage Tolerance</span>
            <Info size={14} color="var(--text-muted)" />
          </div>
          <div className="slippage-options">
            {['0.1', '0.5', '1.0'].map(s => (
              <button key={s} className={`slip-btn${slippage === s ? ' active' : ''}`} onClick={() => setSlippage(s)}>
                {s}%
              </button>
            ))}
            <input className="slip-input" value={slippage} onChange={e => setSlippage(e.target.value)} placeholder="Custom" />
          </div>
        </div>
      )}

      {/* From Card */}
      <div className="trade-card">
        <div className="trade-card-label">{mode === 'swap' ? 'From' : mode === 'buy' ? 'Spend' : 'Sell'}</div>
        <div className="trade-row">
          <button className="coin-picker-btn" onClick={() => setShowFromPicker(true)}>
            <CoinImage coin={fromCoin} size={28} />
            <span className="picker-symbol">{fromCoin.symbol}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>
          <input
            className="amount-input"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="trade-sub-row">
          <span className="balance-hint">Balance: {fromCoin.balance} {fromCoin.symbol}</span>
          <span className="usd-equiv">${fmt(usdValue)}</span>
        </div>
        <div className="pct-row">
          {pcts.map(p => <button key={p} className="pct-btn" onClick={() => handlePct(p)}>{p}%</button>)}
        </div>
      </div>

      {mode === 'swap' ? (
        <button className="swap-arrow-btn" onClick={() => { const t = fromCoin; setFromCoin(toCoin); setToCoin(t) }}>
          <ArrowUpDown size={18} />
        </button>
      ) : (
        <div className="rate-pill">1 {fromCoin.symbol} = ${fmt(fromCoin.price ?? 0)}</div>
      )}

      {(mode === 'buy' || mode === 'swap') && (
        <div className="trade-card">
          <div className="trade-card-label">{mode === 'swap' ? 'To' : 'Receive'}</div>
          <div className="trade-row">
            <button className="coin-picker-btn" onClick={() => setShowToPicker(true)}>
              <CoinImage coin={toCoin} size={28} />
              <span className="picker-symbol">{toCoin.symbol}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>
            <div className="receive-amount">{receiveAmt > 0 ? receiveAmt.toFixed(6) : '0.000000'}</div>
          </div>
          <div className="trade-sub-row">
            <span className="balance-hint">Balance: {toCoin.balance} {toCoin.symbol}</span>
            <span className="usd-equiv">${fmt(usdValue)}</span>
          </div>
        </div>
      )}

      {parseFloat(amount) > 0 && (
        <div className="trade-details">
          <div className="detail-row"><span>Price Impact</span><span className="positive">{'< 0.01%'}</span></div>
          <div className="detail-row"><span>Network Fee</span><span>~$2.40</span></div>
          <div className="detail-row"><span>Slippage</span><span>{slippage}%</span></div>
          {mode === 'swap' && (
            <div className="detail-row">
              <span>Min. Received</span>
              <span>{(receiveAmt * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toCoin.symbol}</span>
            </div>
          )}
        </div>
      )}

      <button
        className={`trade-cta-btn ${mode}`}
        disabled={!amount || parseFloat(amount) <= 0}
      >
        {mode === 'buy'  && `Buy ${fromCoin.symbol}`}
        {mode === 'sell' && `Sell ${fromCoin.symbol}`}
        {mode === 'swap' && `Swap ${fromCoin.symbol} → ${toCoin.symbol}`}
      </button>

      {/* Popular Pairs */}
      <div className="market-overview">
        <h3>Popular Pairs</h3>
        <div className="pairs-scroll">
          {coins.slice(0, 8).map(c => (
            <button key={c.id} className="pair-card" onClick={() => { setFromCoin(c); setAmount('') }}>
              <CoinImage coin={c} size={28} />
              <div className="pair-symbol">{c.symbol}/USD</div>
              <div className="pair-price">
                ${(c.price ?? 0) >= 1
                  ? (c.price ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })
                  : (c.price ?? 0).toFixed(4)}
              </div>
              <div className={`pair-change ${(c.change24h ?? 0) >= 0 ? 'positive' : 'negative'}`}>
                {(c.change24h ?? 0) >= 0 ? '+' : ''}{(c.change24h ?? 0).toFixed(2)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFromPicker && (
        <CoinPickerModal coins={coins} title="Select coin to spend" onSelect={setFromCoin} onClose={() => setShowFromPicker(false)} />
      )}
      {showToPicker && (
        <CoinPickerModal coins={coins} title="Select coin to receive" onSelect={setToCoin} onClose={() => setShowToPicker(false)} />
      )}
    </div>
  )
}
