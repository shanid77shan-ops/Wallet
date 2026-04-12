import 'dotenv/config'
import express from 'express'
import { connectDB } from './api/_lib/db.js'

const app  = express()
const PORT = 3001

app.use(express.json())

// Auth handlers
import sendOtpHandler          from './api/auth/send-otp.js'
import verifyOtpHandler        from './api/auth/verify-otp.js'
import registerPasswordHandler from './api/auth/register-password.js'
import loginPasswordHandler    from './api/auth/login-password.js'

// Wallet handlers
import saveAddressesHandler    from './api/wallet/save-addresses.js'
import syncTransactionsHandler from './api/wallet/sync-transactions.js'
import transactionsHandler     from './api/wallet/transactions.js'
import saveBalancesHandler     from './api/wallet/save-balances.js'

// Auth routes
app.post('/api/auth/send-otp',            (req, res) => sendOtpHandler(req, res))
app.post('/api/auth/verify-otp',          (req, res) => verifyOtpHandler(req, res))
app.post('/api/auth/register-password',   (req, res) => registerPasswordHandler(req, res))
app.post('/api/auth/login-password',      (req, res) => loginPasswordHandler(req, res))

// Wallet routes
app.post('/api/wallet/save-addresses',    (req, res) => saveAddressesHandler(req, res))
app.post('/api/wallet/sync-transactions', (req, res) => syncTransactionsHandler(req, res))
app.get( '/api/wallet/transactions',      (req, res) => transactionsHandler(req, res))
app.post('/api/wallet/save-balances',     (req, res) => saveBalancesHandler(req, res))

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API server running at http://localhost:${PORT}`)
      console.log(`   POST /api/auth/send-otp`)
      console.log(`   POST /api/auth/verify-otp`)
      console.log(`   POST /api/auth/register-password`)
      console.log(`   POST /api/auth/login-password`)
      console.log(`   POST /api/wallet/save-addresses`)
      console.log(`   POST /api/wallet/sync-transactions`)
      console.log(`   GET  /api/wallet/transactions`)
      console.log(`   POST /api/wallet/save-balances`)
    })
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
