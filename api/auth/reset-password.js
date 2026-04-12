import { findUserByResetToken, saveNewPassword, hashPassword, validatePassword } from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { token, password } = req.body || {}
    if (!token)                    return res.status(400).json({ error: 'Reset token is required' })
    if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const user = await findUserByResetToken(token)
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' })

    const { salt, hash } = hashPassword(password)
    await saveNewPassword(user.email, hash, salt)

    return res.status(200).json({ success: true, message: 'Password reset successfully' })
  } catch (err) {
    console.error('reset-password error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
