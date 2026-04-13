/**
 * TxHistorySheet.jsx
 * Full-screen bottom-sheet showing complete transaction history.
 * - Pulls live data from Etherscan (ETH + USDT ERC-20) and Tronscan (USDT TRC-20).
 * - Filter tabs: All · ETH · USDT ERC-20 · USDT TRC-20
 * - Groups rows by date.
 * - Links each tx to the appropriate block explorer.
 */
import { useState, useEffect, useCallback } from 'react'
import { ArrowUpRight, ArrowDown, X, ArrowClockwise, ArrowSquareOut } from '@phosphor-icons/react'
import { getRecentETHTxs, getRecentUSDTERC20Txs } from '../services/ethChainService'
import { getRecentTRC20Txs } from '../services/tronChainService'
import './TxHistorySheet.css'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtAmt(n, decimals = 4) {
  if (!n && n !== 0) return '—'
  const num = parseFloat(n)
  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

function dayLabel(ts) {
  if (!ts) return 'Unknown date'
  const d   = new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function dayKey(ts) {
  if (!ts) return 'unknown'
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function explorerUrl(tx) {
  const net = tx.network ?? ''
  if (net === 'TRC-20' || net === 'TRC20') return `https://tronscan.org/#/transaction/${tx.txID}`
  return `https://etherscan.io/tx/${tx.txID}`
}

const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'eth',      label: 'ETH' },
  { key: 'usdt-erc', label: 'USDT ERC-20' },
  { key: 'usdt-trc', label: 'USDT TRC-20' },
]

function matchFilter(tx, filter) {
  if (filter === 'all') return true
  const sym = (tx.symbol ?? '').toUpperCase()
  const net = (tx.network ?? '').toUpperCase()
  if (filter === 'eth')      return sym === 'ETH'
  if (filter === 'usdt-erc') return sym === 'USDT' && (net === 'ERC-20' || net === 'ETHEREUM' || net === 'ERC20')
  if (filter === 'usdt-trc') return sym === 'USDT' && (net === 'TRC-20' || net === 'TRON' || net === 'TRC20')
  return true
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TxHistorySheet({ onClose, ethAddress, tronAddress, initialTxs = [] }) {
  const [filter,    setFilter]    = useState('all')
  const [txs,       setTxs]       = useState(initialTxs)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const fetchAll = useCallback(async () => {
    if (!ethAddress && !tronAddress) return
    setLoading(true)
    setError('')
    try {
      const [ethRes, ercRes, trcRes] = await Promise.allSettled([
        ethAddress  ? getRecentETHTxs(ethAddress, 50)         : Promise.resolve([]),
        ethAddress  ? getRecentUSDTERC20Txs(ethAddress, 50)   : Promise.resolve([]),
        tronAddress ? getRecentTRC20Txs(tronAddress, 50)      : Promise.resolve([]),
      ])

      const fresh = [
        ...(ethRes.status === 'fulfilled' ? ethRes.value : []),
        ...(ercRes.status === 'fulfilled' ? ercRes.value : []),
        ...(trcRes.status === 'fulfilled' ? trcRes.value : []),
      ]

      if (fresh.length > 0) {
        // Merge with cached, deduplicate by txID
        setTxs(prev => {
          const seen    = new Set(fresh.map(t => t.txID))
          const merged  = [
            ...fresh,
            ...prev.filter(t => !seen.has(t.txID)),
          ].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
          return merged
        })
      } else if (txs.length === 0) {
        setError('No transactions found for this address.')
      }
    } catch {
      setError('Could not load transactions. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [ethAddress, tronAddress])

  // Fetch on mount
  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Filtered + grouped ────────────────────────────────────────────────────
  const filtered = txs.filter(tx => matchFilter(tx, filter))

  // Group by calendar day
  const groups = []
  const seenDays = new Map()
  for (const tx of filtered) {
    const dk = dayKey(tx.timestamp)
    if (!seenDays.has(dk)) {
      seenDays.set(dk, groups.length)
      groups.push({ label: dayLabel(tx.timestamp), txs: [] })
    }
    groups[seenDays.get(dk)].txs.push(tx)
  }

  return (
    <div className="txh-overlay" onClick={onClose}>
      <div className="txh-sheet" onClick={e => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="txh-header">
          <div className="txh-drag-bar" />
          <div className="txh-header-row">
            <h2 className="txh-title">Transaction History</h2>
            <div className="txh-header-actions">
              <button
                className={`txh-refresh-btn${loading ? ' spinning' : ''}`}
                onClick={fetchAll}
                disabled={loading}
                title="Refresh"
              >
                <ArrowClockwise size={18} weight="bold" />
              </button>
              <button className="txh-close-btn" onClick={onClose}>
                <X size={20} weight="bold" />
              </button>
            </div>
          </div>

          {/* Address pills */}
          <div className="txh-addr-pills">
            {ethAddress && (
              <span className="txh-pill txh-pill-eth" title={ethAddress}>
                <span className="txh-dot" style={{ background: '#627eea' }} />
                {ethAddress.slice(0, 8)}…{ethAddress.slice(-4)}
              </span>
            )}
            {tronAddress && (
              <span className="txh-pill txh-pill-trc" title={tronAddress}>
                <span className="txh-dot" style={{ background: '#eb0029' }} />
                {tronAddress.slice(0, 8)}…{tronAddress.slice(-4)}
              </span>
            )}
          </div>

          {/* Filter tabs */}
          <div className="txh-filters">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`txh-filter-tab${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <div className="txh-body">
          {loading && filtered.length === 0 && (
            <div className="txh-loading">
              <ArrowClockwise size={26} className="txh-spin" />
              <p>Loading transactions…</p>
            </div>
          )}

          {!loading && error && filtered.length === 0 && (
            <div className="txh-empty">
              <p>{error}</p>
              <button className="txh-retry-btn" onClick={fetchAll}>Retry</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && txs.length > 0 && (
            <div className="txh-empty"><p>No {filter.toUpperCase()} transactions found.</p></div>
          )}

          {groups.map(group => (
            <div key={group.label} className="txh-group">
              <p className="txh-day-label">{group.label}</p>
              {group.txs.map(tx => {
                const isSend = tx.type === 'send'
                const net    = tx.network === 'TRC20' ? 'TRC-20' : tx.network
                const peer   = isSend ? tx.to : tx.from
                const short  = peer ? `${peer.slice(0, 8)}…${peer.slice(-4)}` : ''
                const time   = tx.timestamp
                  ? new Date(tx.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  : ''
                return (
                  <a
                    key={tx.txID || `${tx.timestamp}-${tx.amount}`}
                    className="txh-row"
                    href={tx.txID ? explorerUrl(tx) : undefined}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => { if (!tx.txID) e.preventDefault() }}
                  >
                    <div className={`txh-icon ${isSend ? 'send' : 'recv'}`}>
                      {isSend
                        ? <ArrowUpRight size={15} weight="bold" />
                        : <ArrowDown    size={15} weight="bold" />}
                    </div>

                    <div className="txh-row-info">
                      <div className="txh-row-top">
                        <span className="txh-row-label">
                          {isSend ? 'Sent' : 'Received'} {tx.symbol}
                        </span>
                        <span className={`txh-row-amt ${isSend ? 'neg' : 'pos'}`}>
                          {isSend ? '−' : '+'}{fmtAmt(tx.amount)} {tx.symbol}
                        </span>
                      </div>
                      <div className="txh-row-bot">
                        <span className="txh-row-meta">
                          <span className={`txh-net-badge ${net === 'TRC-20' ? 'trc' : net === 'ERC-20' ? 'erc' : 'eth'}`}>
                            {net}
                          </span>
                          {short && (
                            <span className="txh-peer">
                              {isSend ? 'To:' : 'From:'} {short}
                            </span>
                          )}
                        </span>
                        <span className="txh-row-time">
                          {time}
                          {tx.txID && <ArrowSquareOut size={11} style={{ marginLeft: 3 }} />}
                        </span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
