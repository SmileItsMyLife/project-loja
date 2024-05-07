const Router = require('express')
const router = new Router()
const basketProductController = require('../controllers/basketProductController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, basketProductController.add)
router.get('/', authMiddleware, basketProductController.getAll)
router.delete('/', authMiddleware, basketProductController.remove)
router.delete('/all', authMiddleware, basketProductController.cleanAll)

module.exports = router