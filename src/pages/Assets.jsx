/**
 * Assets.jsx — Holdings overview: ETH + USDT with total value
 */
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useXDTWallet } from '../context/XDTWalletContext'
import { useCoins }      from '../context/CoinContext'
import { useCurrency }   from '../context/CurrencyContext'
import { fmtUSD, fmtToken } from '../services/xdtPriceService'
import CoinImage   from '../components/CoinImage'
import BackButton  from '../components/BackButton'
import './Assets.css'

function fmtDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function Assets() {
  const { tokens, prices, txHistory } = useXDTWallet()
  const { coins: allCoins } = useCoins()
  const { fmt } = useCurrency()
  const navigate = useNavigate()

  // ── ETH ──────────────────────────────────────────────────────────────────────
  const ethWallet  = tokens.find(t => t.id === 'eth')
  const ethCoin    = allCoins.find(c => c.id === 'ethereum') ?? {}
  const ethBal     = ethWallet?.balance ?? 0
  const ethPrice   = ethCoin.price ?? prices.eth ?? 0
  const ethUSD     = ethBal * ethPrice
  const ethChange  = ethCoin.change24h ?? 0

  // ── USDT ─────────────────────────────────────────────────────────────────────
  const usdtErc    = tokens.find(t => t.id === 'usdt-erc')
  const usdtTrc    = tokens.find(t => t.id === 'usdt-trc')
  const usdtCoin   = allCoins.find(c => c.id === 'tether') ?? {}
  const ercBal     = usdtErc?.balance ?? 0
  const trcBal     = usdtTrc?.balance ?? 0
  const usdtTotal  = ercBal + trcBal

  // ── Portfolio totals ──────────────────────────────────────────────────────────
  const totalUSD   = ethUSD + usdtTotal
  const ethPct     = totalUSD > 0 ? Math.round(ethUSD  / totalUSD * 100) : 0
  const usdtPct    = totalUSD > 0 ? Math.round(usdtTotal / totalUSD * 100) : 0

  return (
    <div className="assets-page">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="assets-header">
        <BackButton to="/" />
        <h1>My Assets</h1>
        <div style={{ width: 34 }} />
      </div>

      {/* ── Total value card ───────────────────────────────────────────────── */}
      <div className="assets-total-card">
        <div className="assets-total-glow" />
        <p className="assets-total-label">Total Holdings</p>
        <h2 className="assets-total-value">{fmt(totalUSD)}</h2>

        {/* allocation bar */}
        {totalUSD > 0 && (
          <>
            <div className="assets-alloc-bar">
              <div className="alloc-fill eth-fill"  style={{ width: `${ethPct}%` }} />
              <div className="alloc-fill usdt-fill" style={{ width: `${usdtPct}%` }} />
            </div>
            <div className="assets-alloc-legend">
              <span><span className="legend-dot eth-dot" />ETH {ethPct}%</span>
              <span><span className="legend-dot usdt-dot" />USDT {usdtPct}%</span>
            </div>
          </>
        )}
      </div>

      {/* ── Asset cards ────────────────────────────────────────────────────── */}
      <h3 className="assets-section-title">Holdings</h3>

      {/* ETH */}
      <div className="asset-row" onClick={() => navigate('/coin/ethereum')}>
        <div className="asset-row-left">
          <CoinImage coin={ethCoin} size={44} />
          <div className="asset-row-info">
            <div className="asset-row-name-line">
              <span className="asset-row-name">Ethereum</span>
              <span className="asset-badge badge-eth">ERC-20</span>
            </div>
            <span className="asset-row-price">
              {fmtUSD(ethPrice)}
              <span className={`asset-row-change ${ethChange >= 0 ? 'pos' : 'neg'}`}>
                {ethChange >= 0 ? '+' : ''}{ethChange.toFixed(2)}%
              </span>
            </span>
          </div>
        </div>
        <div className="asset-row-right">
          <span className="asset-row-bal">{fmtToken(ethBal, 6)} ETH</span>
          <span className="asset-row-usd">{fmt(ethUSD)}</span>
        </div>
      </div>

      {/* USDT */}
      <div className="asset-row" onClick={() => navigate('/coin/tether')}>
        <div className="asset-row-left">
          <CoinImage coin={usdtCoin} size={44} />
          <div className="asset-row-info">
            <div className="asset-row-name-line">
              <span className="asset-row-name">Tether USD</span>
              <span className="asset-badge badge-usdt">Multi-Chain</span>
            </div>
            <span className="asset-row-price">{fmtUSD(1)}</span>
          </div>
        </div>
        <div className="asset-row-right">
          <span className="asset-row-bal">{fmtToken(usdtTotal, 2)} USDT</span>
          <span className="asset-row-usd">{fmt(usdtTotal)}</span>
        </div>
      </div>

      {/* USDT network breakdown */}
      <div className="usdt-breakdown-card">
        <div className="breakdown-row">
          <span className="breakdown-net-dot erc" />
          <span className="breakdown-net-label">ERC-20 · Ethereum</span>
          <span className="breakdown-net-bal">{fmtToken(ercBal, 2)} USDT</span>
          <span className="breakdown-net-usd">{fmt(ercBal)}</span>
        </div>
        <div className="breakdown-divider" />
        <div className="breakdown-row">
          <span className="breakdown-net-dot trc" />
          <span className="breakdown-net-label">TRC-20 · TRON</span>
          <span className="breakdown-net-bal">{fmtToken(trcBal, 2)} USDT</span>
          <span className="breakdown-net-usd">{fmt(trcBal)}</span>
        </div>
      </div>

      {/* ── Recent Transactions ─────────────────────────────────────────────── */}
      <h3 className="assets-section-title" style={{ marginTop: 22 }}>Recent Activity</h3>
      {txHistory.length === 0 ? (
        <div className="assets-empty-tx">No transactions yet</div>
      ) : (
        <div className="assets-tx-list">
          {txHistory.slice(0, 20).map(tx => (
            <div key={tx.txID || tx.id} className="assets-tx-item">
              <div className={`assets-tx-icon ${tx.type}`}>
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  style={{ transform: tx.type === 'receive' ? 'rotate(180deg)' : 'none' }}
                />
              </div>
              <div className="assets-tx-info">
                <span className="assets-tx-label">
                  {tx.type === 'send' ? 'Sent' : 'Received'} {tx.symbol}
                </span>
                <span className="assets-tx-meta">{tx.network} · {fmtDate(tx.timestamp)}</span>
              </div>
              <span className={`assets-tx-amount ${tx.type === 'send' ? 'neg' : 'pos'}`}>
                {tx.type === 'send' ? '−' : '+'}{fmtToken(tx.amount, 4)} {tx.symbol}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
