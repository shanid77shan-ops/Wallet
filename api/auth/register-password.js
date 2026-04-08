import {
  createToken,
  findUserByEmail,
  generateUserId,
  getUserStore,
  hashPassword,
  normalizeEmail,
  validateEmail,
  validatePassword,
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
    const passwordMeta = hashPassword(password)

    let userId
    let user

    if (existing) {
      userId = existing[0]
      user = {
        ...existing[1],
        passwordHash: passwordMeta.hash,
        passwordSalt: passwordMeta.salt,
        updatedAt: new Date().toISOString(),
      }
    } else {
      userId = generateUserId()
      user = {
        id: userId,
        email: normalizedEmail,
        passwordHash: passwordMeta.hash,
        passwordSalt: passwordMeta.salt,
        createdAt: new Date().toISOString(),
      }
    }

    userStore.set(userId, user)

    const token = createToken(user.id, user.email)
    return res.status(200).json({
      success: true,
      token,
      userId: user.id,
      email: user.email,
      message: existing ? 'Password updated successfully' : 'Account created successfully',
    })
  } catch (error) {
    console.error('register-password error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
