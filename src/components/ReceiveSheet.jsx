import { useState } from 'react'
import { X, Copy, Check, ChevronRight, AlertTriangle, Share2, Search } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAppKitAccount, useAppKit } from '@reown/appkit/react'
import { useCoins } from '../context/CoinContext'
import { getNetworks } from '../data/networks'
import CoinImage from './CoinImage'
import './Sheet.css'
import './ReceiveSheet.css'

const EVM_NETWORK_IDS = new Set(['eth-mainnet', 'arbitrum', 'optimism', 'polygon', 'base', 'bsc', 'avax-c'])

function isEvmNetwork(networkId) {
  return EVM_NETWORK_IDS.has(networkId)
}

export default function ReceiveSheet({ onClose }) {
  const { coins } = useCoins()
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const [step, setStep] = useState('coin')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [copied, setCopied] = useState(false)
  const [coinSearch, setCoinSearch] = useState('')

  const handleSelectCoin = (coin) => {
    const networks = getNetworks(coin.id)
    setSelectedCoin(coin)
    setSelectedNetwork(networks[0] ?? null)
    setStep('address')
    setCoinSearch('')
  }

  const handleCopy = () => {
    if (!activeAddress) return
    navigator.clipboard.writeText(activeAddress).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredCoins = coins.filter(c =>
    c.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
    c.symbol.toLowerCase().includes(coinSearch.toLowerCase())
  )

  const networks = selectedCoin ? getNetworks(selectedCoin.id) : []
  const activeAddress = selectedNetwork
    ? (isEvmNetwork(selectedNetwork.id) && address ? address : selectedNetwork.address)
    : ''
  const showConnectBanner = selectedNetwork && isEvmNetwork(selectedNetwork.id) && !isConnected

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Header */}
        <div className="sheet-header">
          {step === 'address' && (
            <button className="sheet-back" onClick={() => setStep('coin')}>
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
          <h2 className="sheet-title">
            {step === 'coin' ? 'Receive' : `Receive ${selectedCoin?.symbol}`}
          </h2>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Step: Select Coin */}
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
            {filteredCoins.length === 0 && (
              <p className="sheet-no-results">No coins match "{coinSearch}"</p>
            )}
            <div className="coin-select-list">
              {filteredCoins.map(coin => (
                <button key={coin.id} className="coin-select-row" onClick={() => handleSelectCoin(coin)}>
                  <CoinImage coin={coin} size={42} />
                  <div className="cs-info">
                    <span className="cs-name">{coin.name}</span>
                    <span className="cs-bal">{coin.balance > 0 ? `${coin.balance} ${coin.symbol}` : coin.symbol}</span>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Address + QR */}
        {step === 'address' && selectedCoin && selectedNetwork && (
          <div className="sheet-body">
            {showConnectBanner && (
              <div className="wc-banner" style={{ marginBottom: 12 }}>
                <span>Connect wallet to receive on your real {selectedNetwork.name} address</span>
                <button className="wc-banner-btn" onClick={() => open()}>Connect</button>
              </div>
            )}

            {/* Network Selector */}
            <div className="network-section">
              <p className="field-label">Network</p>
              <div className="network-chips">
                {networks.map(net => (
                  <button
                    key={net.id}
                    className={`network-chip${selectedNetwork.id === net.id ? ' active' : ''}`}
                    style={selectedNetwork.id === net.id
                      ? { borderColor: net.color, color: net.color, background: `${net.color}18` }
                      : {}}
                    onClick={() => setSelectedNetwork(net)}
                  >
                    <span className="net-dot" style={{ background: net.color }} />
                    {net.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="receive-warning">
              <AlertTriangle size={14} />
              <span>Only send <strong>{selectedCoin.symbol}</strong> on <strong>{selectedNetwork.name}</strong> to this address. Sending other assets may result in permanent loss.</span>
            </div>

            {/* QR Code */}
            <div className="qr-container">
              <div className="qr-wrap">
                <QRCodeSVG
                  value={activeAddress}
                  size={180}
                  bgColor="transparent"
                  fgColor="#f8fafc"
                  level="M"
                  includeMargin={false}
                />
                <div className="qr-coin-badge" style={{ background: selectedCoin.color }}>
                  {selectedCoin.image
                    ? <img src={selectedCoin.image} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />
                    : <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{selectedCoin.symbol[0]}</span>
                  }
                </div>
              </div>
              <p className="qr-label">{selectedCoin.name} · {selectedNetwork.name}</p>
            </div>

            {/* Address Display */}
            <div className="address-box">
              <p className="address-text">{activeAddress}</p>
              <div className="address-actions">
                <button className="addr-action-btn copy-btn" onClick={handleCopy}>
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button className="addr-action-btn share-btn">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Fee Info */}
            <div className="receive-meta">
              <div className="meta-row">
                <span>Network Fee</span>
                <span>{selectedNetwork.fee}</span>
              </div>
              <div className="meta-row">
                <span>Arrival Time</span>
                <span>{selectedNetwork.confirmations}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
