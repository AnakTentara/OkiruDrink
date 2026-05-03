const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { requireAuth } = require('../utils/jwt')

router.use(requireAuth)

router.get('/me', usersController.getMe)
router.patch('/me', usersController.updateMe)
router.patch('/me/password', usersController.updatePassword)

router.get('/me/vouchers', usersController.getVouchers)
router.get('/me/orders', usersController.getOrders)
router.get('/me/addresses', usersController.getAddresses)
router.post('/me/addresses', usersController.addAddress)

router.post('/me/delete-otp', usersController.sendDeleteOTP)
router.delete('/me', usersController.deleteAccount)

module.exports = router
