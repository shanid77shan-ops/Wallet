import mongoose from 'mongoose'

const txSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  txId:        { type: String, required: true },
  type:        { type: String },
  symbol:      { type: String },
  network:     { type: String },
  amount:      { type: Number },
  fromAddress: { type: String },
  toAddress:   { type: String },
  timestamp:   { type: Date },
})

txSchema.index({ userId: 1, txId: 1 }, { unique: true })

export default mongoose.models.Transaction ?? mongoose.model('Transaction', txSchema)
