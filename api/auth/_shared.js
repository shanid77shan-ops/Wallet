import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

export function getOtpStore() {
  if (!global.otpStore) {
    global.otpStore = new Map()
  }
  return global.otpStore
}

export function getUserStore() {
  if (!global.userStore) {
    global.userStore = new Map()
  }
  return global.userStore
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim()
}

export function generateUserId() {
  return 'user_' + randomBytes(8).toString('hex')
}

export function createToken(userId, email) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      email,
      iat: now,
      exp: now + 7 * 24 * 60 * 60,
    }),
  )
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${header}.${payload}.signature`
}

export function findUserByEmail(userStore, normalizedEmail) {
  for (const [userId, userData] of userStore.entries()) {
    if (userData.email === normalizedEmail) {
      return [userId, userData]
    }
  }
  return null
}

export function validatePassword(password) {
  return typeof password === 'string' && password.trim().length >= 8
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return { salt, hash }
}

export function verifyPassword(password, salt, expectedHash) {
  const computed = scryptSync(password, salt, 64)
  const expected = Buffer.from(expectedHash, 'hex')

  if (computed.length !== expected.length) {
    return false
  }

  return timingSafeEqual(computed, expected)
}
