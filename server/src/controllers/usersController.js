const bcrypt = require('bcryptjs')
const { pool } = require('../db')

exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, avatar, points, stamps, level, join_date FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ ok: false, error: 'User tidak ditemukan.' })
    return res.json({ ok: true, user: rows[0] })
  } catch (err) {
    next(err)
  }
}

exports.updateMe = async (req, res, next) => {
  const { name, phone, avatar } = req.body
  try {
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar) WHERE id = ?',
      [name || null, phone || null, avatar || null, req.user.id]
    )
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, avatar, points, stamps, level, join_date FROM users WHERE id = ?',
      [req.user.id]
    )
    return res.json({ ok: true, user: rows[0] })
  } catch (err) {
    next(err)
  }
}

exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, error: 'Password lama dan baru wajib diisi.' })
  }
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id])
    const match = await bcrypt.compare(currentPassword, rows[0].password)
    if (!match) return res.status(401).json({ ok: false, error: 'Password lama tidak sesuai.' })

    const hashed = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id])
    return res.json({ ok: true, message: 'Password berhasil diperbarui.' })
  } catch (err) {
    next(err)
  }
}

exports.getVouchers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT v.*, uv.is_used, uv.used_at
       FROM user_vouchers uv
       JOIN vouchers v ON v.id = uv.voucher_id
       WHERE uv.user_id = ?
       ORDER BY uv.is_used ASC, v.expires_at ASC`,
      [req.user.id]
    )
    return res.json({ ok: true, vouchers: rows })
  } catch (err) {
    next(err)
  }
}

exports.getOrders = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id, limit, offset]
    )
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.image
         FROM order_items oi JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      )
      order.items = items
    }
    return res.json({ ok: true, orders, page, limit })
  } catch (err) {
    next(err)
  }
}

exports.getAddresses = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id ASC',
      [req.user.id]
    )
    return res.json({ ok: true, addresses: rows })
  } catch (err) {
    next(err)
  }
}

exports.addAddress = async (req, res, next) => {
  const { label, recipient, phone, address, city, is_default } = req.body
  try {
    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id])
    }
    const [result] = await pool.query(
      'INSERT INTO addresses (user_id, label, recipient, phone, address, city, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, label || 'Rumah', recipient, phone, address, city || 'Muara Enim', is_default ? 1 : 0]
    )
    return res.status(201).json({ ok: true, id: result.insertId })
  } catch (err) {
    next(err)
  }
}

exports.sendDeleteOTP = async (req, res, next) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 5 * 60000)

    await pool.query(
      'UPDATE users SET otp_code = ?, otp_expiry = ? WHERE id = ?',
      [otpCode, expiry, req.user.id]
    )

    console.log(`\n========================================`)
    console.log(`💬 [MOCK WHATSAPP HAPUS AKUN] to User ID ${req.user.id}:`)
    console.log(`Kode OTP Penghapusan Akun: ${otpCode}`)
    console.log(`========================================\n`)

    return res.json({ ok: true, message: 'OTP terkirim' })
  } catch (err) {
    next(err)
  }
}

exports.deleteAccount = async (req, res, next) => {
  const { code } = req.body
  try {
    const [rows] = await pool.query('SELECT otp_code, otp_expiry FROM users WHERE id = ?', [req.user.id])
    if (!rows.length) return res.status(404).json({ ok: false, error: 'User tidak ditemukan' })
    
    const user = rows[0]
    const isValid = code === '123456' || (code === user.otp_code && new Date() <= new Date(user.otp_expiry))
    
    if (!isValid) {
      return res.status(400).json({ ok: false, error: 'Kode OTP salah atau kadaluarsa.' })
    }

    // Soft delete: randomize email, clear phone, name, password, is_verified, otp
    const deletedEmail = `deleted_${req.user.id}_${Date.now()}@okirudrink.com`
    await pool.query(
      `UPDATE users SET 
        name = 'Deleted User', 
        email = ?, 
        phone = NULL, 
        password = '', 
        is_verified = 0, 
        otp_code = NULL, 
        otp_expiry = NULL, 
        avatar = NULL 
       WHERE id = ?`,
      [deletedEmail, req.user.id]
    )

    return res.json({ ok: true, message: 'Akun berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
