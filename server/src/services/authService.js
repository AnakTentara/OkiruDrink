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
  
  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  // Expiry in 5 minutes
  const expiry = new Date(Date.now() + 5 * 60000)

  const [result] = await pool.query(
    'INSERT INTO users (name, email, phone, password, level_expiry_year, is_verified, otp_code, otp_expiry) VALUES (?, ?, ?, ?, ?, 0, ?, ?)',
    [name, email.toLowerCase(), phone || null, hashed, new Date().getFullYear(), otpCode, expiry]
  )

  const userId = result.insertId

  // Give welcome voucher
  const [vrows] = await pool.query("SELECT id FROM vouchers WHERE code = 'OKIRU2026' LIMIT 1")
  if (vrows.length) {
    await pool.query('INSERT IGNORE INTO user_vouchers (user_id, voucher_id) VALUES (?, ?)', [userId, vrows[0].id])
  }

  // MOCK: Print OTP to console instead of WhatsApp
  console.log(`\n========================================`)
  console.log(`💬 [MOCK WHATSAPP] to ${phone || email}:`)
  console.log(`Kode OTP OkiruDrink kamu adalah: ${otpCode}`)
  console.log(`========================================\n`)

  // Return ok without token
  return { message: 'OTP terkirim' }
}

exports.verifyOTP = async (data) => {
  const { phone, email, code } = data
  
  if (!phone && !email) {
    const err = new Error('Data pengguna tidak lengkap. Harap ulangi pendaftaran/login.')
    err.status = 400; throw err
  }

  const queryField = phone ? 'phone' : 'email'
  const queryValue = phone ? phone : email.toLowerCase()

  const [rows] = await pool.query(`SELECT * FROM users WHERE ${queryField} = ? ORDER BY id DESC LIMIT 1`, [queryValue])
  if (!rows.length) {
    const err = new Error('Pengguna tidak ditemukan.')
    err.status = 404; throw err
  }

  const user = rows[0]
  if (user.is_verified) {
    const err = new Error('Akun sudah terverifikasi.')
    err.status = 400; throw err
  }

  // Backdoor "123456" OR actual match
  const isValid = code === '123456' || (code === user.otp_code && new Date() <= new Date(user.otp_expiry))
  
  if (!isValid) {
    const err = new Error('Kode OTP salah atau kadaluarsa.')
    err.status = 400; throw err
  }

  // Update verified
  await pool.query('UPDATE users SET is_verified = 1, otp_code = NULL, otp_expiry = NULL WHERE id = ?', [user.id])

  const token = signToken({ id: user.id, email: user.email, level: user.level || 'Basic' })
  return { token, user: { id: user.id, name: user.name, email: user.email, level: user.level || 'Basic', points: user.points } }
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
  if (user.is_verified === 0) {
    const err = new Error('Akun belum diverifikasi. Silakan verifikasi OTP terlebih dahulu.')
    err.status = 403
    throw err
  }

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
