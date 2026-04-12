import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../Auth.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8)   { setError('Password must be at least 8 characters'); return }
    if (password !== confirm)   { setError('Passwords do not match'); return }
    if (!token)                 { setError('Invalid reset link. Please request a new one.'); return }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Reset failed')
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/app-icon.jpg" alt="XDT Wallet" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">XDT Wallet</h1>

        {!token && !success && (
          <>
            <p className="auth-subtitle" style={{ color: '#ef4444' }}>
              Invalid or missing reset link.
            </p>
            <button className="auth-btn" onClick={() => navigate('/')}>
              Back to Sign In
            </button>
          </>
        )}

        {token && !success && (
          <>
            <p className="auth-subtitle">Set a new password for your account.</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                className="auth-input" type="password"
                placeholder="New password (min 8 chars)"
                required minLength={8} autoComplete="new-password"
                value={password} onChange={e => { setPassword(e.target.value); setError('') }}
              />
              <input
                className="auth-input" type="password"
                placeholder="Confirm new password"
                required autoComplete="new-password"
                value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }}
              />
              {error && <p className="auth-error">{error}</p>}
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : null}
                Reset Password
              </button>
            </form>
          </>
        )}

        {success && (
          <>
            <div className="auth-success-icon">✓</div>
            <p className="auth-subtitle">
              Your password has been reset successfully.
            </p>
            <button className="auth-btn" onClick={() => navigate('/')}>
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  )
}
