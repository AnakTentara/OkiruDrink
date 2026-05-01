const bcrypt = require('bcryptjs')
const { pool } = require('../db')
const { signToken } = require('../utils/jwt')
const { getLevelForPoints, checkYearEndDowngrade } = require('../utils/leveling')

exports.register = async (req, res, next) => {
  const { name, email, phone, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ ok: false, error: 'Nama, email, dan password wajib diisi.' })
  }

  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()])
    if (rows.length) return res.status(409).json({ ok: false, error: 'Email sudah terdaftar.' })

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password, level_expiry_year) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), phone || null, hashed, new Date().getFullYear()]
    )

    const userId = result.insertId

    // Give welcome voucher
    const [vrows] = await pool.query("SELECT id FROM vouchers WHERE code = 'OKIRU2026' LIMIT 1")
    if (vrows.length) {
      await pool.query('INSERT IGNORE INTO user_vouchers (user_id, voucher_id) VALUES (?, ?)', [userId, vrows[0].id])
    }

    const token = signToken({ id: userId, email: email.toLowerCase(), level: 'Basic' })
    return res.status(201).json({ ok: true, token, userId })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Email dan password wajib diisi.' })

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
    if (!rows.length) return res.status(401).json({ ok: false, error: 'Email atau password salah.' })

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ ok: false, error: 'Email atau password salah.' })

    // Year-end downgrade check
    const currentYear = new Date().getFullYear()
    const { newLevel, downgraded } = checkYearEndDowngrade(user, currentYear)
    if (downgraded) {
      await pool.query(
        'UPDATE users SET level = ?, level_expiry_year = ? WHERE id = ?',
        [newLevel, currentYear, user.id]
      )
      user.level = newLevel
    }

    // Recalculate level from points (in case points grew)
    const computedLevel = getLevelForPoints(user.points)
    if (computedLevel !== user.level) {
      await pool.query('UPDATE users SET level = ?, level_expiry_year = ? WHERE id = ?', [computedLevel, currentYear, user.id])
      user.level = computedLevel
    }

    const { password: _pw, ...safeUser } = user
    const token = signToken({ id: user.id, email: user.email, level: user.level })
    return res.json({ ok: true, token, user: safeUser })
  } catch (err) {
    next(err)
  }
}
