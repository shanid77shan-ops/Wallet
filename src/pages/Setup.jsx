/**
 * Setup.jsx
 * Wallet onboarding: create a new wallet or import an existing seed phrase,
 * set a PIN, and persist the encrypted wallet to localStorage.
 */
import { useState, useRef } from 'react'
import {
  generateMnemonic, validateMnemonic,
  deriveETHWallet, deriveTRONWallet,
  setupWallet,
} from '../services/walletKeyService'
import { useXDTWallet } from '../context/XDTWalletContext'
import { useAuth } from '../context/AuthContext'
import './Setup.css'

// Steps in the flow
const STEP = {
  LANDING:        'landing',
  SHOW_PHRASE:    'show_phrase',
  CONFIRM_PHRASE: 'confirm_phrase',
  IMPORT_PHRASE:  'import_phrase',
  SET_PIN:        'set_pin',
}

export default function Setup() {
  const { setWalletAfterSetup } = useXDTWallet()
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [step,        setStep]        = useState(STEP.LANDING)
  const [mnemonic,    setMnemonic]    = useState('')
  const [importText,  setImportText]  = useState('')
  const [confirmWord, setConfirmWord] = useState('') // spot-check one word
  const [checkIndex,  setCheckIndex]  = useState(0)
  const [pin,         setPin]         = useState('')
  const [pinConfirm,  setPinConfirm]  = useState('')
  const [error,       setError]       = useState('')
  const pinConfirmRef = useRef(null)
  const [loading,     setLoading]     = useState(false)
  const [copied,      setCopied]      = useState(false)

  // ── Create new wallet ────────────────────────────────────────────────────────
  function handleCreateNew() {
    const phrase = generateMnemonic()
    setMnemonic(phrase)
    const words = phrase.split(' ')
    // Pick a random word index for confirmation
    setCheckIndex(Math.floor(Math.random() * words.length))
    setStep(STEP.SHOW_PHRASE)
  }

  function handleCopyPhrase() {
    navigator.clipboard.writeText(mnemonic).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePhraseContinue() {
    setConfirmWord('')
    setError('')
    setStep(STEP.CONFIRM_PHRASE)
  }

  function handleConfirmWord() {
    const words = mnemonic.split(' ')
    if (confirmWord.trim().toLowerCase() !== words[checkIndex].toLowerCase()) {
      setError(`Word #${checkIndex + 1} doesn't match. Please check your phrase.`)
      return
    }
    setError('')
    setStep(STEP.SET_PIN)
  }

  // ── Import existing wallet ───────────────────────────────────────────────────
  function handleImportContinue() {
    const phrase = importText.trim().replace(/\s+/g, ' ')
    if (!validateMnemonic(phrase)) {
      setError('Invalid seed phrase. Please check and try again.')
      return
    }
    setMnemonic(phrase)
    setError('')
    setStep(STEP.SET_PIN)
  }

  // ── Set PIN and finish ────────────────────────────────────────────────────────
  async function handleFinish() {
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits.')
      setPin('')
      setPinConfirm('')
      return
    }
    if (pin !== pinConfirm) {
      setError('PINs do not match.')
      setPin('')
      setPinConfirm('')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { ethAddress, tronAddress } = await setupWallet(mnemonic, pin, userId)
      const eth  = deriveETHWallet(mnemonic)
      const tron = deriveTRONWallet(mnemonic)
      setWalletAfterSetup({
        ethAddress,
        ethPrivateKey:      eth.privateKey,
        tronAddress,
        tronPrivateKey:     tron.privateKey,
        tronEthStyleAddress: tron.ethStyleAddress,
      })
    } catch (err) {
      setError(err.message || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  const words = mnemonic ? mnemonic.split(' ') : []

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="setup-page">
      <div className="setup-logo">
        <img src="/app-icon.jpg" alt="XDT Wallet" className="setup-logo-img" />
        <h1 className="setup-brand">XDT Wallet</h1>
        <p className="setup-tagline">Your crypto. Your future.</p>
      </div>

      {/* ── LANDING ─────────────────────────────────────────────────────────── */}
      {step === STEP.LANDING && (
        <div className="setup-card">
          <h2 className="setup-card-title">Get Started</h2>
          <p className="setup-card-sub">
            xdt-wallet is a non-custodial wallet. Only you hold your keys.
          </p>
          <button className="setup-btn primary" onClick={handleCreateNew}>
            Create New Wallet
          </button>
          <button className="setup-btn secondary" onClick={() => { setError(''); setStep(STEP.IMPORT_PHRASE) }}>
            Import Existing Wallet
          </button>
          <p className="setup-notice">
            Supports ETH · USDT ERC-20 · USDT TRC-20
          </p>
        </div>
      )}

      {/* ── SHOW PHRASE ─────────────────────────────────────────────────────── */}
      {step === STEP.SHOW_PHRASE && (
        <div className="setup-card">
          <h2 className="setup-card-title">Your Seed Phrase</h2>
          <p className="setup-card-sub warning-text">
            ⚠️ Write these 12 words down in order and store them safely.<br />
            Never share them — anyone with these words owns your funds.
          </p>
          <div className="phrase-grid">
            {words.map((w, i) => (
              <div key={i} className="phrase-word">
                <span className="word-num">{i + 1}</span>
                <span className="word-val">{w}</span>
              </div>
            ))}
          </div>
          <button className="setup-btn ghost" onClick={handleCopyPhrase}>
            {copied ? '✓ Copied!' : 'Copy to clipboard'}
          </button>
          <button className="setup-btn primary" onClick={handlePhraseContinue}>
            I've Written It Down
          </button>
        </div>
      )}

      {/* ── CONFIRM ONE WORD ────────────────────────────────────────────────── */}
      {step === STEP.CONFIRM_PHRASE && (
        <div className="setup-card">
          <h2 className="setup-card-title">Confirm Your Phrase</h2>
          <p className="setup-card-sub">
            Enter word <strong>#{checkIndex + 1}</strong> from your seed phrase:
          </p>
          <input
            className="setup-input"
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            placeholder={`Word #${checkIndex + 1}`}
            value={confirmWord}
            onChange={e => { setConfirmWord(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleConfirmWord()}
          />
          {error && <p className="setup-error">{error}</p>}
          <button className="setup-btn primary" onClick={handleConfirmWord}>
            Verify
          </button>
        </div>
      )}

      {/* ── IMPORT PHRASE ───────────────────────────────────────────────────── */}
      {step === STEP.IMPORT_PHRASE && (
        <div className="setup-card">
          <h2 className="setup-card-title">Import Wallet</h2>
          <p className="setup-card-sub">
            Enter your 12 or 24-word seed phrase separated by spaces:
          </p>
          <textarea
            className="setup-textarea"
            placeholder="word1 word2 word3 … word12"
            value={importText}
            onChange={e => { setImportText(e.target.value); setError('') }}
            rows={4}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          {error && <p className="setup-error">{error}</p>}
          <button className="setup-btn primary" onClick={handleImportContinue}>
            Continue
          </button>
          <button className="setup-btn ghost" onClick={() => setStep(STEP.LANDING)}>
            ← Back
          </button>
        </div>
      )}

      {/* ── SET PIN ─────────────────────────────────────────────────────────── */}
      {step === STEP.SET_PIN && (
        <div className="setup-card">
          <h2 className="setup-card-title">Set Your PIN</h2>
          <input
            className="setup-input"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter PIN (4 digits)"
            value={pin}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4)
              setPin(val)
              setError('')
              if (val.length === 4) pinConfirmRef.current?.focus()
            }}
          />
          <input
            ref={pinConfirmRef}
            className="setup-input"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Confirm PIN"
            value={pinConfirm}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4)
              setPinConfirm(val)
              setError('')
              if (val.length === 4) handleFinish()
            }}
          />
          {error && <p className="setup-error">{error}</p>}
          <button
            className="setup-btn primary"
            onClick={handleFinish}
            disabled={loading}
          >
            {loading ? 'Setting up…' : 'Create Wallet'}
          </button>
        </div>
      )}
    </div>
  )
}
