import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  userId:       { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, default: null },
  passwordSalt: { type: String, default: null },
  otpCode:      { type: String, default: null },
  otpExpires:   { type: Date,   default: null },
  resetToken:   { type: String, default: null },
  resetExpires: { type: Date,   default: null },
  createdAt:    { type: Date,   default: Date.now },
})

export default mongoose.models.User ?? mongoose.model('User', userSchema)
