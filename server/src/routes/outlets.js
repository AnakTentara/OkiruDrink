const express = require('express')
const router = express.Router()
const outletsController = require('../controllers/outletsController')

router.get('/', outletsController.getAllOutlets)

module.exports = router
