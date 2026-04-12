import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
  userId:      { type: String, required: true, unique: true },
  ethAddress:  { type: String, default: null },
  tronAddress: { type: String, default: null },
  updatedAt:   { type: Date,   default: Date.now },
})

export default mongoose.models.Wallet ?? mongoose.model('Wallet', walletSchema)
