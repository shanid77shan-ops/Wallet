import { useState } from 'react'
import { Search, TrendingUp, TrendingDown, Flame, Star } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { useCoins } from '../context/CoinContext'
import CoinImage from '../components/CoinImage'
import BackButton from '../components/BackButton'
import './Trending.css'

const fmt = (n) => n >= 1
  ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : n < 0.01 ? n.toExponential(2) : n.toFixed(4)

const filters = ['All', 'Gainers', 'Losers', 'Watchlist']

export default function Trending() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [watchlist, setWatchlist] = useState(['bitcoin', 'solana', 'tether'])
  const { coins, loading } = useCoins()

  const toggleWatchlist = (id) => {
    setWatchlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])
  }

  const filtered = coins.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase())
    if (filter === 'Gainers')   return matchSearch && (c.change24h ?? 0) > 0
    if (filter === 'Losers')    return matchSearch && (c.change24h ?? 0) < 0
    if (filter === 'Watchlist') return matchSearch && watchlist.includes(c.id)
    return matchSearch
  })

  const topGainer = coins.length > 0 ? [...coins].sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))[0] : null
  const topLoser  = coins.length > 0 ? [...coins].sort((a, b) => (a.change24h ?? 0) - (b.change24h ?? 0))[0] : null

  return (
    <div className="trending-page">
      {/* Header */}
      <div className="page-header">
        <BackButton to="/" />
        <h1>Market</h1>
        <Flame size={20} color="#f59e0b" />
      </div>

      {/* Highlights */}
      {!loading && topGainer && topLoser && (
        <div className="highlights-row">
          <div className="highlight-card gainer">
            <div className="hl-label"><TrendingUp size={13} /> Top Gainer</div>
            <div className="hl-coin">
              <CoinImage coin={topGainer} size={24} />
              <span className="hl-symbol">{topGainer.symbol}</span>
            </div>
            <div className="hl-change positive">+{(topGainer.change24h ?? 0).toFixed(2)}%</div>
          </div>
          <div className="highlight-card loser">
            <div className="hl-label"><TrendingDown size={13} /> Top Loser</div>
            <div className="hl-coin">
              <CoinImage coin={topLoser} size={24} />
              <span className="hl-symbol">{topLoser.symbol}</span>
            </div>
            <div className="hl-change negative">{(topLoser.change24h ?? 0).toFixed(2)}%</div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <Search size={16} color="var(--text-muted)" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search coins..."
          className="search-input"
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filters.map(f => (
          <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="table-header">
        <span className="th-name">Name</span>
        <span className="th-chart">7D Chart</span>
        <span className="th-price">Price / 24h</span>
      </div>

      {/* Coin List */}
      <div className="coin-list">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)
        ) : (
          <>
            {filtered.length === 0 && (
              <div className="empty-state">No coins match "{query}"</div>
            )}
            {filtered.map((coin) => {
              const isPos = (coin.change24h ?? 0) >= 0
              const sparkData = (coin.sparkline ?? []).map(v => ({ v }))
              const rank = coins.indexOf(coin) + 1
              return (
                <div key={coin.id} className="coin-row">
                  <div className="coin-rank-logo">
                    <span className="rank">{rank}</span>
                    <CoinImage coin={coin} size={36} />
                    <div className="coin-names">
                      <span className="coin-name">{coin.name}</span>
                      <span className="coin-symbol-sm">{coin.symbol}</span>
                    </div>
                  </div>

                  <div className="coin-spark">
                    {sparkData.length > 0 && (
                      <ResponsiveContainer width={72} height={32}>
                        <LineChart data={sparkData}>
                          <Line type="monotone" dataKey="v" stroke={isPos ? '#10b981' : '#ef4444'} strokeWidth={1.5} dot={false} />
                          <Tooltip content={() => null} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="coin-price-col">
                    <div className="coin-price">${fmt(coin.price ?? 0)}</div>
                    <div className={`coin-change ${isPos ? 'positive' : 'negative'}`}>
                      {isPos ? '+' : ''}{(coin.change24h ?? 0).toFixed(2)}%
                    </div>
                    <button
                      className={`star-btn${watchlist.includes(coin.id) ? ' starred' : ''}`}
                      onClick={() => toggleWatchlist(coin.id)}
                    >
                      <Star size={13} fill={watchlist.includes(coin.id) ? '#f59e0b' : 'none'} />
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
