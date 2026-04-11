/**
 * CoinDetail.jsx — per-token detail screen
 * Real-time price chart (CoinGecko) + Send / Receive sheets
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  ArrowLeft, ArrowUpRight, ArrowDown, Copy, X,
} from '@phosphor-icons/react'
import { QRCodeSVG } from 'qrcode.react'
import { useXDTWallet } from '../context/XDTWalletContext'
import { fmtUSD, fmtToken } from '../services/xdtPriceService'
import './CoinDetail.css'

// ── Constants ─────────────────────────────────────────────────────────────────
// Maps any token id variant → CoinGecko chart id
const COINGECKO_IDS = {
  'eth':      'ethereum',
  'ethereum': 'ethereum',
  'usdt':     'tether',
  'tether':   'tether',
  'usdt-erc': 'tether',
  'usdt-trc': 'tether',
}

const PERIODS = [
  { label: '1D', days: 1  },
  { label: '7D', days: 7  },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
]

const chartCache = {}

async function fetchChartData(tokenId, days) {
  const key = `${tokenId}_${days}`
  if (chartCache[key] && Date.now() - chartCache[key].ts < 60_000) {
    return chartCache[key].data
  }
  const coinId = COINGECKO_IDS[tokenId]
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  )
  if (!res.ok) throw new Error('Chart fetch failed')
  const json = await res.json()

  let data = json.prices.map(([ts, price]) => ({ time: ts, price }))
  // Downsample large datasets to ≤120 pts for performance
  if (data.length > 120) {
    const step = Math.ceil(data.length / 120)
    data = data.filter((_, i) => i % step === 0)
  }
  chartCache[key] = { data, ts: Date.now() }
  return data
}

function xLabel(ts, days) {
  const d = new Date(ts)
  if (days <= 1)  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (days <= 7)  return d.toLocaleDateString('en-US', { weekday: 'short' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Shared sub-components ────────────────────────────────────────────────────
function NetworkBadge({ network }) {
  const cls = network === 'ERC-20' ? 'badge-erc' : network === 'TRC-20' ? 'badge-trc' : 'badge-eth'
  return <span className={`net-badge ${cls}`}>{network}</span>
}

function NetSelector({ value, onChange }) {
  return (
    <div className="net-selector">
      <button
        type="button"
        className={`net-sel-btn ${value === 'erc' ? 'active erc' : ''}`}
        onClick={() => onChange('erc')}
      >
        <span className="net-dot erc-dot" /> ERC-20 · Ethereum
      </button>
      <button
        type="button"
        className={`net-sel-btn ${value === 'trc' ? 'active trc' : ''}`}
        onClick={() => onChange('trc')}
      >
        <span className="net-dot trc-dot" /> TRC-20 · TRON
      </button>
    </div>
  )
}

function TokenIcon({ id }) {
  if (id === 'eth')                    return <div className="cd-tok-icon eth">Ξ</div>
  if (id === 'usdt' || id === 'usdt-erc' || id === 'usdt-trc') return <div className="cd-tok-icon erc">₮</div>
  return <div className="cd-tok-icon">?</div>
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return <div className="cd-chart-tooltip">{fmtUSD(payload[0].value)}</div>
}

// ── Send Sheet ────────────────────────────────────────────────────────────────
function SendSheet({ token, onClose, ethAddress, tronAddress }) {
  const { sendToken, prices } = useXDTWallet()

  const isUSDT = token.id === 'usdt'
  const [selNet,  setSelNet]  = useState('erc')
  const [to,      setTo]      = useState('')
  const [amount,  setAmount]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [txHash,  setTxHash]  = useState('')

  const tokenId = isUSDT ? (selNet === 'erc' ? 'usdt-erc' : 'usdt-trc') : token.id
  const isTRC   = tokenId === 'usdt-trc'
  const maxBal  = isUSDT
    ? (selNet === 'erc' ? (token.ercBalance ?? 0) : (token.trcBalance ?? 0))
    : token.balance
  const network = isTRC ? 'TRC-20' : tokenId === 'usdt-erc' ? 'ERC-20' : token.network
  const price   = token.symbol === 'ETH' ? prices.eth : prices.usdt
  const usdVal  = amount ? (parseFloat(amount) * price).toFixed(2) : '0.00'

  function handleNetChange(net) { setSelNet(net); setTo(''); setError('') }

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    if (!to.trim())                         { setError('Enter a recipient address.'); return }
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount.'); return }
    if (parseFloat(amount) > maxBal)        { setError('Insufficient balance.'); return }

    if (isTRC) {
      if (!to.trim().startsWith('T') || to.trim().length < 30) {
        setError('Enter a valid TRON address (starts with T).'); return
      }
    } else {
      if (!to.trim().startsWith('0x') || to.trim().length !== 42) {
        setError('Enter a valid Ethereum address (0x…).'); return
      }
    }

    setLoading(true)
    try {
      const hash = await sendToken({ tokenId, toAddress: to.trim(), amount })
      setTxHash(hash)
    } catch (err) {
      setError(err.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  if (txHash) {
    const explorer = isTRC
      ? `https://tronscan.org/#/transaction/${txHash}`
      : `https://etherscan.io/tx/${txHash}`
    return (
      <div className="sheet-overlay" onClick={onClose}>
        <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
          <div className="sheet-header">
            <h3>Transaction Sent!</h3>
            <button className="sheet-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="tx-success">
            <div className="tx-success-icon">✓</div>
            <p className="tx-success-label">Your {token.symbol} is on the way</p>
            <a className="tx-explorer-link" href={explorer} target="_blank" rel="noreferrer">
              View on {isTRC ? 'TronScan' : 'Etherscan'} ↗
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-header">
          <h3>Send {token.symbol} {!isUSDT && <NetworkBadge network={network} />}</h3>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>

        {isUSDT && <NetSelector value={selNet} onChange={handleNetChange} />}

        <form className="sheet-form" onSubmit={handleSend}>
          <div className="sheet-balance-hint">
            Balance: <strong>{fmtToken(maxBal)} {token.symbol}</strong>
            {isUSDT && <NetworkBadge network={network} />}
          </div>
          <div className="input-group">
            <label>
              Recipient Address
              <span className="input-hint">({isTRC ? 'TRON T… address' : 'Ethereum 0x… address'})</span>
            </label>
            <input
              type="text" autoComplete="off" autoCapitalize="none"
              placeholder={isTRC ? 'TXxx…' : '0x…'}
              value={to}
              onChange={e => { setTo(e.target.value); setError('') }}
            />
          </div>
          <div className="input-group">
            <label>
              Amount ({token.symbol})
              <button type="button" className="max-btn"
                onClick={() => setAmount(String(maxBal))}>MAX</button>
            </label>
            <input
              type="number" step="any" min="0" placeholder="0.00"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError('') }}
            />
            {amount && <p className="usd-equiv">≈ ${usdVal} USD</p>}
          </div>
          {error && <p className="sheet-error">{error}</p>}
          {tokenId === 'eth'      && <p className="sheet-notice">⛽ Gas fee deducted from your ETH balance.</p>}
          {tokenId === 'usdt-erc' && <p className="sheet-notice">⛽ ETH needed in wallet to pay ERC-20 gas fee.</p>}
          {tokenId === 'usdt-trc' && <p className="sheet-notice">⚡ TRX needed for energy/bandwidth to send TRC-20.</p>}
          <button type="submit" className="sheet-submit-btn" disabled={loading}>
            {loading ? 'Broadcasting…' : `Send ${token.symbol}`}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Receive Sheet ─────────────────────────────────────────────────────────────
function ReceiveSheet({ token, onClose, ethAddress, tronAddress }) {
  const isUSDT = token.id === 'usdt'
  const [selNet, setSelNet] = useState('erc')
  const [copied, setCopied] = useState(false)

  const isTRC   = isUSDT ? selNet === 'trc' : token.id === 'usdt-trc'
  const address = isTRC ? tronAddress : ethAddress
  const network = isTRC ? 'TRC-20' : 'ERC-20'

  function copy(text) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleNetChange(net) { setSelNet(net); setCopied(false) }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-header">
          <h3>Receive {token.symbol} {!isUSDT && <NetworkBadge network={token.network} />}</h3>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>

        {isUSDT && <NetSelector value={selNet} onChange={handleNetChange} />}

        <div className="receive-body">
          <div className="qr-wrap">
            <QRCodeSVG value={address || 'xdt'} size={180} bgColor="#ffffff" fgColor="#000000" includeMargin />
          </div>
          <p className="receive-hint">
            Only send <strong>{token.symbol} ({network})</strong> to this address.
          </p>
          <div className="address-row" onClick={() => copy(address)}>
            <span className="address-text">{address}</span>
            <Copy size={18} color={copied ? '#10b981' : '#6c7f9f'} />
          </div>
          {copied && <p className="copied-msg">Copied!</p>}
          {isTRC && (
            <p className="receive-warning">⚠️ This is a <strong>TRON</strong> address. Do not send ERC-20 tokens here.</p>
          )}
          {!isTRC && token.id !== 'eth' && (
            <p className="receive-warning">⚠️ This is an <strong>Ethereum</strong> address. Do not send TRC-20 tokens here.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CoinDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tokens, keys, prices } = useXDTWallet()

  // Normalize: Home/Assets navigate with CoinGecko IDs (ethereum, tether)
  // but wallet tokens use (eth, usdt-erc, usdt-trc)
  const isUsdt = id === 'tether'   || id === 'usdt'
  const isEth  = id === 'ethereum' || id === 'eth'

  const usdtErc = tokens.find(t => t.id === 'usdt-erc')
  const usdtTrc = tokens.find(t => t.id === 'usdt-trc')
  const ethWalletToken = tokens.find(t => t.id === 'eth')

  const token = isUsdt
    ? {
        id:         'usdt',
        symbol:     'USDT',
        name:       'Tether USD',
        network:    'ERC-20 · TRC-20',
        color:      '#26a17b',
        balance:    (usdtErc?.balance ?? 0) + (usdtTrc?.balance ?? 0),
        ercBalance: usdtErc?.balance ?? 0,
        trcBalance: usdtTrc?.balance ?? 0,
      }
    : isEth
      ? {
          id:      'eth',
          symbol:  'ETH',
          name:    'Ethereum',
          network: 'Ethereum',
          color:   '#627eea',
          balance: ethWalletToken?.balance ?? 0,
        }
      : tokens.find(t => t.id === id)

  const [period,       setPeriod]       = useState(PERIODS[0])
  const [chartData,    setChartData]    = useState([])
  const [chartLoading, setChartLoading] = useState(true)
  const [chartError,   setChartError]   = useState('')
  const [sendOpen,     setSendOpen]     = useState(false)
  const [receiveOpen,  setReceiveOpen]  = useState(false)

  const ethAddress  = keys?.ethAddress  ?? ''
  const tronAddress = keys?.tronAddress ?? ''

  useEffect(() => {
    if (!token) return
    setChartLoading(true)
    setChartError('')
    fetchChartData(token.id, period.days)
      .then(data => setChartData(data))
      .catch(err  => setChartError(err.message))
      .finally(()  => setChartLoading(false))
  }, [token?.id, period.days])

  if (!token) {
    return (
      <div className="cd-page">
        <div className="cd-header">
          <button className="cd-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <span className="cd-title">Token not found</span>
        </div>
      </div>
    )
  }

  const price  = token.symbol === 'ETH' ? prices.eth : prices.usdt
  const change = token.symbol === 'ETH' ? prices.ethChange : prices.usdtChange
  const isUp   = change >= 0
  const color  = isUp ? '#10b981' : '#ef4444'
  const gradId = `cd-grad-${token.id}`

  const pArr  = chartData.map(d => d.price)
  const minP  = pArr.length ? Math.min(...pArr) : 0
  const maxP  = pArr.length ? Math.max(...pArr) : 0
  const pad   = (maxP - minP) * 0.12 || price * 0.01 || 1
  const yDomain = [minP - pad, maxP + pad]

  const yFmt = v => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(2)}`

  return (
    <div className="cd-page">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="cd-header">
        <button className="cd-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="cd-header-center">
          <span className="cd-title">{token.name}</span>
          <NetworkBadge network={token.network} />
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* ── Price Hero ──────────────────────────────────────────────────────── */}
      <div className="cd-hero">
        <div className="cd-hero-left">
          <TokenIcon id={token.id} />
          <div>
            <p className="cd-price">{fmtUSD(price)}</p>
            <p className={`cd-change ${isUp ? 'pos' : 'neg'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}% (24h)
            </p>
          </div>
        </div>
        <div className="cd-balance-block">
          <p className="cd-bal-label">Your balance</p>
          <p className="cd-bal-amount">
            {fmtToken(token.balance, token.symbol === 'ETH' ? 6 : 2)} {token.symbol}
          </p>
          <p className="cd-bal-usd">{fmtUSD(token.balance * price)}</p>
          {token.id === 'usdt' && (
            <div className="cd-net-breakdown">
              <span className="cd-net-line erc">ERC-20: {fmtToken(token.ercBalance, 2)}</span>
              <span className="cd-net-line trc">TRC-20: {fmtToken(token.trcBalance, 2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Period Tabs ─────────────────────────────────────────────────────── */}
      <div className="cd-periods">
        {PERIODS.map(p => (
          <button
            key={p.label}
            className={`cd-period-btn ${period.label === p.label ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Chart ───────────────────────────────────────────────────────────── */}
      <div className="cd-chart-wrap">
        {chartLoading && <div className="cd-chart-skeleton" />}

        {!chartLoading && chartError && (
          <div className="cd-chart-error">Chart data unavailable</div>
        )}

        {!chartLoading && !chartError && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tickFormatter={ts => xLabel(ts, period.days)}
                interval="preserveStartEnd"
                tickCount={4}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={yFmt}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false} tickLine={false}
                width={58}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                dot={false}
                activeDot={{ r: 4, fill: color, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Action Buttons ──────────────────────────────────────────────────── */}
      <div className="cd-actions">
        <button className="cd-action-btn cd-send" onClick={() => setSendOpen(true)}>
          <ArrowUpRight size={20} weight="bold" />
          Send
        </button>
        <button className="cd-action-btn cd-recv" onClick={() => setReceiveOpen(true)}>
          <ArrowDown size={20} weight="bold" />
          Receive
        </button>
      </div>

      {/* ── Sheets ──────────────────────────────────────────────────────────── */}
      {sendOpen && (
        <SendSheet
          token={token}
          onClose={() => setSendOpen(false)}
          ethAddress={ethAddress}
          tronAddress={tronAddress}
        />
      )}
      {receiveOpen && (
        <ReceiveSheet
          token={token}
          onClose={() => setReceiveOpen(false)}
          ethAddress={ethAddress}
          tronAddress={tronAddress}
        />
      )}
    </div>
  )
}
