// In-memory OTP storage with expiry
// In production, use a proper database or Redis
// Store reference in global scope so it can be accessed across requests
if (!global.otpStore) {
  global.otpStore = new Map()
}
const sharedOtpStore = global.otpStore

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random OTP
function generateOTP(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0')
}

// Send email using nodemailer or a simple service
async function sendEmail(email, otp) {
  // TODO: Implement email sending
  // For development, you can use:
  // - Mailtrap (free test account)
  // - SendGrid (free tier)
  // - Resend
  // - nodemailer with Gmail

  // Example with console.log for development
  console.log(`[DEV] OTP for ${email}: ${otp}`)

  // For now, just return success in development
  return true

  // Production example with SendGrid:
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // await sgMail.send({
  //   to: email,
  //   from: process.env.EMAIL_FROM || 'noreply@cryptowallet.app',
  //   subject: 'Your Crypto Wallet OTP',
  //   html: `
  //     <h1>Your One-Time Password</h1>
  //     <p>Enter this code to verify your email:</p>
  //     <h2>${otp}</h2>
  //     <p>This code expires in 10 minutes.</p>
  //   `,
  // })
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

    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Rate limiting: max 3 OTPs per email per 5 minutes
    const now = Date.now()
    if (sharedOtpStore.has(normalizedEmail)) {
      const { attempts, lastAttempt } = sharedOtpStore.get(normalizedEmail)
      const timeSinceLastAttempt = now - lastAttempt

      if (timeSinceLastAttempt < 5 * 60 * 1000 && attempts >= 3) {
        return res.status(429).json({
          error: 'Too many OTP requests. Please try again later.'
        })
      }
    }

    // Generate OTP
    const otp = generateOTP(6)
    const expiryTime = now + 10 * 60 * 1000 // 10 minutes

    // Store OTP with expiry and attempt tracking
    const currentData = sharedOtpStore.get(normalizedEmail) || {}
    sharedOtpStore.set(normalizedEmail, {
      otp,
      expiryTime,
      attempts: (currentData.attempts || 0) + 1,
      lastAttempt: now,
    })

    // Send email
    try {
      await sendEmail(normalizedEmail, otp)
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return res.status(500).json({
        error: 'Failed to send OTP. Please try again.'
      })
    }

    // Success
    return res.status(200).json({
      success: true,
      message: `OTP sent to ${normalizedEmail}`,
    })
  } catch (error) {
    console.error('send-otp error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Cleanup expired OTPs periodically (optional)
if (typeof global !== 'undefined' && !global.otpCleanupInterval) {
  global.otpCleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [email, data] of sharedOtpStore.entries()) {
      if (data.expiryTime < now) {
        sharedOtpStore.delete(email)
      }
    }
  }, 5 * 60 * 1000) // Every 5 minutes
}
