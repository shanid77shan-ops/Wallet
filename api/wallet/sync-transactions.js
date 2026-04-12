import { decodeToken } from '../auth/_shared.js'
import Transaction from '../models/Transaction.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const token   = req.headers.authorization?.replace('Bearer ', '')
    const payload = decodeToken(token)
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' })

    const { transactions } = req.body || {}
    if (!Array.isArray(transactions)) return res.status(400).json({ error: 'transactions must be an array' })

    const ops = transactions.map(tx => ({
      updateOne: {
        filter: { userId: payload.userId, txId: tx.txID ?? tx.txId },
        update: {
          $setOnInsert: {
            userId:      payload.userId,
            txId:        tx.txID ?? tx.txId,
            type:        tx.type,
            symbol:      tx.symbol,
            network:     tx.network,
            amount:      tx.amount,
            fromAddress: tx.from ?? tx.fromAddress,
            toAddress:   tx.to   ?? tx.toAddress,
            timestamp:   tx.timestamp ? new Date(tx.timestamp) : new Date(),
          },
        },
        upsert: true,
      },
    }))

    if (ops.length > 0) await Transaction.bulkWrite(ops, { ordered: false })
    return res.status(200).json({ success: true, synced: ops.length })
  } catch (err) {
    console.error('sync-transactions error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
