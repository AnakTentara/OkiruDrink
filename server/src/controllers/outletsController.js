const { pool } = require('../db')

exports.getAllOutlets = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM outlets WHERE is_active = 1 ORDER BY name'
    )
    return res.json({ ok: true, outlets: rows })
  } catch (err) {
    next(err)
  }
}
