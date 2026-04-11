/**
 * Unlock.jsx
 * PIN unlock screen — shown when a wallet exists but the session is fresh.
 */
import { useState } from 'react'
import { useXDTWallet } from '../context/XDTWalletContext'
import './Unlock.css'

export default function Unlock() {
  const { unlock, unlockError } = useXDTWallet()
  const [pin,     setPin]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUnlock(e) {
    e.preventDefault()
    if (pin.length < 4) return
    setLoading(true)
    await unlock(pin)
    setLoading(false)
  }

  // Numpad helper
  function pressDigit(d) {
    if (pin.length >= 8) return
    setPin(p => p + d)
  }
  function backspace() { setPin(p => p.slice(0, -1)) }

  const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="unlock-page">
      <div className="unlock-logo">
        <img src="/app-icon.jpg" alt="XDT Wallet" className="unlock-logo-img" />
        <h1 className="unlock-brand">XDT Wallet</h1>
      </div>

      <p className="unlock-label">Enter your PIN</p>

      {/* PIN dots */}
      <div className="pin-dots">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>

      {unlockError && <p className="unlock-error">{unlockError}</p>}

      {/* Numpad */}
      <div className="numpad">
        {DIGITS.map((d, i) => (
          <button
            key={i}
            className={`num-key ${d === '' ? 'empty' : ''}`}
            onClick={() => {
              if (d === '⌫') backspace()
              else if (d !== '') pressDigit(d)
            }}
            disabled={loading}
          >
            {d}
          </button>
        ))}
      </div>

      <button
        className="unlock-submit-btn"
        onClick={handleUnlock}
        disabled={pin.length < 4 || loading}
      >
        {loading ? 'Unlocking…' : 'Unlock'}
      </button>
    </div>
  )
}
