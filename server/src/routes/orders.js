const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/ordersController')
const { requireAuth } = require('../utils/jwt')
const { validate } = require('../middlewares/validate')
const { createOrderSchema } = require('../validations/orders')

router.use(requireAuth)
router.post('/', validate(createOrderSchema), ordersController.createOrder)

module.exports = router
