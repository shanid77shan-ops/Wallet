import { useState } from 'react'
import { X, ChevronRight, Clipboard, AlertTriangle, ArrowRight, Check, ScanLine, Search, ExternalLink } from 'lucide-react'
import { useCoins } from '../context/CoinContext'
import { useWallet } from '../context/WalletContext'
import { getNetworks } from '../data/networks'
import CoinImage from './CoinImage'
import './Sheet.css'
import './SendSheet.css'

const fmt = (n) => n >= 1
  ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : n.toFixed(6)

const feeColors = {
  'Very Low': '#10b981',
  'Low':      '#3b82f6',
  'Medium':   '#f59e0b',
  'High':     '#ef4444',
}

export default function SendSheet({ onClose }) {
  const { coins } = useCoins()
  const { sendCoin } = useWallet()
  const [step, setStep] = useState('coin')
  const [coinSearch, setCoinSearch] = useState('')
  const [txHash, setTxHash] = useState(null)
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [addressError, setAddressError] = useState('')
  const [sent, setSent] = useState(false)

  const networks = selectedCoin ? getNetworks(selectedCoin.id) : []
  const price = selectedCoin?.price ?? 0
  const usdValue = parseFloat(amount || 0) * price
  const maxAmount = selectedCoin?.balance ?? 0

  const handleSelectCoin = (coin) => {
    const nets = getNetworks(coin.id)
    setSelectedCoin(coin)
    setSelectedNetwork(nets[0] ?? null)
    setStep('details')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setToAddress(text)
      setAddressError('')
    } catch {
      setAddressError('Clipboard read failed — please paste manually')
    }
  }

  const handleMax = () => {
    setAmount(maxAmount.toString())
  }

  const validateAndContinue = () => {
    if (!toAddress.trim()) {
      setAddressError('Enter a recipient address')
      return
    }
    setAddressError('')
    setStep('confirm')
  }

  const handleConfirm = () => {
    const result = sendCoin({
      coinId: selectedCoin.id,
      symbol: selectedCoin.symbol,
      amount,
      usdValue,
      toAddress,
      network: selectedNetwork,
    })
    setTxHash(result.txHash)
    setSent(true)
  }

  const truncate = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : ''

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Header */}
        <div className="sheet-header">
          {(step === 'details' || step === 'confirm') && (
            <button className="sheet-back"
              onClick={() => step === 'confirm' ? setStep('details') : setStep('coin')}>
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
          <h2 className="sheet-title">
            {step === 'coin'    && 'Send'}
            {step === 'details' && `Send ${selectedCoin?.symbol}`}
            {step === 'confirm' && 'Confirm Send'}
          </h2>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Step indicator */}
        {step !== 'coin' && (
          <div className="step-dots">
            {['coin', 'details', 'confirm'].map((s, i) => (
              <div key={s} className={`step-dot${step === s ? ' active' : (
                ['coin','details','confirm'].indexOf(step) > i ? ' done' : ''
              )}`} />
            ))}
          </div>
        )}

        {/* ── STEP 1: Select Coin ── */}
        {step === 'coin' && (
          <div className="sheet-body">
            <div className="sheet-search-bar">
              <Search size={14} color="var(--text-muted)" />
              <input
                className="sheet-search-input"
                placeholder="Search coins..."
                value={coinSearch}
                onChange={e => setCoinSearch(e.target.value)}
                autoFocus
              />
              {coinSearch && <button className="sheet-search-clear" onClick={() => setCoinSearch('')}>✕</button>}
            </div>
            <div className="coin-select-list">
              {coins
                .filter(c => c.balance > 0)
                .filter(c =>
                  c.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
                  c.symbol.toLowerCase().includes(coinSearch.toLowerCase())
                )
                .map(coin => (
                  <button key={coin.id} className="coin-select-row" onClick={() => handleSelectCoin(coin)}>
                    <CoinImage coin={coin} size={42} />
                    <div className="cs-info">
                      <span className="cs-name">{coin.name}</span>
                      <span className="cs-bal">{coin.balance} {coin.symbol}
                        <span className="cs-usd"> · ${fmt((coin.price ?? 0) * coin.balance)}</span>
                      </span>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Send Details ── */}
        {step === 'details' && selectedCoin && (
          <div className="sheet-body">

            {/* To Address */}
            <div className="field-group">
              <label className="field-label">To Address</label>
              <div className={`address-input-wrap${addressError ? ' has-error' : ''}`}>
                <input
                  className="address-field"
                  placeholder="Paste or scan recipient address"
                  value={toAddress}
                  onChange={e => { setToAddress(e.target.value); setAddressError('') }}
                  spellCheck={false}
                  autoComplete="off"
                />
                <div className="addr-input-actions">
                  <button className="addr-tool-btn" onClick={handlePaste} title="Paste">
                    <Clipboard size={16} />
                  </button>
                  <button className="addr-tool-btn scan-btn" title="Scan QR">
                    <ScanLine size={16} />
                    <span className="scan-label">Scan</span>
                  </button>
                </div>
              </div>
              {addressError && <p className="field-error">{addressError}</p>}
            </div>

            {/* Network */}
            <div className="field-group">
              <label className="field-label">Network</label>
              <div className="network-list">
                {networks.map(net => (
                  <button
                    key={net.id}
                    className={`network-option${selectedNetwork?.id === net.id ? ' active' : ''}`}
                    onClick={() => setSelectedNetwork(net)}
                    style={selectedNetwork?.id === net.id ? { borderColor: net.color } : {}}
                  >
                    <div className="net-left">
                      <span className="net-dot-lg" style={{ background: net.color }} />
                      <div>
                        <div className="net-name">{net.name}</div>
                        <div className="net-short">{net.shortName}</div>
                      </div>
                    </div>
                    <div className="net-right">
                      <span className="net-fee" style={{ color: feeColors[net.feeLabel] ?? '#94a3b8' }}>
                        {net.fee}
                      </span>
                      <span className="net-fee-label">{net.feeLabel}</span>
                    </div>
                    {selectedNetwork?.id === net.id && (
                      <div className="net-check" style={{ color: net.color }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="field-group">
              <div className="field-label-row">
                <label className="field-label">Amount</label>
                <span className="field-balance">
                  Available: {maxAmount} {selectedCoin.symbol}
                </span>
              </div>
              <div className="amount-wrap">
                <input
                  className="amount-field"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <span className="amount-symbol">{selectedCoin.symbol}</span>
                <button className="max-btn" onClick={handleMax}>MAX</button>
              </div>
              <div className="amount-usd">≈ ${fmt(usdValue)} USD</div>
            </div>

            <button
              className="sheet-cta-btn"
              onClick={validateAndContinue}
              disabled={!toAddress.trim() || !amount || parseFloat(amount) <= 0}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 'confirm' && selectedCoin && selectedNetwork && !sent && (
          <div className="sheet-body">
            {/* Summary card */}
            <div className="confirm-card">
              <div className="confirm-coin-row">
                <CoinImage coin={selectedCoin} size={50} />
                <div>
                  <div className="confirm-amount">{amount} {selectedCoin.symbol}</div>
                  <div className="confirm-usd">≈ ${fmt(usdValue)}</div>
                </div>
              </div>

              <div className="confirm-divider" />

              <div className="confirm-row">
                <span className="confirm-key">From</span>
                <span className="confirm-val">My {selectedCoin.symbol} Wallet</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">To</span>
                <span className="confirm-val mono">{truncate(toAddress)}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">Network</span>
                <div className="confirm-val net-val">
                  <span className="net-dot-sm" style={{ background: selectedNetwork.color }} />
                  {selectedNetwork.name}
                </div>
              </div>

              <div className="confirm-divider" />

              <div className="confirm-row">
                <span className="confirm-key">Network Fee</span>
                <span className="confirm-val" style={{ color: feeColors[selectedNetwork.feeLabel] }}>
                  {selectedNetwork.fee}
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">Arrival Time</span>
                <span className="confirm-val">{selectedNetwork.confirmations}</span>
              </div>
              <div className="confirm-row total-row">
                <span className="confirm-key">Total Sent</span>
                <span className="confirm-val total-val">${fmt(usdValue)} USD</span>
              </div>
            </div>

            <div className="confirm-warning">
              <AlertTriangle size={13} />
              <span>This transaction is irreversible. Double-check the address before confirming.</span>
            </div>

            <button className="sheet-cta-btn send-btn" onClick={handleConfirm}>
              Confirm & Send
            </button>
          </div>
        )}

        {/* ── Success ── */}
        {sent && (
          <div className="sheet-body success-body">
            <div className="success-icon">
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h3 className="success-title">Transaction Sent!</h3>
            <p className="success-sub">
              {amount} {selectedCoin?.symbol} sent via {selectedNetwork?.name}
            </p>
            <div className="tx-hash-box">
              <p className="tx-hash-label">Transaction Hash</p>
              <p className="tx-hash-value">{txHash?.slice(0, 20)}...{txHash?.slice(-8)}</p>
              <button className="tx-hash-copy" onClick={() => navigator.clipboard.writeText(txHash ?? '')}>
                <Check size={12} /> Copy Hash
              </button>
            </div>
            <div className="tx-pending-badge">
              <span className="pending-dot" />
              Pending confirmation (~{selectedNetwork?.confirmations})
            </div>
            <button className="sheet-close-btn-full" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
