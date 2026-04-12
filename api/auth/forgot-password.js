import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { findUserByEmail, normalizeEmail, validateEmail, saveResetToken } from './_shared.js'

const createResendClient = () => process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email } = req.body || {}
    const normalizedEmail = normalizeEmail(email)
    if (!validateEmail(normalizedEmail)) return res.status(400).json({ error: 'Invalid email format' })

    const user = await findUserByEmail(normalizedEmail)
    // Always return success to prevent email enumeration
    if (!user) return res.status(200).json({ success: true })

    const token   = randomBytes(32).toString('hex')
    const expiry  = Date.now() + 60 * 60 * 1000 // 1 hour
    await saveResetToken(normalizedEmail, token, expiry)

    const proto = req.headers['x-forwarded-proto'] || 'https'
    const host  = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5173'
    const resetUrl = `${proto}://${host}/reset-password?token=${token}`

    const resend = createResendClient()
    if (resend) {
      await resend.emails.send({
        from:    'XDT Wallet <auth@devshanidp.xyz>',
        to:      normalizedEmail,
        subject: 'Reset your XDT Wallet password',
        html: `
          <div style="font-family:sans-serif;background:#0f172a;color:white;padding:40px;border-radius:12px;text-align:center;max-width:480px;margin:0 auto;">
            <h2 style="color:#e53535;">Reset Your Password</h2>
            <p style="color:#94a3b8;">Click the button below to set a new password. This link expires in 1 hour.</p>
            <a href="${resetUrl}"
               style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#e53535,#c62828);color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
              Reset Password
            </a>
            <p style="color:#64748b;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
          </div>`,
      })
    } else {
      console.log(`[DEV RESET] ${normalizedEmail}: ${resetUrl}`)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('forgot-password error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
