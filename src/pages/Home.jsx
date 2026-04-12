/**
 * Home.jsx — xdt-wallet main screen
 * ETH + single merged USDT card (ERC-20 & TRC-20 network selection in sheets).
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import jsQR from 'jsqr'
import {
  ArrowUpRight, ArrowDown, Copy, X,
  ArrowClockwise, Eye, EyeSlash, QrCode,
} from '@phosphor-icons/react'
import { useXDTWallet } from '../context/XDTWalletContext'
import { useCoins }      from '../context/CoinContext'
import { useCurrency, CURRENCIES } from '../context/CurrencyContext'
import { fmtUSD, fmtToken } from '../services/xdtPriceService'
import CoinImage from '../components/CoinImage'
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

// ── QR Scanner ────────────────────────────────────────────────────────────────
function QRScanner({ onScan, onClose }) {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef    = useRef(null)
  const [camError, setCamError] = useState('')

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().then(tick)
        }
      })
      .catch(() => setCamError('Camera access denied. Please allow camera permission.'))

    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  function tick() {
    rafRef.current = requestAnimationFrame(() => {
      const video  = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return
      if (video.readyState < 2) { tick(); return }
      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight
      const ctx  = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(video, 0, 0)
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
      if (code?.data) {
        streamRef.current?.getTracks().forEach(t => t.stop())
        onScan(code.data)
      } else {
        tick()
      }
    })
  }

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-modal" onClick={e => e.stopPropagation()}>
        <div className="qr-scanner-header">
          <span>Scan Address QR</span>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>
        {camError ? (
          <p className="qr-scanner-error">{camError}</p>
        ) : (
          <div className="qr-scanner-viewport">
            <video ref={videoRef} playsInline muted />
            <div className="qr-scanner-frame" />
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!camError && <p className="qr-scanner-hint">Align QR code within the frame</p>}
      </div>
    </div>
  )
}

// ── Send Sheet ────────────────────────────────────────────────────────────────
function SendSheet({ token, onClose, ethAddress, tronAddress }) {
  const { sendToken, prices } = useXDTWallet()

  // For USDT: default to ERC-20; ETH has no selector
  const [selNet,    setSelNet]    = useState('erc')
  const [to,        setTo]        = useState('')
  const [amount,    setAmount]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [txHash,    setTxHash]    = useState('')
  const [scanning,  setScanning]  = useState(false)

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
            <div className="addr-input-row">
              <input
                type="text" autoComplete="off" autoCapitalize="none"
                placeholder={isTRC ? 'TXxx…' : '0x…'}
                value={to}
                onChange={e => { setTo(e.target.value); setError('') }}
              />
              <button
                type="button"
                className="scan-qr-btn"
                onClick={() => setScanning(true)}
                title="Scan QR code"
              >
                <QrCode size={20} />
              </button>
            </div>
          </div>

          {scanning && (
            <QRScanner
              onScan={addr => { setTo(addr.trim()); setError(''); setScanning(false) }}
              onClose={() => setScanning(false)}
            />
          )}

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
  const { fmt } = useCurrency()
  const navigate = useNavigate()

  const price  = token.price    ?? 0
  const usdVal = token.balance  * price
  const change = token.change24h ?? 0
  const hasWallet = onSend && onReceive  // only ETH + USDT have wallet actions

  return (
    <div className="token-card" onClick={() => navigate(`/coin/${token.id}`)} style={{ cursor: 'pointer' }}>
      <div className="token-left">
        <CoinImage coin={token} size={38} />
        <div className="token-info">
          <div className="token-name-row">
            <span className="token-name">{token.name}</span>
            {token.id === 'tether' || token.id === 'usdt'
              ? <span className="multi-net-badge">ERC-20 · TRC-20</span>
              : token.network ? <NetworkBadge network={token.network} /> : null}
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
        <span className="token-usd">{fmt(usdVal)}</span>
        {hasWallet && (
          <div className="token-actions" onClick={e => e.stopPropagation()}>
            <button className="tok-btn send" onClick={onSend}><ArrowUpRight size={14} weight="bold" /></button>
            <button className="tok-btn recv" onClick={onReceive}><ArrowDown size={14} weight="bold" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const {
    tokens, balancesLoading, balanceError,
    txHistory, refreshBalances, keys,
  } = useXDTWallet()
  const { coins: allCoins } = useCoins()
  const { fmt, currency, setCurrency } = useCurrency()
  const [currencyOpen, setCurrencyOpen] = useState(false)

  const [sendToken,    setSendToken]    = useState(null)
  const [receiveToken, setReceiveToken] = useState(null)
  const [hideBalance,  setHideBalance]  = useState(false)

  const ethAddress  = keys?.ethAddress  ?? ''
  const tronAddress = keys?.tronAddress ?? ''

  const shortEth  = ethAddress  ? `${ethAddress.slice(0,6)}…${ethAddress.slice(-4)}`  : ''
  const shortTron = tronAddress ? `${tronAddress.slice(0,6)}…${tronAddress.slice(-4)}` : ''

  // Wallet send/receive tokens — ETH + merged USDT (from XDT wallet context)
  const ethWallet  = tokens.find(t => t.id === 'eth')
  const usdtErc    = tokens.find(t => t.id === 'usdt-erc')
  const usdtTrc    = tokens.find(t => t.id === 'usdt-trc')
  const usdtMerged = {
    id:         'tether',
    symbol:     'USDT',
    name:       'Tether USD',
    network:    'Multi-Chain',
    color:      '#26a17b',
    price:      1,
    change24h:  0,
    balance:    (usdtErc?.balance ?? 0) + (usdtTrc?.balance ?? 0),
    ercBalance: usdtErc?.balance ?? 0,
    trcBalance: usdtTrc?.balance ?? 0,
    image:      allCoins.find(c => c.id === 'tether')?.image,
  }

  // ETH display token — balance from wallet, price/image from CoinContext
  const ethCoin    = allCoins.find(c => c.id === 'ethereum') ?? {}
  const ethDisplay = { ...ethCoin, id: 'ethereum', balance: ethWallet?.balance ?? 0 }

  // Total portfolio: ETH + USDT only
  const totalUSD = (ethDisplay.balance * (ethDisplay.price ?? 0)) + usdtMerged.balance

  return (
    <div className="home-page">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="home-header">
        <div className="home-header-left">
          <img src="/app-icon.jpg" alt="XDT" className="home-logo-small" />
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
        <div className="balance-amount-row">
          <h2 className="balance-amount-new">
            {hideBalance ? '••••••' : fmt(totalUSD)}
          </h2>
          <div className="currency-dropdown-wrap">
            <button
              className="currency-toggle-btn"
              onClick={() => setCurrencyOpen(o => !o)}
            >
              {currency}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d={currencyOpen ? 'M9 5L5 1L1 5' : 'M1 1L5 5L9 1'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {currencyOpen && (
              <>
                <div className="currency-dropdown-backdrop" onClick={() => setCurrencyOpen(false)} />
                <div className="currency-dropdown">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      className={`currency-option${currency === c.code ? ' active' : ''}`}
                      onClick={() => { setCurrency(c.code); setCurrencyOpen(false) }}
                    >
                      <span className="currency-option-flag">{c.flag}</span>
                      <span className="currency-option-code">{c.code}</span>
                      <span className="currency-option-label">{c.label}</span>
                      {currency === c.code && <span className="currency-option-check">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
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
        <button className="qa-btn" onClick={() => setSendToken(ethWallet ? { ...allCoins.find(c => c.id === 'ethereum'), ...ethWallet, id: 'ethereum' } : usdtMerged)}>
          <div className="qa-icon qa-send"><ArrowUpRight size={20} weight="bold" /></div>
          <span>Send</span>
        </button>
        <button className="qa-btn" onClick={() => setReceiveToken(ethWallet ? { ...allCoins.find(c => c.id === 'ethereum'), ...ethWallet, id: 'ethereum' } : usdtMerged)}>
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
          <TokenCard
            token={ethDisplay}
            onSend={() => setSendToken(ethWallet ? { ...ethDisplay, ...ethWallet } : ethDisplay)}
            onReceive={() => setReceiveToken(ethDisplay)}
          />
          <TokenCard
            token={usdtMerged}
            onSend={() => setSendToken({ ...usdtMerged, id: 'usdt' })}
            onReceive={() => setReceiveToken({ ...usdtMerged, id: 'usdt' })}
          />
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
                  <span className="tx-network">
                    {tx.network}
                    {tx.timestamp ? ` · ${new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                  </span>
                </div>
                <div className="tx-amount-wrap">
                  <span className={`tx-amount ${tx.type === 'send' ? 'neg' : 'pos'}`}>
                    {tx.type === 'send' ? '−' : '+'}{fmtToken(tx.amount, 4)} {tx.symbol}
                  </span>
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
