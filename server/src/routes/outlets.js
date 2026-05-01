const express = require('express')
const { pool } = require('../db')

const router = express.Router()

// ── GET /api/outlets ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM outlets WHERE is_active = 1 ORDER BY name'
    )
    return res.json({ ok: true, outlets: rows })
  } catch (err) {
    console.error('[outlets]', err)
    return res.status(500).json({ ok: false, error: 'Kesalahan server.' })
  }
})

module.exports = router
