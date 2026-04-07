import { useState, useEffect } from 'react'
import {
  X, ChevronRight, Clipboard, AlertTriangle, ArrowRight,
  Check, ScanLine, Search, Wifi, ExternalLink,
} from 'lucide-react'
import { useAppKitAccount, useAppKitNetwork, useAppKit } from '@reown/appkit/react'
import {
  useSendTransaction, useWriteContract,
  useWaitForTransactionReceipt, useSwitchChain,
} from 'wagmi'
import { parseEther, parseUnits, erc20Abi, isAddress } from 'viem'
import { useCoins } from '../context/CoinContext'
import { useWallet } from '../context/WalletContext'
import { getNetworks } from '../data/networks'
import { TOKEN_CONTRACTS, TOKEN_DECIMALS } from '../config/walletConnect'
import CoinImage from './CoinImage'
import './Sheet.css'
import './SendSheet.css'

const fmt = (n) => n >= 1
  ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : n.toFixed(6)

const feeColors = {
  'Very Low': '#10b981', 'Low': '#3b82f6', 'Medium': '#f59e0b', 'High': '#ef4444',
}

// Map our network IDs to wagmi chain IDs
const NETWORK_CHAIN_IDS = {
  'eth-mainnet': 1, 'arbitrum': 42161, 'optimism': 10,
  'polygon': 137,   'base': 8453,      'bsc': 56,  'avax-c': 43114,
}

// Coins that are native gas tokens on a given chain
const NATIVE_TOKENS = {
  'ethereum':    [1, 42161, 10, 8453],
  'matic-network': [137],
  'binancecoin': [56],
  'avalanche-2': [43114],
}

function isNativeOnChain(coinId, chainId) {
  return (NATIVE_TOKENS[coinId] ?? []).includes(chainId)
}

export default function SendSheet({ onClose }) {
  const { coins } = useCoins()
  const { sendCoin } = useWallet()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const { switchChain } = useSwitchChain()

  // Wagmi real-tx hooks
  const {
    sendTransaction,
    data: nativeTxHash,
    isPending: isSendPending,
    error: sendError,
    reset: resetSend,
  } = useSendTransaction()

  const {
    writeContract,
    data: erc20TxHash,
    isPending: isErc20Pending,
    error: erc20Error,
    reset: resetErc20,
  } = useWriteContract()

  const realTxHash = nativeTxHash ?? erc20TxHash
  const isRealPending = isSendPending || isErc20Pending
  const realError = sendError ?? erc20Error

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash: realTxHash })

  // Local state
  const [step, setStep] = useState('coin')
  const [coinSearch, setCoinSearch] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [addressError, setAddressError] = useState('')
  const [sent, setSent] = useState(false)
  const [mockTxHash, setMockTxHash] = useState(null)

  const networks = selectedCoin ? getNetworks(selectedCoin.id) : []
  const price = selectedCoin?.price ?? 0
  const usdValue = parseFloat(amount || 0) * price
  const maxAmount = selectedCoin?.balance ?? 0
  const connectedChainId = caipNetwork?.id

  // Determine if we're doing a real on-chain send
  const targetChainId = selectedNetwork ? NETWORK_CHAIN_IDS[selectedNetwork.id] : null
  const canSendReal = isConnected && targetChainId != null
  const needsChainSwitch = canSendReal && connectedChainId !== targetChainId

  // Close sheet after real confirmation
  useEffect(() => {
    if (isConfirmed && realTxHash) setSent(true)
  }, [isConfirmed, realTxHash])

  const handleSelectCoin = (coin) => {
    const nets = getNetworks(coin.id)
    setSelectedCoin(coin)
    setSelectedNetwork(nets[0] ?? null)
    setStep('details')
    setCoinSearch('')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setToAddress(text.trim())
      setAddressError('')
    } catch {
      setAddressError('Clipboard read failed — paste manually')
    }
  }

  const validateAndContinue = () => {
    if (!toAddress.trim()) { setAddressError('Enter a recipient address'); return }
    if (targetChainId && !isAddress(toAddress) && toAddress.startsWith('0x')) {
      setAddressError('Invalid EVM address'); return
    }
    setAddressError('')
    setStep('confirm')
  }

  const handleConfirm = async () => {
    if (canSendReal) {
      // ── Real blockchain transaction ──
      if (needsChainSwitch) {
        switchChain({ chainId: targetChainId })
        return
      }

      const tokenAddress = TOKEN_CONTRACTS[selectedCoin.id]?.[targetChainId]
      const native = isNativeOnChain(selectedCoin.id, targetChainId)

      try {
        if (native) {
          sendTransaction({ to: toAddress, value: parseEther(amount) })
        } else if (tokenAddress) {
          const decimals = TOKEN_DECIMALS[selectedCoin.id] ?? 18
          writeContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [toAddress, parseUnits(amount, decimals)],
          })
        } else {
          // No token address for this network — fall back to mock
          doMockSend()
        }
      } catch { /* errors surfaced via realError */ }
    } else {
      doMockSend()
    }
  }

  const doMockSend = () => {
    const result = sendCoin({
      coinId: selectedCoin.id, symbol: selectedCoin.symbol,
      amount, usdValue, toAddress, network: selectedNetwork,
    })
    setMockTxHash(result.txHash)
    setSent(true)
  }

  const displayHash = realTxHash ?? mockTxHash
  const truncate = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : ''

  const explorerUrl = realTxHash && targetChainId
    ? {
        1:     `https://etherscan.io/tx/${realTxHash}`,
        137:   `https://polygonscan.com/tx/${realTxHash}`,
        42161: `https://arbiscan.io/tx/${realTxHash}`,
        10:    `https://optimistic.etherscan.io/tx/${realTxHash}`,
        8453:  `https://basescan.org/tx/${realTxHash}`,
        56:    `https://bscscan.com/tx/${realTxHash}`,
        43114: `https://snowtrace.io/tx/${realTxHash}`,
      }[targetChainId]
    : null

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Header */}
        <div className="sheet-header">
          {(step === 'details' || step === 'confirm') && !sent && (
            <button className="sheet-back"
              onClick={() => { step === 'confirm' ? setStep('details') : setStep('coin'); resetSend(); resetErc20() }}>
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
          <h2 className="sheet-title">
            {step === 'coin'    && 'Send'}
            {step === 'details' && `Send ${selectedCoin?.symbol}`}
            {step === 'confirm' && (!sent ? 'Confirm Send' : 'Sent!')}
          </h2>
          <button className="sheet-close" onClick={onClose}><X size={20} /></button>
        </div>

        {step !== 'coin' && !sent && (
          <div className="step-dots">
            {['coin', 'details', 'confirm'].map((s, i) => (
              <div key={s} className={`step-dot${step === s ? ' active' : (
                ['coin','details','confirm'].indexOf(step) > i ? ' done' : ''
              )}`} />
            ))}
          </div>
        )}

        {/* ── STEP 1: Coin Select ── */}
        {step === 'coin' && (
          <div className="sheet-body">
            {/* WalletConnect banner if not connected */}
            {!isConnected && (
              <div className="wc-banner">
                <Wifi size={14} />
                <span>Connect a wallet to send real crypto on-chain</span>
                <button className="wc-banner-btn" onClick={() => open()}>Connect</button>
              </div>
            )}
            <div className="sheet-search-bar">
              <Search size={14} color="var(--text-muted)" />
              <input className="sheet-search-input" placeholder="Search coins..."
                value={coinSearch} onChange={e => setCoinSearch(e.target.value)} autoFocus />
              {coinSearch && <button className="sheet-search-clear" onClick={() => setCoinSearch('')}>✕</button>}
            </div>
            <div className="coin-select-list">
              {coins.filter(c => c.balance > 0)
                .filter(c => c.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
                  c.symbol.toLowerCase().includes(coinSearch.toLowerCase()))
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

        {/* ── STEP 2: Details ── */}
        {step === 'details' && selectedCoin && (
          <div className="sheet-body">
            <div className="field-group">
              <label className="field-label">To Address</label>
              <div className={`address-input-wrap${addressError ? ' has-error' : ''}`}>
                <input className="address-field"
                  placeholder="Paste or scan recipient address"
                  value={toAddress}
                  onChange={e => { setToAddress(e.target.value); setAddressError('') }}
                  spellCheck={false} autoComplete="off" />
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

            <div className="field-group">
              <label className="field-label">Network</label>
              <div className="network-list">
                {networks.map(net => {
                  const chainId = NETWORK_CHAIN_IDS[net.id]
                  const hasToken = isNativeOnChain(selectedCoin.id, chainId) ||
                    !!TOKEN_CONTRACTS[selectedCoin.id]?.[chainId]
                  return (
                    <button key={net.id}
                      className={`network-option${selectedNetwork?.id === net.id ? ' active' : ''}`}
                      onClick={() => setSelectedNetwork(net)}
                      style={selectedNetwork?.id === net.id ? { borderColor: net.color } : {}}>
                      <div className="net-left">
                        <span className="net-dot-lg" style={{ background: net.color }} />
                        <div>
                          <div className="net-name">
                            {net.name}
                            {isConnected && chainId && (
                              <span className={`net-mode-tag ${hasToken ? 'real' : 'sim'}`}>
                                {hasToken ? '● Live' : '◎ Simulated'}
                              </span>
                            )}
                          </div>
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
                  )
                })}
              </div>
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label className="field-label">Amount</label>
                <span className="field-balance">Available: {maxAmount} {selectedCoin.symbol}</span>
              </div>
              <div className="amount-wrap">
                <input className="amount-field" type="number" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)} />
                <span className="amount-symbol">{selectedCoin.symbol}</span>
                <button className="max-btn" onClick={() => setAmount(maxAmount.toString())}>MAX</button>
              </div>
              <div className="amount-usd">≈ ${fmt(usdValue)} USD</div>
            </div>

            <button className="sheet-cta-btn"
              onClick={validateAndContinue}
              disabled={!toAddress.trim() || !amount || parseFloat(amount) <= 0}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 'confirm' && selectedCoin && selectedNetwork && !sent && (
          <div className="sheet-body">
            {/* Real-tx mode banner */}
            {canSendReal && (
              <div className={`tx-mode-banner ${needsChainSwitch ? 'switch' : 'real'}`}>
                {needsChainSwitch
                  ? `⚠ Switch to ${selectedNetwork.name} to continue`
                  : `✓ Real on-chain transaction via ${address?.slice(0,6)}...${address?.slice(-4)}`}
              </div>
            )}

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
                <span className="confirm-val mono">
                  {isConnected ? truncate(address) : `My ${selectedCoin.symbol} Wallet`}
                </span>
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

            {realError && (
              <div className="tx-error-banner">
                <AlertTriangle size={13} />
                {realError.shortMessage ?? realError.message ?? 'Transaction failed'}
              </div>
            )}

            <div className="confirm-warning">
              <AlertTriangle size={13} />
              <span>This transaction is irreversible. Double-check the address.</span>
            </div>

            <button className="sheet-cta-btn send-btn"
              onClick={handleConfirm}
              disabled={isRealPending || isConfirming}>
              {isRealPending  ? 'Waiting for wallet...' :
               isConfirming   ? 'Confirming on-chain...' :
               needsChainSwitch ? `Switch to ${selectedNetwork.name}` :
               'Confirm & Send'}
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
            <p className="success-sub">{amount} {selectedCoin?.symbol} → {selectedNetwork?.name}</p>

            {displayHash && (
              <div className="tx-hash-box">
                <p className="tx-hash-label">
                  Transaction Hash
                  {realTxHash && <span className="hash-real-tag">On-chain</span>}
                </p>
                <p className="tx-hash-value">{displayHash.slice(0, 22)}...{displayHash.slice(-8)}</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="tx-hash-copy"
                    onClick={() => navigator.clipboard.writeText(displayHash)}>
                    <Check size={12} /> Copy
                  </button>
                  {explorerUrl && (
                    <a className="tx-hash-copy" href={explorerUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={12} /> Explorer
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className={`tx-pending-badge ${isConfirmed ? 'confirmed' : ''}`}>
              <span className={`pending-dot ${isConfirmed ? 'confirmed-dot' : ''}`} />
              {isConfirmed ? 'Confirmed on-chain ✓' : `Pending confirmation (~${selectedNetwork?.confirmations})`}
            </div>

            <button className="sheet-close-btn-full" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
