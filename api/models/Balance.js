import mongoose from 'mongoose'

const balanceSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  tokenId:   { type: String, required: true },
  balance:   { type: Number, default: 0 },
  updatedAt: { type: Date,   default: Date.now },
})

balanceSchema.index({ userId: 1, tokenId: 1 }, { unique: true })

export default mongoose.models.Balance ?? mongoose.model('Balance', balanceSchema)
