const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const ratingRouter = require('./ratingRouter')
const basketProductRouter = require('./basketProductRouter')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.use('/users', userRouter)
router.use('/types', typeRouter)
router.use('/products', productRouter)
router.use('/rating', ratingRouter)
router.use('/basket-products', basketProductRouter)

module.exports = router 