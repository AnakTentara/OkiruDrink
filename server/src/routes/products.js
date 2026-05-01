const express = require('express')
const { pool } = require('../db')

const router = express.Router()

// ── GET /api/products ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE is_available = 1 ORDER BY category, name'
    )
    return res.json({ ok: true, products: rows })
  } catch (err) {
    console.error('[products]', err)
    return res.status(500).json({ ok: false, error: 'Kesalahan server.' })
  }
})

// ── GET /api/products/:id ──────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Produk tidak ditemukan.' })
    return res.json({ ok: true, product: rows[0] })
  } catch (err) {
    console.error('[product-detail]', err)
    return res.status(500).json({ ok: false, error: 'Kesalahan server.' })
  }
})

module.exports = router
