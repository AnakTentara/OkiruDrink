const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/ordersController')
const { requireAuth } = require('../utils/jwt')

router.use(requireAuth)
router.post('/', ordersController.createOrder)

module.exports = router
