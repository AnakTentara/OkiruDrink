const jwt = require('jsonwebtoken')

const SECRET  = process.env.JWT_SECRET     || 'okiru_dev_secret'
const EXPIRES = process.env.JWT_EXPIRES_IN || '30d'

/**
 * Generate a signed JWT for a user payload.
 * @param {object} payload  - e.g. { id, email, level }
 * @returns {string} signed token
 */
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES })
}

/**
 * Express middleware – requires a valid Bearer token.
 * Attaches decoded payload to req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Tidak terautentikasi.' })
  }
  try {
    req.user = jwt.verify(header.slice(7), SECRET)
    next()
  } catch {
    return res.status(401).json({ ok: false, error: 'Token tidak valid atau kadaluarsa.' })
  }
}

module.exports = { signToken, requireAuth }
