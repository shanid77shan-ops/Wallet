import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'auth_token'
const USER_STORAGE_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [topMessage, setTopMessage] = useState('')
  const topMessageTimerRef = useRef(null)

  function showTopMessage(message, duration = 3000) {
    setTopMessage(message)

    if (topMessageTimerRef.current) {
      clearTimeout(topMessageTimerRef.current)
    }

    topMessageTimerRef.current = setTimeout(() => {
      setTopMessage('')
      topMessageTimerRef.current = null
    }, duration)
  }

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setEmail(parsedUser.email)
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }

    setIsLoading(false)
    setIsInitializing(false)
  }, [])

  useEffect(() => {
    return () => {
      if (topMessageTimerRef.current) {
        clearTimeout(topMessageTimerRef.current)
      }
    }
  }, [])

  async function sendOTP(emailAddress) {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress }),
      })

      // Parse JSON only if response has content
      const data = response.status !== 204 ? await response.json() : {}

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setEmail(emailAddress)
      return data
    } catch (err) {
      const message = err.message || 'Failed to send OTP. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyOTP(emailAddress, otp) {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress, otp }),
      })

      // Parse JSON only if response has content
      const data = response.status !== 204 ? await response.json() : {}

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP')
      }

      // Store token and user in localStorage
      localStorage.setItem(STORAGE_KEY, data.token)
      const userData = {
        id: data.userId,
        email: emailAddress,
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

      setUser(userData)
      setEmail(emailAddress)
      showTopMessage('Login successful! Welcome back.')

      return data
    } catch (err) {
      const message = err.message || 'Failed to verify OTP. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function loginWithPassword(emailAddress, password) {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress, password }),
      })

      const data = response.status !== 204 ? await response.json() : {}

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      localStorage.setItem(STORAGE_KEY, data.token)
      const userData = {
        id: data.userId,
        email: emailAddress,
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

      setUser(userData)
      setEmail(emailAddress)
      showTopMessage('Login successful! Welcome back.')
      return data
    } catch (err) {
      const message = err.message || 'Failed to login. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function registerWithPassword(emailAddress, password) {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress, password }),
      })

      const data = response.status !== 204 ? await response.json() : {}

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      localStorage.setItem(STORAGE_KEY, data.token)
      const userData = {
        id: data.userId,
        email: emailAddress,
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

      setUser(userData)
      setEmail(emailAddress)
      showTopMessage('Account created successfully!')
      return data
    } catch (err) {
      const message = err.message || 'Failed to register. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function forgotPassword(emailAddress) {
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress }),
      })
      const data = response.status !== 204 ? await response.json() : {}
      if (!response.ok) throw new Error(data.error || 'Failed to send reset email')
      return data
    } catch (err) {
      const message = err.message || 'Failed to send reset email. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
    setEmail(null)
    setError('')
  }

  // ── DEV BYPASS — remove when auth is re-enabled ───────────────────────────
  function devLogin() {
    const userData = { id: 'dev-user', email: 'dev@xdtwallet.app' }
    localStorage.setItem(STORAGE_KEY, 'dev-token')
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
    setEmail(userData.email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        email,
        isInitializing,
        isLoading,
        error,
        sendOTP,
        verifyOTP,
        loginWithPassword,
        registerWithPassword,
        forgotPassword,
        logout,
        topMessage,
        isAuthenticated: !!user,
        devLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
