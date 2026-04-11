import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import './Auth.css'

export default function Auth() {
  const { sendOTP, verifyOTP, loginWithPassword, registerWithPassword, isLoading, error } = useAuth()

  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [otp,      setOtp]      = useState('')
  const [localErr, setLocalErr] = useState('')

  async function handleLogin(e) {
    e.preventDefault(); setLocalErr('')
    try { await loginWithPassword(email.trim(), password) }
    catch (err) { setLocalErr(err.message || 'Login failed') }
  }
  async function handleRegister(e) {
    e.preventDefault(); setLocalErr('')
    try { await registerWithPassword(email.trim(), password) }
    catch (err) { setLocalErr(err.message || 'Registration failed') }
  }
  async function handleSendOTP(e) {
    e.preventDefault(); setLocalErr('')
    try { await sendOTP(email.trim()); setMode('otp') }
    catch (err) { setLocalErr(err.message || 'Failed to send OTP') }
  }
  async function handleVerifyOTP(e) {
    e.preventDefault(); setLocalErr('')
    try { await verifyOTP(email.trim(), otp.trim()) }
    catch (err) { setLocalErr(err.message || 'Invalid OTP') }
  }

  const displayErr = localErr || error

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/app-icon.jpg" alt="XDT Wallet" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">XDT Wallet</h1>
        <p className="auth-subtitle">
          {mode === 'otp' ? `Enter the code sent to ${email}` : 'Sign in or create an account'}
        </p>
        {mode !== 'otp' && (
          <div className="auth-tabs">
            {['login', 'register', 'otp_send'].map(m => {
              const labels = { login: 'Password', register: 'Register', otp_send: 'Email OTP' }
              const current = mode === 'otp_send' ? 'otp_send' : mode
              return (
                <button key={m} className={`auth-tab ${current === m ? 'active' : ''}`}
                  onClick={() => { setMode(m === 'otp_send' ? 'otp_send' : m); setLocalErr('') }}>
                  {labels[m]}
                </button>
              )
            })}
          </div>
        )}
        {mode === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <input className="auth-input" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            {displayErr && <p className="auth-error">{displayErr}</p>}
            <button className="auth-btn" type="submit" disabled={isLoading}>{isLoading ? <span className="auth-spinner" /> : null}Sign In</button>
          </form>
        )}
        {mode === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <input className="auth-input" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password (min 6 chars)" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
            {displayErr && <p className="auth-error">{displayErr}</p>}
            <button className="auth-btn" type="submit" disabled={isLoading}>{isLoading ? <span className="auth-spinner" /> : null}Create Account</button>
          </form>
        )}
        {mode === 'otp_send' && (
          <form className="auth-form" onSubmit={handleSendOTP}>
            <input className="auth-input" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            {displayErr && <p className="auth-error">{displayErr}</p>}
            <button className="auth-btn" type="submit" disabled={isLoading}>{isLoading ? <span className="auth-spinner" /> : null}Send OTP</button>
          </form>
        )}
        {mode === 'otp' && (
          <form className="auth-form" onSubmit={handleVerifyOTP}>
            <input className="auth-input" type="text" placeholder="6-digit OTP" required inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            {displayErr && <p className="auth-error">{displayErr}</p>}
            <button className="auth-btn" type="submit" disabled={isLoading}>{isLoading ? <span className="auth-spinner" /> : null}Verify OTP</button>
            <button type="button" className="auth-back-btn" onClick={() => { setMode('otp_send'); setOtp(''); setLocalErr('') }}>← Change email</button>
          </form>
        )}
        <p className="auth-footnote">Non-custodial · Your keys · Your crypto</p>
      </div>
    </div>
  )
}
