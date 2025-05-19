const Router = require('express')
const router = new Router()
const purchaseController= require('../controllers/purchaseController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, purchaseController.add)
router.post('/user', authMiddleware, purchaseController.getUser)

module.exports = router