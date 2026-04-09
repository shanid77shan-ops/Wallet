import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { BrowserProvider } from 'ethers'
import { supabase } from './supabaseClient'
import './Auth.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives a deterministic Supabase email + password from a wallet address.
 * The secret salt stops the "password" being guessable from the public address alone.
 *
 * NOTE: For production, replace this with a proper sign-message / verify-signature
 * flow (sign a server-issued nonce, verify on a Supabase Edge Function).
 */
function credentialsFromAddress(address) {
  const salt = import.meta.env.VITE_WALLET_AUTH_SECRET ?? 'wallet-auth-dev-salt'
  const normalized = address.toLowerCase()
  return {
    email:    `${normalized}@metamask.wallet`,
    password: `${normalized}::${salt}`,
  }
}

/**
 * Sign in if the Supabase account already exists, otherwise sign up first.
 * Returns the Supabase session on success.
 */
async function signInOrRegister(email, password) {
  const signIn = await supabase.auth.signInWithPassword({ email, password })
  if (!signIn.error) return signIn

  // "Invalid login credentials" means the account doesn't exist yet — create it
  if (signIn.error.message.toLowerCase().includes('invalid login')) {
    const signUp = await supabase.auth.signUp({ email, password })
    if (signUp.error) throw new Error(signUp.error.message)

    // signUp auto-signs in on Supabase when email confirmation is disabled
    if (signUp.data.session) return signUp

    // If email confirmation is enabled, sign in right after
    const retry = await supabase.auth.signInWithPassword({ email, password })
    if (retry.error) throw new Error(retry.error.message)
    return retry
  }

  throw new Error(signIn.error.message)
}

/**
 * Upsert the wallet address into the profiles table.
 * Uses onConflict:'id' so it creates the row if missing, updates it if present.
 */
async function upsertProfile(userId, walletAddress) {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, wallet_address: walletAddress },
      { onConflict: 'id' }
    )
  if (error) throw new Error(`Profile save failed: ${error.message}`)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'connecting' | 'authenticating' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [isDetecting, setIsDetecting] = useState(true)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  // Wait for MetaMask to inject before rendering the warning or disabling the button
  useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true, timeout: 3000 })
      .then(provider => {
        setIsMetaMaskInstalled(Boolean(provider))
        setIsDetecting(false)
      })
      .catch(() => setIsDetecting(false))
  }, [])

  async function handleConnect() {
    setErrorMsg('')

    const detectedProvider = await detectEthereumProvider({ mustBeMetaMask: true, timeout: 3000 })
    if (!detectedProvider) {
      setErrorMsg('MetaMask is not installed. Please install it from metamask.io.')
      return
    }

    try {
      // ── Step 1: connect MetaMask and get the wallet address ─────────────────
      setPhase('connecting')
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const walletAddress = accounts[0]

      // ── Step 2: sign in to Supabase (create account if first time) ──────────
      setPhase('authenticating')
      const { email, password } = credentialsFromAddress(walletAddress)
      const { data } = await signInOrRegister(email, password)

      const userId = data.user?.id ?? data.session?.user?.id
      if (!userId) throw new Error('Could not retrieve user ID from Supabase session.')

      // ── Step 3: upsert profile row with the wallet address ──────────────────
      await upsertProfile(userId, walletAddress)

      // App.jsx onAuthStateChange fires automatically — no manual state needed

    } catch (err) {
      const msg =
        err.code === 4001 || err.code === 'ACTION_REJECTED'
          ? 'Connection rejected in MetaMask.'
          : err.message
      setErrorMsg(msg)
      setPhase('error')
    }
  }

  const isBusy = phase === 'connecting' || phase === 'authenticating'

  const buttonLabel = {
    idle:           'Connect Wallet',
    connecting:     'Waiting for MetaMask…',
    authenticating: 'Signing in…',
    error:          'Try Again',
  }[phase]

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo mark */}
        <div className="auth-logo">
          <div className="auth-logo-ring">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="#d6b25f" strokeWidth="1.5" fill="none" />
              <circle cx="16" cy="16" r="5" fill="#d6b25f" opacity="0.9" />
            </svg>
          </div>
        </div>

        <h1 className="auth-title">Crypto Wallet</h1>
        <p className="auth-subtitle">Connect your MetaMask wallet to get started</p>

        {/* MetaMask not installed — only show after detection finishes */}
        {!isDetecting && !isMetaMaskInstalled && (
          <div className="auth-warning">
            MetaMask not detected.{' '}
            <a
              href="https://metamask.io/download"
              target="_blank"
              rel="noreferrer"
              className="auth-link"
            >
              Install it here ↗
            </a>
          </div>
        )}

        {/* Step indicator */}
        {isBusy && (
          <div className="auth-steps">
            <div className={`auth-step ${phase === 'connecting' ? 'active' : 'done'}`}>
              <span className="auth-step-dot" />
              <span>Connect MetaMask</span>
            </div>
            <div className={`auth-step ${phase === 'authenticating' ? 'active' : ''}`}>
              <span className="auth-step-dot" />
              <span>Authenticate</span>
            </div>
            <div className="auth-step">
              <span className="auth-step-dot" />
              <span>Save profile</span>
            </div>
          </div>
        )}

        {/* Connect button */}
        <button
          className="auth-connect-btn"
          onClick={handleConnect}
          disabled={isBusy || isDetecting || !isMetaMaskInstalled}
        >
          {isBusy && <span className="auth-spinner" />}
          {!isBusy && (
            <img
              src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/SVG_MetaMask_Icon_Color.svg"
              width="22"
              height="22"
              alt=""
            />
          )}
          {buttonLabel}
        </button>

        {/* Error */}
        {phase === 'error' && errorMsg && (
          <p className="auth-error">{errorMsg}</p>
        )}

        <p className="auth-footnote">
          Your wallet address is saved to your profile. No password needed.
        </p>
      </div>
    </div>
  )
}
