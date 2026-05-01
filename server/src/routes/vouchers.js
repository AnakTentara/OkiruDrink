const express         = require('express')
const { pool }        = require('../db')
const { requireAuth } = require('../utils/jwt')
const { LEVEL_THRESHOLDS } = require('../utils/leveling')

const router = express.Router()

// ── GET /api/vouchers/available ─────────────────────────────
// Public: get all active vouchers (for display)
router.get('/available', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, code, title, description, terms, discount_type, discount_value,
              min_purchase, level_required, expires_at
       FROM vouchers
       WHERE is_active = 1 AND (expires_at IS NULL OR expires_at >= CURDATE())
       ORDER BY discount_value DESC`
    )
    return res.json({ ok: true, vouchers: rows })
  } catch (err) {
    console.error('[available-vouchers]', err)
    return res.status(500).json({ ok: false, error: 'Kesalahan server.' })
  }
})

// ── GET /api/vouchers/levels ────────────────────────────────
// Public: get level thresholds info
router.get('/levels', (req, res) => {
  const benefits = {
    Basic: {
      label: 'Okiru Member',
      minPoints: 0,
      color: '#8B8B8B',
      perks: [
        'Akses menu standar',
        'Poin setiap pembelian (1pt / Rp 1.000)',
        'Voucher selamat datang',
      ]
    },
    Silver: {
      label: 'Silver Member',
      minPoints: 500,
      color: '#A8A8A8',
      perks: [
        'Semua keuntungan Basic',
        'Diskon 5% setiap pembelian',
        'Voucher ulang tahun eksklusif',
        'Akses early menu baru',
        'Prioritas antrian outlet',
      ]
    },
    Gold: {
      label: 'Gold Member',
      minPoints: 2000,
      color: '#D4A017',
      perks: [
        'Semua keuntungan Silver',
        'Diskon 10% setiap pembelian',
        'Gratis ongkir delivery',
        '1 minuman gratis / bulan',
        'Undangan event eksklusif',
        'Custom cup dengan nama',
      ]
    },
    Diamond: {
      label: 'Diamond Member',
      minPoints: 5000,
      color: '#00BCD4',
      perks: [
        'Semua keuntungan Gold',
        'Diskon 15% setiap pembelian',
        '2 minuman gratis / bulan',
        'Akses menu rahasia / seasonal',
        'Gift box bulanan OkiruDrink',
        'Prioritas customer support',
        'Merchandise eksklusif tahunan',
      ]
    }
  }
  return res.json({ ok: true, levels: benefits, thresholds: LEVEL_THRESHOLDS })
})

module.exports = router
