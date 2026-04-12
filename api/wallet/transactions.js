import { decodeToken } from '../auth/_shared.js'
import Transaction from '../models/Transaction.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const token   = req.headers.authorization?.replace('Bearer ', '')
    const payload = decodeToken(token)
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' })

    const limit = Math.min(parseInt(req.query?.limit ?? '100', 10), 500)
    const txs   = await Transaction.find({ userId: payload.userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()

    const normalized = txs.map(tx => ({
      txID:      tx.txId,
      type:      tx.type,
      symbol:    tx.symbol,
      network:   tx.network,
      amount:    tx.amount,
      from:      tx.fromAddress,
      to:        tx.toAddress,
      timestamp: tx.timestamp?.getTime?.() ?? tx.timestamp,
    }))

    return res.status(200).json({ success: true, transactions: normalized })
  } catch (err) {
    console.error('transactions error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
