const orderService = require('../services/orderService')

exports.createOrder = async (req, res, next) => {
  try {
    const orderDetails = await orderService.processOrder(req.user.id, req.body)
    return res.status(201).json({
      ok: true,
      order: orderDetails
    })
  } catch (err) {
    next(err)
  }
}
