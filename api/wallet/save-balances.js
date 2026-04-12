import { connectDB } from '../_lib/db.js'
import { decodeToken } from '../auth/_shared.js'
import Balance from '../_models/Balance.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    await connectDB()
    const token   = req.headers.authorization?.replace('Bearer ', '')
    const payload = decodeToken(token)
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' })

    const { balances } = req.body || {}
    if (!Array.isArray(balances)) return res.status(400).json({ error: 'balances must be an array' })

    const ops = balances.map(b => ({
      updateOne: {
        filter: { userId: payload.userId, tokenId: b.tokenId },
        update: { $set: { balance: b.balance, updatedAt: new Date() } },
        upsert: true,
      },
    }))

    if (ops.length > 0) await Balance.bulkWrite(ops, { ordered: false })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('save-balances error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
