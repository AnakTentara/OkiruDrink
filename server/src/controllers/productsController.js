const { pool } = require('../db')

exports.getAllProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 50
  const offset = (page - 1) * limit

  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE is_available = 1 ORDER BY category, name LIMIT ? OFFSET ?',
      [limit, offset]
    )
    return res.json({ ok: true, products: rows, page, limit })
  } catch (err) {
    next(err)
  }
}

exports.getProductById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Produk tidak ditemukan.' })
    return res.json({ ok: true, product: rows[0] })
  } catch (err) {
    next(err)
  }
}
