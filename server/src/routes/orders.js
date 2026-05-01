const express         = require('express')
const { pool }        = require('../db')
const { requireAuth } = require('../utils/jwt')
const { getLevelForPoints, calcPointsEarned } = require('../utils/leveling')

const router = express.Router()
router.use(requireAuth)

// ── POST /api/orders ────────────────────────────────────────
router.post('/', async (req, res) => {
  const { items, delivery_mode, voucher_id, notes, outlet_id } = req.body
  if (!items || !items.length) {
    return res.status(400).json({ ok: false, error: 'Keranjang kosong.' })
  }

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Calculate totals
    let totalPrice = 0
    for (const item of items) {
      totalPrice += item.price * item.qty
    }

    // Apply voucher discount if provided
    let discount = 0
    if (voucher_id) {
      const [vrows] = await conn.query(
        `SELECT v.*, uv.is_used FROM vouchers v
         JOIN user_vouchers uv ON uv.voucher_id = v.id
         WHERE v.id = ? AND uv.user_id = ? AND uv.is_used = 0`,
        [voucher_id, req.user.id]
      )
      if (vrows.length) {
        const voucher = vrows[0]
        if (voucher.discount_type === 'percent') {
          discount = Math.floor(totalPrice * voucher.discount_value / 100)
        } else {
          discount = voucher.discount_value
        }
        // Mark voucher as used
        await conn.query(
          'UPDATE user_vouchers SET is_used = 1, used_at = NOW() WHERE user_id = ? AND voucher_id = ?',
          [req.user.id, voucher_id]
        )
      }
    }

    const finalPrice   = Math.max(totalPrice - discount, 0)
    const pointsEarned = calcPointsEarned(finalPrice)

    // Insert order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, outlet_id, delivery_mode, total_price, discount, final_price, points_earned, voucher_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, outlet_id || null, delivery_mode || 'pickup', totalPrice, discount, finalPrice, pointsEarned, voucher_id || null, notes || null]
    )
    const orderId = orderResult.insertId

    // Insert order items
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, qty, price, sweet_level, ice_level) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id || item.id, item.qty, item.price, item.sweetLevel || null, item.iceLevel || null]
      )
    }

    // Add points & update level
    const [userRows] = await conn.query('SELECT points, stamps FROM users WHERE id = ?', [req.user.id])
    const newPoints = (userRows[0].points || 0) + pointsEarned
    const newStamps = ((userRows[0].stamps || 0) + 1) % 4
    const newLevel  = getLevelForPoints(newPoints)

    await conn.query(
      'UPDATE users SET points = ?, stamps = ?, level = ? WHERE id = ?',
      [newPoints, newStamps, newLevel, req.user.id]
    )

    await conn.commit()

    return res.status(201).json({
      ok: true,
      order: {
        id: orderId,
        finalPrice,
        discount,
        pointsEarned,
        newLevel,
        newPoints,
      }
    })
  } catch (err) {
    await conn.rollback()
    console.error('[create-order]', err)
    return res.status(500).json({ ok: false, error: 'Kesalahan server.' })
  } finally {
    conn.release()
  }
})

module.exports = router
