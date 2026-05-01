const express = require('express')
const router = express.Router()
const vouchersController = require('../controllers/vouchersController')

router.get('/available', vouchersController.getAvailableVouchers)
router.get('/levels', vouchersController.getLevels)

module.exports = router
