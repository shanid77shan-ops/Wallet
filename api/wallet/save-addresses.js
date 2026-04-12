import { connectDB } from '../_lib/db.js'
import { decodeToken } from '../auth/_shared.js'
import Wallet from '../_models/Wallet.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    await connectDB()
    const token   = req.headers.authorization?.replace('Bearer ', '')
    const payload = decodeToken(token)
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' })

    const { ethAddress, tronAddress } = req.body || {}
    await Wallet.findOneAndUpdate(
      { userId: payload.userId },
      { userId: payload.userId, ethAddress, tronAddress, updatedAt: new Date() },
      { upsert: true, new: true }
    )
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('save-addresses error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
