/**
 * Home.jsx — xdt-wallet main screen
 * ETH + single merged USDT card (ERC-20 & TRC-20 network selection in sheets).
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowUpRight, ArrowDown, Copy, X,
  ArrowClockwise, Eye, EyeSlash,
} from '@phosphor-icons/react'
import { useXDTWallet } from '../context/XDTWalletContext'
import { fmtUSD, fmtToken } from '../services/xdtPriceService'
import './Home.css'

// ── Token icons ───────────────────────────────────────────────────────────────
function TokenIcon({ id }) {
  if (id === 'eth')  return <div className="tok-icon eth">Ξ</div>
  if (id === 'usdt') return <div className="tok-icon erc">₮</div>
  return <div className="tok-icon">?</div>
}

function NetworkBadge({ network }) {
  const cls = network === 'ERC-20' ? 'badge-erc' : network === 'TRC-20' ? 'badge-trc' : 'badge-eth'
  return <span className={`net-badge ${cls}`}>{network}</span>
}

// ── Network selector (shared between Send/Receive sheets for USDT) ─────────────
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

// ── Send Sheet ────────────────────────────────────────────────────────────────
function SendSheet({ token, onClose, ethAddress, tronAddress }) {
  const { sendToken, prices } = useXDTWallet()

  // For USDT: default to ERC-20; ETH has no selector
  const [selNet,  setSelNet]  = useState('erc')
  const [to,      setTo]      = useState('')
  const [amount,  setAmount]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [txHash,  setTxHash]  = useState('')

  const isUSDT    = token.id === 'usdt'
  const tokenId   = isUSDT ? (selNet === 'erc' ? 'usdt-erc' : 'usdt-trc') : token.id
  const maxBal    = isUSDT
    ? (selNet === 'erc' ? (token.ercBalance ?? 0) : (token.trcBalance ?? 0))
    : token.balance
  const isTRC     = tokenId === 'usdt-trc'
  const price     = token.symbol === 'ETH' ? prices.eth : prices.usdt
  const usdVal    = amount ? (parseFloat(amount) * price).toFixed(2) : '0.00'
  const network   = isTRC ? 'TRC-20' : tokenId === 'usdt-erc' ? 'ERC-20' : token.network

  // Reset address when switching networks
  function handleNetChange(net) {
    setSelNet(net)
    setTo('')
    setError('')
  }

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    if (!to.trim())                           { setError('Enter a recipient address.'); return }
    if (!amount || parseFloat(amount) <= 0)   { setError('Enter a valid amount.'); return }
    if (parseFloat(amount) > maxBal)          { setError('Insufficient balance.'); return }

    if (isTRC) {
      if (!to.trim().startsWith('T') || to.trim().length < 30) {
        setError('Enter a valid TRON address (starts with T).')
        return
      }
    } else {
      if (!to.trim().startsWith('0x') || to.trim().length !== 42) {
        setError('Enter a valid Ethereum address (0x…).')
        return
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
              <span className="input-hint">
                ({isTRC ? 'TRON T… address' : 'Ethereum 0x… address'})
              </span>
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
  const [selNet, setSelNet] = useState('erc')
  const [copied, setCopied] = useState(false)

  const isUSDT  = token.id === 'usdt'
  const isTRC   = isUSDT ? selNet === 'trc' : token.id === 'usdt-trc'
  const address = isTRC ? tronAddress : ethAddress
  const network = isTRC ? 'TRC-20' : 'ERC-20'

  function copy(text) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleNetChange(net) {
    setSelNet(net)
    setCopied(false)
  }

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
            <p className="receive-warning">
              ⚠️ This is a <strong>TRON</strong> address. Do not send ERC-20 tokens here.
            </p>
          )}
          {!isTRC && token.id !== 'eth' && (
            <p className="receive-warning">
              ⚠️ This is an <strong>Ethereum</strong> address. Do not send TRC-20 tokens here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Token Card ────────────────────────────────────────────────────────────────
function TokenCard({ token, onSend, onReceive }) {
  const { prices } = useXDTWallet()
  const navigate   = useNavigate()
  const price  = token.symbol === 'ETH' ? prices.eth : prices.usdt
  const usdVal = token.balance * price
  const change = token.symbol === 'ETH' ? prices.ethChange : prices.usdtChange

  return (
    <div className="token-card" onClick={() => navigate(`/coin/${token.id}`)}
         style={{ cursor: 'pointer' }}>
      <div className="token-left">
        <TokenIcon id={token.id} />
        <div className="token-info">
          <div className="token-name-row">
            <span className="token-name">{token.name}</span>
            {token.id === 'usdt'
              ? <span className="multi-net-badge">ERC-20 · TRC-20</span>
              : <NetworkBadge network={token.network} />}
          </div>
          <span className="token-price">
            {fmtUSD(price)}
            <span className={`price-change ${change >= 0 ? 'pos' : 'neg'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </span>
        </div>
      </div>
      <div className="token-right">
        <span className="token-balance">{fmtToken(token.balance, token.symbol === 'ETH' ? 6 : 2)}</span>
        <span className="token-usd">{fmtUSD(usdVal)}</span>
        <div className="token-actions" onClick={e => e.stopPropagation()}>
          <button className="tok-btn send" onClick={onSend}><ArrowUpRight size={14} weight="bold" /></button>
          <button className="tok-btn recv" onClick={onReceive}><ArrowDown size={14} weight="bold" /></button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const {
    tokens, totalUSD, balancesLoading, balanceError,
    txHistory, refreshBalances, keys,
  } = useXDTWallet()

  const [sendToken,    setSendToken]    = useState(null)
  const [receiveToken, setReceiveToken] = useState(null)
  const [hideBalance,  setHideBalance]  = useState(false)

  const ethAddress  = keys?.ethAddress  ?? ''
  const tronAddress = keys?.tronAddress ?? ''

  const shortEth  = ethAddress  ? `${ethAddress.slice(0,6)}…${ethAddress.slice(-4)}`  : ''
  const shortTron = tronAddress ? `${tronAddress.slice(0,6)}…${tronAddress.slice(-4)}` : ''

  // Build display tokens: ETH + one merged USDT
  const ethToken  = tokens.find(t => t.id === 'eth')
  const usdtErc   = tokens.find(t => t.id === 'usdt-erc')
  const usdtTrc   = tokens.find(t => t.id === 'usdt-trc')
  const usdtMerged = {
    id:         'usdt',
    symbol:     'USDT',
    name:       'Tether USD',
    network:    'Multi-Chain',
    color:      '#26a17b',
    balance:    (usdtErc?.balance ?? 0) + (usdtTrc?.balance ?? 0),
    ercBalance: usdtErc?.balance ?? 0,
    trcBalance: usdtTrc?.balance ?? 0,
  }
  const displayTokens = [ethToken, usdtMerged].filter(Boolean)

  return (
    <div className="home-page">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="home-header">
        <div className="home-header-left">
          <div className="home-logo-small">X</div>
          <span className="home-title">XDT Wallet</span>
        </div>
        <button
          className="refresh-btn"
          onClick={refreshBalances}
          disabled={balancesLoading}
          title="Refresh balances"
        >
          <ArrowClockwise size={18} className={balancesLoading ? 'spin' : ''} />
        </button>
      </div>

      {/* ── Balance Card ───────────────────────────────────────────────────── */}
      <div className="balance-card-new">
        <div className="balance-card-glow" />
        <div className="balance-top-row">
          <p className="balance-label-new">Total Portfolio Value</p>
          <button className="hide-btn" onClick={() => setHideBalance(h => !h)}>
            {hideBalance ? <Eye size={16} /> : <EyeSlash size={16} />}
          </button>
        </div>
        <h2 className="balance-amount-new">
          {hideBalance ? '••••••' : fmtUSD(totalUSD)}
        </h2>
        <div className="address-pills">
          {ethAddress && (
            <span className="addr-pill eth-pill" title={ethAddress}>
              <span className="addr-dot" style={{ background: '#627eea' }} /> {shortEth}
            </span>
          )}
          {tronAddress && (
            <span className="addr-pill trc-pill" title={tronAddress}>
              <span className="addr-dot" style={{ background: '#eb0029' }} /> {shortTron}
            </span>
          )}
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div className="quick-actions">
        <button className="qa-btn" onClick={() => setSendToken(ethToken)}>
          <div className="qa-icon qa-send"><ArrowUpRight size={20} weight="bold" /></div>
          <span>Send</span>
        </button>
        <button className="qa-btn" onClick={() => setReceiveToken(ethToken)}>
          <div className="qa-icon qa-recv"><ArrowDown size={20} weight="bold" /></div>
          <span>Receive</span>
        </button>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {balanceError && (
        <div className="balance-err-banner">{balanceError}</div>
      )}

      {/* ── Token List ─────────────────────────────────────────────────────── */}
      <div className="section">
        <h3 className="section-title">My Assets</h3>
        <div className="token-list">
          {displayTokens.map(token => (
            <TokenCard
              key={token.id}
              token={token}
              onSend={() => setSendToken(token)}
              onReceive={() => setReceiveToken(token)}
            />
          ))}
        </div>
      </div>

      {/* ── Recent Transactions ────────────────────────────────────────────── */}
      <div className="section">
        <h3 className="section-title">Recent Activity</h3>
        {txHistory.length === 0 ? (
          <div className="empty-tx"><p>No transactions yet</p></div>
        ) : (
          <div className="tx-list">
            {txHistory.slice(0, 15).map(tx => (
              <div key={tx.txID || tx.id} className="tx-item">
                <div className={`tx-icon-wrap ${tx.type}`}>
                  {tx.type === 'send'
                    ? <ArrowUpRight size={16} weight="bold" />
                    : <ArrowDown size={16} weight="bold" />}
                </div>
                <div className="tx-info">
                  <span className="tx-label">
                    {tx.type === 'send' ? 'Sent' : 'Received'} {tx.symbol}
                  </span>
                  <span className="tx-network">{tx.network}</span>
                </div>
                <div className="tx-amount-wrap">
                  <span className={`tx-amount ${tx.type === 'send' ? 'neg' : 'pos'}`}>
                    {tx.type === 'send' ? '-' : '+'}{fmtToken(tx.amount, 4)} {tx.symbol}
                  </span>
                  {tx.timestamp && (
                    <span className="tx-date">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Sheets ─────────────────────────────────────────────────────────── */}
      {sendToken && (
        <SendSheet
          token={sendToken}
          onClose={() => setSendToken(null)}
          ethAddress={ethAddress}
          tronAddress={tronAddress}
        />
      )}
      {receiveToken && (
        <ReceiveSheet
          token={receiveToken}
          onClose={() => setReceiveToken(null)}
          ethAddress={ethAddress}
          tronAddress={tronAddress}
        />
      )}
    </div>
  )
}
