require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const { testConnection } = require('./db')

const app = express()
const PORT = process.env.PORT || 2027

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), version: '1.0.0' })
})

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/users',    require('./routes/users'))
app.use('/api/orders',   require('./routes/orders'))
app.use('/api/products', require('./routes/products'))
app.use('/api/outlets',  require('./routes/outlets'))
app.use('/api/vouchers', require('./routes/vouchers'))

// ── 404 fallback ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, error: `Route ${req.method} ${req.path} not found` })
})

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err)
  res.status(500).json({ ok: false, error: 'Internal server error' })
})

// ── Start ───────────────────────────────────────────────────
async function start() {
  await testConnection()
  app.listen(PORT, () => {
    console.log(`🌿 OkiruDrink API running on http://localhost:${PORT}`)
    console.log(`   Routes: /api/auth, /api/users, /api/orders, /api/products, /api/outlets, /api/vouchers`)
  })
}

start()
