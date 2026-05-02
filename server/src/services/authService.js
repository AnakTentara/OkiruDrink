const bcrypt = require('bcryptjs')
const { pool } = require('../db')
const { signToken } = require('../utils/jwt')
const { getLevelForPoints, checkYearEndDowngrade } = require('../utils/leveling')

exports.registerUser = async (data) => {
  const { name, email, phone, password } = data
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()])
  if (rows.length) {
    const err = new Error('Email sudah terdaftar.')
    err.status = 409
    throw err
  }

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
  return { token, userId }
}

exports.loginUser = async (data) => {
  const { email, password } = data
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
  if (!rows.length) {
    const err = new Error('Email atau password salah.')
    err.status = 401
    throw err
  }

  const user = rows[0]
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    const err = new Error('Email atau password salah.')
    err.status = 401
    throw err
  }

  const currentYear = new Date().getFullYear()
  const { newLevel, downgraded } = checkYearEndDowngrade(user, currentYear)
  if (downgraded) {
    await pool.query(
      'UPDATE users SET level = ?, level_expiry_year = ? WHERE id = ?',
      [newLevel, currentYear, user.id]
    )
    user.level = newLevel
  }

  const computedLevel = getLevelForPoints(user.points)
  if (computedLevel !== user.level) {
    await pool.query('UPDATE users SET level = ?, level_expiry_year = ? WHERE id = ?', [computedLevel, currentYear, user.id])
    user.level = computedLevel
  }

  const { password: _pw, ...safeUser } = user
  const token = signToken({ id: user.id, email: user.email, level: user.level })
  return { token, user: safeUser }
}
