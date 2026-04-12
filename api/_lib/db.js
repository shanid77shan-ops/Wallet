import mongoose from 'mongoose'
import dns from 'dns'

// Force IPv4 DNS — fixes querySrv ECONNREFUSED on Windows
dns.setDefaultResultOrder('ipv4first')

let connected = false

export async function connectDB() {
  if (connected) return
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in .env')
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  })
  connected = true
  console.log('✅ MongoDB connected')
}
