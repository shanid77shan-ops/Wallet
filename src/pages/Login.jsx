import { useState } from 'react'
import { Mail, ArrowLeft, Loader, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { sendOTP, verifyOTP, error, isLoading } = useAuth()

  const [step, setStep] = useState('email') // 'email' or 'otp'
  const [mode, setMode] = useState('') // '', 'login' or 'create'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [codeSent, setCodeSent] = useState(false)
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

    if (mode !== 'create') {
      setLocalError('Please choose Create Wallet to continue with OTP')
      return
    }

    if (!email.trim()) {
      setLocalError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email')
      return
    }

    // Move to OTP screen immediately after valid submit for a smoother flow.
    setStep('otp')
    setOtp('')

    try {
      await sendOTP(email)
      setCodeSent(true)
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

  const handlePasswordLogin = async (e) => {
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

    if (!password.trim()) {
      setLocalError('Please enter your password')
      return
    }

    setLocalError('Password login is not connected yet. Please use Create Wallet OTP for now.')
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

  const handleModeSelect = (nextMode) => {
    setMode(nextMode)
    setStep('email')
    setOtp('')
    setCodeSent(false)
    setResendTimer(0)
    setLocalError('')
  }

  const handleGoToOtpStep = () => {
    setStep('otp')
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
          <form
            onSubmit={mode === 'create' ? handleSendOTP : handlePasswordLogin}
            className="login-form"
          >
            <div className="step-title">
              <h2>
                {mode === 'create'
                  ? 'Create Wallet'
                  : mode === 'login'
                    ? 'Login'
                    : 'Welcome'}
              </h2>
              <p>
                {mode === 'create'
                  ? 'Create a new wallet with your email'
                  : mode === 'login'
                    ? 'Login using your email and password'
                    : 'Select an option to continue'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="mode-toggle">
              <button
                type="button"
                className={`toggle-btn ${mode === 'create' ? 'active' : ''}`}
                onClick={() => handleModeSelect('create')}
              >
                Create Wallet
              </button>
              <button
                type="button"
                className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleModeSelect('login')}
              >
                Login
              </button>
            </div>

            {!mode && (
              <div className="selection-hint">
                Choose Create Wallet or Login to open the form.
              </div>
            )}

            {!!mode && (
              <>
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
                        setCodeSent(false)
                        setLocalError('')
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="field-group">
                    <label className="field-label">Password</label>
                    <div className="email-input-wrap">
                      <Lock size={18} className="email-icon" />
                      <input
                        type="password"
                        className="login-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setLocalError('')
                        }}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

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
                  disabled={
                    isLoading ||
                    !email.trim() ||
                    (mode === 'login' && !password.trim())
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="spinner" />
                      {mode === 'create' ? 'Sending OTP...' : 'Logging in...'}
                    </>
                  ) : mode === 'create' ? (
                    codeSent ? 'Send OTP Again' : 'Send OTP'
                  ) : (
                    'Login'
                  )}
                </button>

                {mode === 'create' && codeSent && (
                  <>
                    <div className="success-message">
                      Code sent successfully. You can now enter your verification code.
                    </div>
                    <button
                      type="button"
                      className="enter-code-btn"
                      onClick={handleGoToOtpStep}
                      disabled={isLoading}
                    >
                      Enter Code
                    </button>
                  </>
                )}
              </>
            )}

            {/* Info Box */}
            {mode === 'create' && (
              <div className="info-box">
                <p>
                  We'll send you a one-time password (OTP) to verify your email.
                </p>
              </div>
            )}

            {mode === 'login' && (
              <div className="info-box">
                <p>
                  Password login UI is enabled. Connect your password API endpoint to complete this flow.
                </p>
              </div>
            )}
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
