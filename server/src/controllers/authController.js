const authService = require('../services/authService')

exports.register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body)
    return res.status(201).json({ ok: true, ...result })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ ok: false, error: err.message })
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body)
    return res.json({ ok: true, ...result })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ ok: false, error: err.message })
    next(err)
  }
}

