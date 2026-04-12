import { createToken, findUserByEmail, normalizeEmail, validateEmail, validatePassword, verifyPassword } from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email, password } = req.body || {}
    const normalizedEmail = normalizeEmail(email)
    if (!validateEmail(normalizedEmail)) return res.status(400).json({ error: 'Invalid email format' })
    if (!validatePassword(password))     return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const user = await findUserByEmail(normalizedEmail)
    if (!user)                                   return res.status(404).json({ error: 'Account not found. Please register first.' })
    if (!user.passwordHash || !user.passwordSalt) return res.status(400).json({ error: 'Password not set for this account.' })

    const valid = verifyPassword(password, user.passwordSalt, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    const token = createToken(user.userId, user.email)
    return res.status(200).json({ success: true, token, userId: user.userId, email: user.email })
  } catch (err) {
    console.error('login-password error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
