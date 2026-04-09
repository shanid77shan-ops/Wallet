import { useState } from 'react'
import { Eye, EyeOff, Bell, ArrowDownLeft, ArrowUpRight, Plus, Repeat2, ChevronRight, Search } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { useCoins } from '../context/CoinContext'
import { useWallet } from '../context/WalletContext'
import { useSepoliaBalance } from '../hooks/useSepoliaBalance'
import { useCryptoPrices } from '../hooks/useCryptoPrices'
import { portfolioHistory } from '../data/coins'
import LiveIndicator from '../components/LiveIndicator'
import CoinImage from '../components/CoinImage'
import ReceiveSheet from '../components/ReceiveSheet'
import SendTransaction from '../SendTransaction'
import TransactionList from '../TransactionList'
import './Home.css'

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const PRICE_COINS = [
  { symbol: 'BTC', name: 'Bitcoin',  color: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  { symbol: 'SOL', name: 'Solana',   color: '#9945ff' },
]

const txIcons = {
  receive: { icon: ArrowDownLeft, color: '#10b981', label: 'Received' },
  send:    { icon: ArrowUpRight,  color: '#ef4444', label: 'Sent'     },
  buy:     { icon: Plus,          color: '#3b82f6', label: 'Bought'   },
  sell:    { icon: Repeat2,       color: '#f59e0b', label: 'Sold'     },
  p2p_sell:{ icon: Repeat2,       color: '#22c55e', label: 'P2P Sold' },
}

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return <div className="chart-tooltip"><span>${payload[0].value.toLocaleString()}</span></div>
  }
  return null
}

export default function Home({ session }) {
  const [hidden, setHidden] = useState(false)
  const [sheet, setSheet] = useState(null)
  const [showSupabaseSend, setShowSupabaseSend] = useState(false)
  const [assetSearch, setAssetSearch] = useState('')
  const { coins, loading, error, lastUpdated } = useCoins()
  const { txHistory, walletAddress } = useWallet()
  const { balance: sepoliaBalance, loading: sepoliaLoading, error: sepoliaError } = useSepoliaBalance(walletAddress)
  const { prices, loading: pricesLoading, error: pricesError, lastUpdated: pricesUpdated } = useCryptoPrices()

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
                    <stop offset="5%" stopColor="#d6b25f" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d6b25f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#f4de9c" strokeWidth={2} fill="url(#balGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="quick-actions">
            {[
              { icon: ArrowDownLeft, label: 'Receive', color: '#10b981', action: 'receive' },
              { icon: ArrowUpRight,  label: 'Send',    color: '#ef4444', action: 'send'    },
              { icon: Plus,          label: 'Buy',     color: '#d6b25f', action: null      },
              { icon: Repeat2,       label: 'Swap',    color: '#f59e0b', action: null      },
            ].map(({ icon: Icon, label, color, action }) => (
              <button
                key={label}
                className="quick-btn"
                onClick={() => {
                  if (action === 'send') {
                    setShowSupabaseSend(s => !s)
                    return
                  }
                  if (action) setSheet(action)
                }}
              >
                <div className="quick-icon" style={{ background: `${color}20`, color }}>
                  <Icon size={18} />
                </div>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {showSupabaseSend && session && (
            <SendTransaction session={session} />
          )}
        </div>
      </div>

      {/* Sepolia Testnet Balance */}
      <div className="sepolia-card">
        <div className="sepolia-card-header">
          <div className="sepolia-card-header-left">
            <span className="sepolia-card-label">Sepolia Testnet · ETH Balance</span>
            <span className="sepolia-badge">Testnet</span>
          </div>
          {walletAddress && (
            <a
              className="sepolia-etherscan-link"
              href={`https://sepolia.etherscan.io/address/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              Etherscan ↗
            </a>
          )}
        </div>

        {!walletAddress ? (
          <p className="sepolia-empty">Connect a wallet to view your balance</p>
        ) : sepoliaLoading ? (
          <>
            <div className="skeleton" style={{ height: 28, width: '50%', marginTop: 8, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '30%', marginTop: 6, borderRadius: 6 }} />
          </>
        ) : sepoliaError ? (
          <p className="sepolia-error">{sepoliaError}</p>
        ) : (
          <>
            {/* ETH amount — always show, even when 0 */}
            <p className="sepolia-balance">
              {sepoliaBalance === 0
                ? '0.000000'
                : sepoliaBalance.toFixed(6)
              }
              <span className="sepolia-unit"> ETH</span>
            </p>

            {/* USD equivalent — shows $0.00 when balance or price is 0 */}
            <p className="sepolia-usd">
              {(() => {
                const usd = (sepoliaBalance ?? 0) * (prices.ETH ?? 0)
                return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              })()}
            </p>

            {/* Truncated wallet address */}
            <p className="sepolia-address">
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </p>
          </>
        )}
      </div>

      {/* Live Prices */}
      <section className="section">
        <div className="section-header">
          <h2>Live Prices</h2>
          <span className="prices-updated">
            {pricesUpdated ? `Updated ${pricesUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Updating…'}
          </span>
        </div>

        <div className="price-cards">
          {PRICE_COINS.map(({ symbol, name, color }) => (
            <div key={symbol} className="price-card">
              <div className="price-card-top">
                <div className="price-coin-dot" style={{ background: color }} />
                <div className="price-coin-info">
                  <span className="price-coin-symbol">{symbol}</span>
                  <span className="price-coin-name">{name}</span>
                </div>
                <span className="price-live-badge">LIVE</span>
              </div>

              {pricesLoading ? (
                <div className="skeleton" style={{ height: 20, width: '80%', marginTop: 12, borderRadius: 8 }} />
              ) : pricesError ? (
                <p className="price-error">—</p>
              ) : (
                <p className="price-value">
                  ${prices[symbol] != null
                    ? prices[symbol].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

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

      {/* Supabase History (Bottom Area) */}
      <section className="section">
        <TransactionList />
      </section>

      {sheet === 'receive' && <ReceiveSheet onClose={() => setSheet(null)} />}
    </div>
  )
}
