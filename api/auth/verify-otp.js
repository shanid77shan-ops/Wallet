const crypto = require('crypto')

// Access shared OTP store from global scope
const getOtpStore = () => {
  if (!global.otpStore) {
    global.otpStore = new Map()
  }
  return global.otpStore
}

// Access shared user store from global scope
const getUserStore = () => {
  if (!global.userStore) {
    global.userStore = new Map()
  }
  return global.userStore
}

// Simple JWT creation (for development)
function createToken(userId, email) {
  // WARNING: This is a simple implementation for development
  // In production, use a proper JWT library like 'jsonwebtoken'

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(JSON.stringify({
    userId,
    email,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  })).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  // For this simple implementation, we'll just return a base64 token
  // In production, sign with HMAC
  const token = `${header}.${payload}.signature`
  return token
}

// Generate user ID
function generateUserId() {
  return 'user_' + crypto.randomBytes(8).toString('hex')
}

// Validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

module.exports = async function handler(req, res) {
  // Set JSON header FIRST
  res.setHeader('Content-Type', 'application/json')

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse body safely
    let body = req.body

    // If body is a string, parse it
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        return res.status(400).json({ error: 'Invalid JSON in request body' })
      }
    }

    const { email, otp } = body

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (typeof otp !== 'string' || otp.trim().length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' })
    }

    // Get OTP store and validate OTP
    const otpStore = getOtpStore()
    const storedData = otpStore.get(normalizedEmail)

    if (!storedData) {
      return res.status(400).json({ error: 'OTP not found. Please request a new one.' })
    }

    const now = Date.now()

    // Check if OTP has expired
    if (now > storedData.expiryTime) {
      otpStore.delete(normalizedEmail)
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' })
    }

    // Validate OTP matches
    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' })
    }

    // OTP is valid! Delete it so it can't be reused
    otpStore.delete(normalizedEmail)

    // Check if user exists
    const userStore = getUserStore()
    let user = null
    for (const [, userData] of userStore.entries()) {
      if (userData.email === normalizedEmail) {
        user = userData
        break
      }
    }

    // Create user if doesn't exist
    if (!user) {
      const userId = generateUserId()
      user = {
        id: userId,
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
      }
      userStore.set(userId, user)
    }

    // Create token
    const token = createToken(user.id, user.email)

    // Success
    return res.status(200).json({
      success: true,
      token,
      userId: user.id,
      email: user.email,
      message: 'Successfully verified OTP',
    })
  } catch (error) {
    console.error('verify-otp error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
