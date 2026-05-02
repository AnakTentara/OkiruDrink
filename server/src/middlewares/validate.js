const { z } = require('zod')

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => e.message).join(', ')
      return res.status(400).json({ ok: false, error: errorMessages })
    }
    next(err)
  }
}

module.exports = { validate }
