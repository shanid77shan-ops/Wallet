import { createToken, createUser, findUserByEmail, generateUserId, hashPassword, normalizeEmail, validateEmail, validatePassword } from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email, password } = req.body || {}
    const normalizedEmail = normalizeEmail(email)
    if (!validateEmail(normalizedEmail)) return res.status(400).json({ error: 'Invalid email format' })
    if (!validatePassword(password))     return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const existing = await findUserByEmail(normalizedEmail)
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' })

    const { salt, hash } = hashPassword(password)
    const userId = generateUserId()
    const user   = await createUser({ userId, email: normalizedEmail, passwordHash: hash, passwordSalt: salt })

    const token = createToken(userId, normalizedEmail)
    return res.status(201).json({ success: true, token, userId, email: normalizedEmail })
  } catch (err) {
    console.error('register-password error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
