import { useState } from 'react'
import { Mail, ArrowLeft, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { sendOTP, verifyOTP, error, isLoading } = useAuth()

  const [step, setStep] = useState('email') // 'email' or 'otp'
  const [mode, setMode] = useState('login') // 'login' or 'create'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [localError, setLocalError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const otpLength = 6

  const validateEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(e)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!email.trim()) {
      setLocalError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email')
      return
    }

    try {
      await sendOTP(email)
      setStep('otp')
      setOtp('')
      setResendTimer(60)

      // Countdown for resend
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      setLocalError(error || 'Failed to send OTP')
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (otp.length !== otpLength) {
      setLocalError(`Please enter a ${otpLength}-digit OTP`)
      return
    }

    try {
      await verifyOTP(email, otp)
      // Success - AuthContext will update user state
    } catch {
      setLocalError(error || 'Invalid OTP')
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setLocalError('')
    try {
      await sendOTP(email)
      setOtp('')
      setResendTimer(60)

      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      setLocalError(error || 'Failed to resend OTP')
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setOtp('')
    setLocalError('')
  }

  return (
    <div className="login-page">
      {/* Header */}
      <div className="login-header">
        <div className="logo-area">
          <div className="logo">💳</div>
        </div>
        <h1>Crypto Wallet</h1>
        <p>Secure, fast & decentralized</p>
      </div>

      {/* Form Container */}
      <div className="login-form-container">
        {step === 'email' ? (
          // Email Step
          <form onSubmit={handleSendOTP} className="login-form">
            <div className="step-title">
              <h2>{mode === 'create' ? 'Create Wallet' : 'Login'}</h2>
              <p>
                {mode === 'create'
                  ? 'Create a new wallet with your email'
                  : 'Enter your email to continue'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="mode-toggle">
              <button
                type="button"
                className={`toggle-btn ${mode === 'create' ? 'active' : ''}`}
                onClick={() => setMode('create')}
              >
                Create Wallet
              </button>
              <button
                type="button"
                className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
            </div>

            {/* Email Input */}
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="email-input-wrap">
                <Mail size={18} className="email-icon" />
                <input
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setLocalError('')
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="error-message">
                {localError || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>

            {/* Info Box */}
            <div className="info-box">
              <p>
                We'll send you a one-time password (OTP) to verify your email.
              </p>
            </div>
          </form>
        ) : (
          // OTP Step
          <form onSubmit={handleVerifyOTP} className="login-form">
            <button
              type="button"
              className="back-btn"
              onClick={handleBackToEmail}
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="step-title">
              <h2>Enter OTP</h2>
              <p>
                Enter the {otpLength}-digit OTP sent to <br />
                <strong>{email}</strong>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="field-group">
              <label className="field-label">One-Time Password</label>
              <input
                type="text"
                className="otp-input"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, otpLength)
                  setOtp(value)
                  setLocalError('')
                }}
                maxLength={otpLength}
                disabled={isLoading}
                inputMode="numeric"
              />
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="error-message">
                {localError || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit"
              disabled={isLoading || otp.length !== otpLength}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Verifying...
                </>
              ) : (
                'Proceed'
              )}
            </button>

            {/* Resend OTP */}
            <div className="resend-section">
              <p className="resend-text">
                Didn't receive the code?
              </p>
              <button
                type="button"
                className={`resend-btn ${resendTimer > 0 ? 'disabled' : ''}`}
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : 'Resend Code'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>By continuing, you agree to our <span>Terms of Service</span></p>
      </div>
    </div>
  )
}
