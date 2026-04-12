import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import './Auth.css'

const MODE = {
  LANDING:      'landing',
  LOGIN:        'login',
  REGISTER:     'register',
  FORGOT:       'forgot',
  FORGOT_SENT:  'forgot_sent',
}

export default function Auth() {
  const { loginWithPassword, registerWithPassword, forgotPassword, isLoading, error } = useAuth()

  const [mode,     setMode]     = useState(MODE.LANDING)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [localErr, setLocalErr] = useState('')

  function reset(nextMode) {
    setLocalErr('')
    setEmail('')
    setPassword('')
    setMode(nextMode)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLocalErr('')
    try { await loginWithPassword(email.trim(), password) }
    catch (err) { setLocalErr(err.message || 'Login failed') }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLocalErr('')
    if (password.length < 8) { setLocalErr('Password must be at least 8 characters'); return }
    try { await registerWithPassword(email.trim(), password) }
    catch (err) { setLocalErr(err.message || 'Registration failed') }
  }

  async function handleForgot(e) {
    e.preventDefault()
    setLocalErr('')
    try {
      await forgotPassword(email.trim())
      setMode(MODE.FORGOT_SENT)
    } catch (err) {
      setLocalErr(err.message || 'Failed to send reset email')
    }
  }

  const displayErr = localErr

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <img src="/app-icon.jpg" alt="XDT Wallet" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">XDT Wallet</h1>

        {/* ── LANDING ──────────────────────────────────────────────────────── */}
        {mode === MODE.LANDING && (
          <>
            <p className="auth-subtitle">Your crypto. Your future.</p>
            <div className="auth-landing-btns">
              <button className="auth-btn" onClick={() => setMode(MODE.LOGIN)}>
                Sign In
              </button>
              <button className="auth-btn auth-btn-outline" onClick={() => setMode(MODE.REGISTER)}>
                Create Account
              </button>
            </div>
            <p className="auth-footnote">Non-custodial · Your keys · Your crypto</p>
          </>
        )}

        {/* ── LOGIN ────────────────────────────────────────────────────────── */}
        {mode === MODE.LOGIN && (
          <>
            <p className="auth-subtitle">Welcome back</p>
            <form className="auth-form" onSubmit={handleLogin}>
              <input
                className="auth-input" type="email" placeholder="Email"
                required autoComplete="email"
                value={email} onChange={e => { setEmail(e.target.value); setLocalErr('') }}
              />
              <input
                className="auth-input" type="password" placeholder="Password"
                required autoComplete="current-password"
                value={password} onChange={e => { setPassword(e.target.value); setLocalErr('') }}
              />
              <button
                type="button" className="auth-forgot-link"
                onClick={() => { setLocalErr(''); setPassword(''); setMode(MODE.FORGOT) }}
              >
                Forgot password?
              </button>
              {displayErr && <p className="auth-error">{displayErr}</p>}
              <button className="auth-btn" type="submit" disabled={isLoading}>
                {isLoading ? <span className="auth-spinner" /> : null}
                Sign In
              </button>
            </form>
            <button className="auth-back-btn" onClick={() => reset(MODE.LANDING)}>← Back</button>
          </>
        )}

        {/* ── REGISTER ─────────────────────────────────────────────────────── */}
        {mode === MODE.REGISTER && (
          <>
            <p className="auth-subtitle">Create your account</p>
            <form className="auth-form" onSubmit={handleRegister}>
              <input
                className="auth-input" type="email" placeholder="Email"
                required autoComplete="email"
                value={email} onChange={e => { setEmail(e.target.value); setLocalErr('') }}
              />
              <input
                className="auth-input" type="password" placeholder="Password (min 8 chars)"
                required minLength={8} autoComplete="new-password"
                value={password} onChange={e => { setPassword(e.target.value); setLocalErr('') }}
              />
              {displayErr && <p className="auth-error">{displayErr}</p>}
              <button className="auth-btn" type="submit" disabled={isLoading}>
                {isLoading ? <span className="auth-spinner" /> : null}
                Create Account
              </button>
            </form>
            <button className="auth-back-btn" onClick={() => reset(MODE.LANDING)}>← Back</button>
          </>
        )}

        {/* ── FORGOT PASSWORD ───────────────────────────────────────────────── */}
        {mode === MODE.FORGOT && (
          <>
            <p className="auth-subtitle">Enter your email and we'll send a reset link.</p>
            <form className="auth-form" onSubmit={handleForgot}>
              <input
                className="auth-input" type="email" placeholder="Email"
                required autoComplete="email"
                value={email} onChange={e => { setEmail(e.target.value); setLocalErr('') }}
              />
              {displayErr && <p className="auth-error">{displayErr}</p>}
              <button className="auth-btn" type="submit" disabled={isLoading}>
                {isLoading ? <span className="auth-spinner" /> : null}
                Send Reset Link
              </button>
            </form>
            <button className="auth-back-btn" onClick={() => reset(MODE.LOGIN)}>← Back to Sign In</button>
          </>
        )}

        {/* ── FORGOT SENT ──────────────────────────────────────────────────── */}
        {mode === MODE.FORGOT_SENT && (
          <>
            <div className="auth-success-icon">✓</div>
            <p className="auth-subtitle">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
              Check your inbox.
            </p>
            <button className="auth-btn" onClick={() => reset(MODE.LOGIN)}>
              Back to Sign In
            </button>
          </>
        )}

      </div>
    </div>
  )
}
