import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { connectDB } from '../_lib/db.js'
import User from '../_models/User.js'

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim()
}

export function generateUserId() {
  return 'user_' + randomBytes(8).toString('hex')
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
  if (computed.length !== expected.length) return false
  return timingSafeEqual(computed, expected)
}

export function createToken(userId, email) {
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const now     = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(JSON.stringify({ userId, email, iat: now, exp: now + 7 * 24 * 60 * 60 })).toString('base64url')
  return `${header}.${payload}.signature`
}

export function decodeToken(token) {
  try {
    const parts = (token || '').split('.')
    if (parts.length < 2) return null
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch { return null }
}

// ── MongoDB helpers ───────────────────────────────────────────────────────────

export async function findUserByEmail(email) {
  await connectDB()
  return User.findOne({ email: normalizeEmail(email) })
}

export async function createUser({ userId, email, passwordHash = null, passwordSalt = null }) {
  await connectDB()
  return User.create({ userId, email: normalizeEmail(email), passwordHash, passwordSalt })
}

export async function saveOtp(email, code, expiresMs) {
  await connectDB()
  await User.updateOne(
    { email: normalizeEmail(email) },
    { $set: { otpCode: code, otpExpires: new Date(expiresMs) } }
  )
}

export async function verifyOtpCode(email, code) {
  await connectDB()
  const user = await User.findOne({ email: normalizeEmail(email) })
  if (!user || !user.otpCode || !user.otpExpires) return null
  if (user.otpCode !== code) return null
  if (new Date() > user.otpExpires) return null
  // Clear OTP after successful verification
  await User.updateOne({ email: user.email }, { $set: { otpCode: null, otpExpires: null } })
  return user
}
