import express from 'express'

const app = express()
const PORT = 3001

// Middleware
app.use(express.json())

// Import API handlers
import sendOtpHandler from './api/auth/send-otp.js'
import verifyOtpHandler from './api/auth/verify-otp.js'

// Routes
app.post('/api/auth/send-otp', (req, res) => sendOtpHandler(req, res))
app.post('/api/auth/verify-otp', (req, res) => verifyOtpHandler(req, res))

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅ API server running at http://localhost:${PORT}`)
  console.log(`📧 POST /api/auth/send-otp`)
  console.log(`✔️  POST /api/auth/verify-otp`)
})
