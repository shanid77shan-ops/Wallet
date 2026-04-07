import { useState } from 'react'
import { Eye, EyeOff, Bell, ArrowDownLeft, ArrowUpRight, Plus, Repeat2, ChevronRight, Search } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { useCoins } from '../context/CoinContext'
import { useWallet } from '../context/WalletContext'
import { portfolioHistory } from '../data/coins'
import LiveIndicator from '../components/LiveIndicator'
import CoinImage from '../components/CoinImage'
import SendSheet from '../components/SendSheet'
import ReceiveSheet from '../components/ReceiveSheet'
import './Home.css'

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const txIcons = {
  receive: { icon: ArrowDownLeft, color: '#10b981', label: 'Received' },
  send:    { icon: ArrowUpRight,  color: '#ef4444', label: 'Sent'     },
  buy:     { icon: Plus,          color: '#3b82f6', label: 'Bought'   },
  sell:    { icon: Repeat2,       color: '#f59e0b', label: 'Sold'     },
}

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return <div className="chart-tooltip"><span>${payload[0].value.toLocaleString()}</span></div>
  }
  return null
}

export default function Home() {
  const [hidden, setHidden] = useState(false)
  const [sheet, setSheet] = useState(null)
  const [assetSearch, setAssetSearch] = useState('')
  const { coins, loading, error, lastUpdated } = useCoins()
  const { txHistory } = useWallet()

  const myCoins = coins.filter(c => c.balance > 0)
  const totalBalance = myCoins.reduce((sum, c) => sum + (c.price ?? 0) * c.balance, 0)
  const totalChange = ((portfolioHistory.at(-1).value - portfolioHistory.at(-2).value) / portfolioHistory.at(-2).value * 100)

  const filteredAssets = myCoins.filter(c =>
    c.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    c.symbol.toLowerCase().includes(assetSearch.toLowerCase())
  )

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="header-left">
          <div className="avatar-small">S</div>
          <div>
            <p className="greeting">Good morning</p>
            <p className="username">ShaN</p>
          </div>
        </div>
        <button className="icon-btn notif-btn">
          <Bell size={20} />
          <span className="notif-dot" />
        </button>
      </div>

      {/* Error Banner */}
      {error && !loading && (
        <div className="error-banner">{error}</div>
      )}

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-card-inner">
          <div className="balance-label">
            <span>Total Balance</span>
            <LiveIndicator lastUpdated={lastUpdated} error={error} />
            <button className="eye-btn" onClick={() => setHidden(h => !h)}>
              {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="balance-amount">
            {hidden ? '••••••••' : loading ? '—' : `$${fmt(totalBalance)}`}
          </div>
          <div className={`balance-change ${totalChange >= 0 ? 'positive' : 'negative'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}% today
          </div>

          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={portfolioHistory} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#9d5cf6" strokeWidth={2} fill="url(#balGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="quick-actions">
            {[
              { icon: ArrowDownLeft, label: 'Receive', color: '#10b981', action: 'receive' },
              { icon: ArrowUpRight,  label: 'Send',    color: '#ef4444', action: 'send'    },
              { icon: Plus,          label: 'Buy',     color: '#7c3aed', action: null      },
              { icon: Repeat2,       label: 'Swap',    color: '#f59e0b', action: null      },
            ].map(({ icon: Icon, label, color, action }) => (
              <button key={label} className="quick-btn" onClick={() => action && setSheet(action)}>
                <div className="quick-icon" style={{ background: `${color}20`, color }}>
                  <Icon size={18} />
                </div>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Assets */}
      <section className="section">
        <div className="section-header">
          <h2>My Assets</h2>
          <button className="see-all">See all <ChevronRight size={14} /></button>
        </div>

        {/* Asset Search */}
        <div className="asset-search">
          <Search size={14} color="var(--text-muted)" />
          <input
            className="asset-search-input"
            placeholder="Search assets..."
            value={assetSearch}
            onChange={e => setAssetSearch(e.target.value)}
          />
        </div>

        <div className="assets-list">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" />)
          ) : (
            filteredAssets.map(coin => {
              const value = (coin.price ?? 0) * coin.balance
              const isPos = (coin.change24h ?? 0) >= 0
              return (
                <div key={coin.id} className="asset-row">
                  <CoinImage coin={coin} size={44} />
                  <div className="asset-info">
                    <div className="asset-top">
                      <span className="asset-name">{coin.name}</span>
                      <span className="asset-value">${fmt(value)}</span>
                    </div>
                    <div className="asset-bot">
                      <span className="asset-symbol">{coin.balance} {coin.symbol}</span>
                      <span className={`asset-change ${isPos ? 'positive' : 'negative'}`}>
                        {isPos ? '+' : ''}{(coin.change24h ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          {!loading && filteredAssets.length === 0 && assetSearch && (
            <p className="no-results">No assets match "{assetSearch}"</p>
          )}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="see-all">See all <ChevronRight size={14} /></button>
        </div>
        <div className="tx-list">
          {txHistory.slice(0, 10).map(tx => {
            const meta = txIcons[tx.type] ?? txIcons.send
            const { icon: Icon, color, label } = meta
            const isIncoming = tx.type === 'receive' || tx.type === 'buy'
            return (
              <div key={tx.id} className="tx-row">
                <div className="tx-icon" style={{ background: `${color}20`, color }}>
                  <Icon size={18} />
                </div>
                <div className="tx-info">
                  <div className="tx-top">
                    <span className="tx-label">
                      {label} {tx.coin}
                      {tx.status === 'pending' && <span className="tx-pending-tag">Pending</span>}
                    </span>
                    <span className={`tx-amount ${isIncoming ? 'positive' : 'negative'}`}>
                      {isIncoming ? '+' : '-'}${fmt(tx.value)}
                    </span>
                  </div>
                  <div className="tx-bot">
                    <span className="tx-detail">{tx.amount} {tx.coin}{tx.network ? ` · ${tx.network}` : ''}</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>
                  {tx.txHash && (
                    <div className="tx-hash-row">
                      <span className="tx-hash-short">{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {sheet === 'send'    && <SendSheet    onClose={() => setSheet(null)} />}
      {sheet === 'receive' && <ReceiveSheet onClose={() => setSheet(null)} />}
    </div>
  )
}
