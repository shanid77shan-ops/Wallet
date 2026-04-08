import {
  createToken,
  findUserByEmail,
  generateUserId,
  getOtpStore,
  getUserStore,
  normalizeEmail,
  validateEmail,
} from './_shared.js'

export default async function handler(req, res) {
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

    const normalizedEmail = normalizeEmail(email)

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
    if (now > storedData.expiry) {
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
    const existing = findUserByEmail(userStore, normalizedEmail)
    let user = existing ? existing[1] : null
    let userId = existing ? existing[0] : null

    // Create user if doesn't exist
    if (!user) {
      userId = generateUserId()
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
