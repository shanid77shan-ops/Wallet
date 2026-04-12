/**
 * Unlock.jsx
 * PIN unlock screen — shown when a wallet exists but the session is fresh.
 * Also handles "Forgot PIN" recovery via seed phrase re-entry.
 */
import { useState, useEffect } from 'react'
import { useXDTWallet } from '../context/XDTWalletContext'
import {
  validateMnemonic,
  setupWallet,
  deriveETHWallet,
  deriveTRONWallet,
} from '../services/walletKeyService'
import './Unlock.css'

const MODE = {
  UNLOCK:          'unlock',
  RECOVER_PHRASE:  'recover_phrase',
  RECOVER_PIN:     'recover_pin',
  RECOVER_SUCCESS: 'recover_success',
}

export default function Unlock() {
  const { unlock, unlockError, setWalletAfterSetup } = useXDTWallet()

  // ── Unlock state ─────────────────────────────────────────────────────────────
  const [pin,     setPin]     = useState('')
  const [loading, setLoading] = useState(false)

  // ── Recovery state ───────────────────────────────────────────────────────────
  const [mode,       setMode]       = useState(MODE.UNLOCK)
  const [phrase,     setPhrase]     = useState('')
  const [newPin,     setNewPin]     = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [recoverErr, setRecoverErr] = useState('')
  const [recoverBusy, setRecoverBusy] = useState(false)

  // ── Normal unlock ────────────────────────────────────────────────────────────
  async function handleUnlock(e) {
    e.preventDefault()
    if (pin.length < 4) return
    setLoading(true)
    await unlock(pin)
    setLoading(false)
  }

  // Auto-clear PIN when wrong PIN error appears
  useEffect(() => {
    if (unlockError) {
      const t = setTimeout(() => setPin(''), 400)
      return () => clearTimeout(t)
    }
  }, [unlockError])

  function pressDigit(d) {
    if (pin.length >= 4) return
    const newPin = pin + d
    setPin(newPin)
    if (newPin.length === 4) {
      setLoading(true)
      unlock(newPin).finally(() => setLoading(false))
    }
  }
  function backspace() { setPin(p => p.slice(0, -1)) }

  const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  // ── Recovery: validate phrase ────────────────────────────────────────────────
  function handlePhraseNext() {
    setRecoverErr('')
    const clean = phrase.trim().replace(/\s+/g, ' ')
    if (!validateMnemonic(clean)) {
      setRecoverErr('Invalid seed phrase. Check spelling and word count.')
      return
    }
    setPhrase(clean)
    setMode(MODE.RECOVER_PIN)
  }

  // ── Recovery: set new PIN ────────────────────────────────────────────────────
  async function handleRecoverFinish() {
    setRecoverErr('')
    if (newPin.length !== 4) {
      setRecoverErr('PIN must be exactly 4 digits.')
      setNewPin('')
      setPinConfirm('')
      return
    }
    if (newPin !== pinConfirm) {
      setRecoverErr('PINs do not match.')
      setNewPin('')
      setPinConfirm('')
      return
    }

    setRecoverBusy(true)
    try {
      const { ethAddress, tronAddress } = await setupWallet(phrase, newPin)
      const eth  = deriveETHWallet(phrase)
      const tron = deriveTRONWallet(phrase)
      setWalletAfterSetup({
        ethAddress,
        ethPrivateKey:       eth.privateKey,
        tronAddress,
        tronPrivateKey:      tron.privateKey,
        tronEthStyleAddress: tron.ethStyleAddress,
      })
      setMode(MODE.RECOVER_SUCCESS)
    } catch (err) {
      setRecoverErr(err.message || 'Recovery failed. Try again.')
    } finally {
      setRecoverBusy(false)
    }
  }

  function resetToUnlock() {
    setMode(MODE.UNLOCK)
    setPhrase('')
    setNewPin('')
    setPinConfirm('')
    setRecoverErr('')
    setPin('')
  }

  // ── Render: Recovery — enter phrase ─────────────────────────────────────────
  if (mode === MODE.RECOVER_PHRASE) {
    return (
      <div className="unlock-page">
        <div className="unlock-logo">
          <img src="/app-icon.jpg" alt="XDT Wallet" className="unlock-logo-img" />
          <h1 className="unlock-brand">XDT Wallet</h1>
        </div>

        <div className="recover-card">
          <h2 className="recover-title">Reset PIN</h2>
          <p className="recover-sub">
            Enter your 12-word seed phrase to set a new PIN.
          </p>
          <textarea
            className="recover-phrase-input"
            placeholder="word1 word2 word3 … word12"
            value={phrase}
            onChange={e => { setPhrase(e.target.value); setRecoverErr('') }}
            rows={4}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          {recoverErr && <p className="recover-error">{recoverErr}</p>}
          <button className="recover-btn primary" onClick={handlePhraseNext}>
            Continue
          </button>
          <button className="recover-btn ghost" onClick={resetToUnlock}>
            ← Back to PIN
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Recovery — set new PIN ──────────────────────────────────────────
  if (mode === MODE.RECOVER_PIN) {
    return (
      <div className="unlock-page">
        <div className="unlock-logo">
          <img src="/app-icon.jpg" alt="XDT Wallet" className="unlock-logo-img" />
          <h1 className="unlock-brand">XDT Wallet</h1>
        </div>

        <div className="recover-card">
          <h2 className="recover-title">Set New PIN</h2>
          <p className="recover-sub">Choose a new PIN to secure your wallet.</p>
          <input
            className="recover-pin-input"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="New PIN (4 digits)"
            value={newPin}
            onChange={e => { setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setRecoverErr('') }}
          />
          <input
            className="recover-pin-input"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Confirm new PIN"
            value={pinConfirm}
            onChange={e => { setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4)); setRecoverErr('') }}
            onKeyDown={e => e.key === 'Enter' && handleRecoverFinish()}
          />
          {recoverErr && <p className="recover-error">{recoverErr}</p>}
          <button
            className="recover-btn primary"
            onClick={handleRecoverFinish}
            disabled={recoverBusy}
          >
            {recoverBusy ? 'Saving…' : 'Reset PIN'}
          </button>
          <button className="recover-btn ghost" onClick={() => { setMode(MODE.RECOVER_PHRASE); setRecoverErr('') }}>
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Normal unlock ────────────────────────────────────────────────────
  return (
    <div className="unlock-page">
      <div className="unlock-logo">
        <img src="/app-icon.jpg" alt="XDT Wallet" className="unlock-logo-img" />
        <h1 className="unlock-brand">XDT Wallet</h1>
      </div>

      <p className="unlock-label">Enter your PIN</p>

      {/* PIN dots */}
      <div className="pin-dots">
        {Array.from({ length: 4 }).map((_, i) => (
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

      <button className="forgot-pin-btn" onClick={() => setMode(MODE.RECOVER_PHRASE)}>
        Forgot PIN?
      </button>
    </div>
  )
}
