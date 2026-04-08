import {
  createToken,
  findUserByEmail,
  getUserStore,
  normalizeEmail,
  validateEmail,
  validatePassword,
  verifyPassword,
} from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { email, password } = body || {}

    const normalizedEmail = normalizeEmail(email)
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const userStore = getUserStore()
    const existing = findUserByEmail(userStore, normalizedEmail)

    if (!existing) {
      return res.status(404).json({ error: 'Account not found. Please create your account first.' })
    }

    const user = existing[1]
    if (!user.passwordHash || !user.passwordSalt) {
      return res.status(400).json({ error: 'Password is not set for this account yet.' })
    }

    const valid = verifyPassword(password, user.passwordSalt, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = createToken(user.id, user.email)
    return res.status(200).json({
      success: true,
      token,
      userId: user.id,
      email: user.email,
      message: 'Login successful',
    })
  } catch (error) {
    console.error('login-password error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
