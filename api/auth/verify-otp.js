import { createToken, normalizeEmail, validateEmail, verifyOtpCode } from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email, otp } = req.body || {}
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' })

    const normalizedEmail = normalizeEmail(email)
    if (!validateEmail(normalizedEmail)) return res.status(400).json({ error: 'Invalid email format' })
    if (typeof otp !== 'string' || otp.trim().length !== 6 || !/^\d+$/.test(otp))
      return res.status(400).json({ error: 'Invalid OTP format' })

    const user = await verifyOtpCode(normalizedEmail, otp.trim())
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' })

    const token = createToken(user.userId, user.email)
    return res.status(200).json({ success: true, token, userId: user.userId, email: user.email })
  } catch (err) {
    console.error('verify-otp error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
