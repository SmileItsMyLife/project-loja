const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/verificate', userController.verificate)
router.get('/ask-reset-password', userController.askResetPassword)
router.put('/reset-password', userController.resetPassword)

module.exports = router
