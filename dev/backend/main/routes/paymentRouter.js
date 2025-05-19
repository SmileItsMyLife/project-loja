const Router = require('express')
const router = new Router()
const paymentController = require('../controllers/paymentController')

router.post('/', paymentController.pay)

module.exports = router