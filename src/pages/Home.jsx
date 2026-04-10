/**
 * Home.jsx — xdt-wallet main screen
 * Shows ETH, USDT ERC-20 and USDT TRC-20 balances with send/receive sheets.
 */
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowUpRight, ArrowDown, Copy, X, CaretRight,
  ArrowClockwise, Eye, EyeSlash,
} from '@phosphor-icons/react'
import { useXDTWallet } from '../context/XDTWalletContext'
import { fmtUSD, fmtToken } from '../services/xdtPriceService'
import './Home.css'

// ── Token icons (inline SVG / emoji for zero dependency) ─────────────────────
function TokenIcon({ id }) {
  if (id === 'eth')      return <div className="tok-icon eth">Ξ</div>
  if (id === 'usdt-erc') return <div className="tok-icon erc">₮</div>
  if (id === 'usdt-trc') return <div className="tok-icon trc">₮</div>
  return <div className="tok-icon">?</div>
}

function NetworkBadge({ network }) {
  const cls = network === 'ERC-20' ? 'badge-erc' : network === 'TRC-20' ? 'badge-trc' : 'badge-eth'
  return <span className={`net-badge ${cls}`}>{network}</span>
}

// ── Copy util ─────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false)
  function copy(text) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return { copied, copy }
}

// ── Send Sheet ────────────────────────────────────────────────────────────────
function SendSheet({ token, onClose, ethAddress, tronAddress }) {
  const { sendToken, prices } = useXDTWallet()
  const [to,      setTo]     = useState('')
  const [amount,  setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]  = useState('')
  const [txHash,  setTxHash] = useState('')

  const price = token.symbol === 'ETH' ? prices.eth : prices.usdt
  const usdVal = amount ? (parseFloat(amount) * price).toFixed(2) : '0.00'

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    if (!to.trim()) { setError('Enter a recipient address.'); return }
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount.'); return }
    if (parseFloat(amount) > token.balance) { setError('Insufficient balance.'); return }

    // Basic address validation
    if (token.id === 'usdt-trc') {
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
      const hash = await sendToken({ tokenId: token.id, toAddress: to.trim(), amount })
      setTxHash(hash)
    } catch (err) {
      setError(err.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  if (txHash) {
    const explorer = token.id === 'usdt-trc'
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
              View on {token.id === 'usdt-trc' ? 'TronScan' : 'Etherscan'} ↗
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
          <h3>Send {token.symbol} <NetworkBadge network={token.network} /></h3>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form className="sheet-form" onSubmit={handleSend}>
          <div className="sheet-balance-hint">
            Balance: <strong>{fmtToken(token.balance)} {token.symbol}</strong>
          </div>

          <div className="input-group">
            <label>
              Recipient Address
              <span className="input-hint">
                ({token.id === 'usdt-trc' ? 'TRON T… address' : 'Ethereum 0x… address'})
              </span>
            </label>
            <input
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              placeholder={token.id === 'usdt-trc' ? 'TXxx…' : '0x…'}
              value={to}
              onChange={e => { setTo(e.target.value); setError('') }}
            />
          </div>

          <div className="input-group">
            <label>
              Amount ({token.symbol})
              <button type="button" className="max-btn"
                onClick={() => setAmount(String(token.balance))}>
                MAX
              </button>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError('') }}
            />
            {amount && <p className="usd-equiv">≈ ${usdVal} USD</p>}
          </div>

          {error && <p className="sheet-error">{error}</p>}

          {token.id === 'eth' && (
            <p className="sheet-notice">⛽ Gas fee will be deducted from your ETH balance.</p>
          )}
          {token.id === 'usdt-erc' && (
            <p className="sheet-notice">⛽ ETH needed in wallet to pay ERC-20 gas fee.</p>
          )}
          {token.id === 'usdt-trc' && (
            <p className="sheet-notice">⚡ TRX needed for energy/bandwidth to send TRC-20.</p>
          )}

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
  const { copied, copy } = useCopy()
  const address = token.id === 'usdt-trc' ? tronAddress : ethAddress

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-header">
          <h3>Receive {token.symbol} <NetworkBadge network={token.network} /></h3>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="receive-body">
          <div className="qr-wrap">
            <QRCodeSVG value={address} size={180} bgColor="#ffffff" fgColor="#000000" includeMargin />
          </div>
          <p className="receive-hint">
            Only send <strong>{token.symbol} ({token.network})</strong> to this address.
          </p>
          <div className="address-row" onClick={() => copy(address)}>
            <span className="address-text">{address}</span>
            <Copy size={18} color={copied ? '#10b981' : '#6c7f9f'} />
          </div>
          {copied && <p className="copied-msg">Copied!</p>}

          {token.id === 'usdt-trc' && (
            <p className="receive-warning">
              ⚠️ This is a <strong>TRON</strong> address. Sending ERC-20 USDT here will result in loss of funds.
            </p>
          )}
          {token.id === 'usdt-erc' && (
            <p className="receive-warning">
              ⚠️ This is an <strong>Ethereum</strong> address. Sending TRC-20 USDT here will result in loss of funds.
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
  const price = token.symbol === 'ETH' ? prices.eth : prices.usdt
  const usdVal = token.balance * price
  const change = token.symbol === 'ETH' ? prices.ethChange : prices.usdtChange

  return (
    <div className="token-card">
      <div className="token-left">
        <TokenIcon id={token.id} />
        <div className="token-info">
          <div className="token-name-row">
            <span className="token-name">{token.name}</span>
            <NetworkBadge network={token.network} />
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
        <div className="token-actions">
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
    txHistory, refreshBalances, keys, prices,
  } = useXDTWallet()

  const [sendToken,    setSendToken]    = useState(null)
  const [receiveToken, setReceiveToken] = useState(null)
  const [hideBalance,  setHideBalance]  = useState(false)

  const ethAddress  = keys?.ethAddress  ?? ''
  const tronAddress = keys?.tronAddress ?? ''

  const shortEth  = ethAddress  ? `${ethAddress.slice(0,6)}…${ethAddress.slice(-4)}`  : ''
  const shortTron = tronAddress ? `${tronAddress.slice(0,6)}…${tronAddress.slice(-4)}` : ''

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
        <button className="qa-btn" onClick={() => setSendToken(tokens[0])}>
          <div className="qa-icon qa-send"><ArrowUpRight size={20} weight="bold" /></div>
          <span>Send</span>
        </button>
        <button className="qa-btn" onClick={() => setReceiveToken(tokens[0])}>
          <div className="qa-icon qa-recv"><ArrowDown size={20} weight="bold" /></div>
          <span>Receive</span>
        </button>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {balanceError && (
        <div className="balance-err-banner">{balanceError}</div>
      )}

      {/* ── Token List ─────────────────────────────────────────────────────── */}
      <div className="section">
        <h3 className="section-title">My Assets</h3>
        <div className="token-list">
          {tokens.map(token => (
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
          <div className="empty-tx">
            <p>No transactions yet</p>
          </div>
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
