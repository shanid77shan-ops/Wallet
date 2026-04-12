import { Resend } from 'resend'
import { findUserByEmail, createUser, generateUserId, normalizeEmail, saveOtp, validateEmail } from './_shared.js'

const createResendClient = () => process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email } = req.body || {}
    if (!email || !validateEmail(email.trim())) return res.status(400).json({ error: 'A valid email is required' })

    const normalizedEmail = normalizeEmail(email)

    let user = await findUserByEmail(normalizedEmail)
    if (!user) {
      const userId = generateUserId()
      user = await createUser({ userId, email: normalizedEmail })
    }

    const otp    = generateOTP()
    const expiry = Date.now() + 10 * 60 * 1000
    await saveOtp(normalizedEmail, otp, expiry)

    const resend = createResendClient()
    if (resend) {
      const { error } = await resend.emails.send({
        from:    'Crypto Wallet <auth@devshanidp.xyz>',
        to:      normalizedEmail,
        subject: 'Your Login Code',
        html: `<div style="font-family:sans-serif;background:#0f172a;color:white;padding:40px;border-radius:12px;text-align:center;">
          <h2 style="color:#fbbf24;">Verification Code</h2>
          <p style="color:#94a3b8;">Enter this code to access your wallet:</p>
          <div style="background:#1e293b;padding:20px;font-size:42px;font-weight:bold;color:#6366f1;letter-spacing:12px;margin:25px 0;border-radius:8px;">
            ${otp}
          </div>
          <p style="color:#64748b;font-size:12px;">Expires in 10 minutes.</p>
        </div>`,
      })
      if (error) return res.status(500).json({ error: 'Failed to send email' })
    } else {
      console.log(`[DEV OTP] ${normalizedEmail}: ${otp}`)
    }

    return res.status(200).json({ success: true, message: `OTP sent to ${normalizedEmail}` })
  } catch (err) {
    console.error('send-otp error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
