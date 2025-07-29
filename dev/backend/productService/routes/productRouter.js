const Router = require('express');
const getAllProducts = require('../controllers/getAllProductsController');
const createProduct = require('../controllers/createProductController');
const deleteProduct = require('../controllers/deleteProductController');
const getOneProduct = require('../controllers/getOneProductController');
const recommendsProducts = require('../controllers/recommendsProductController');
const updateProduct = require('../controllers/updateProductController');

const checkRole = require('../middleware/checkRoleMiddleware');

const router = new Router();

router.get('/all', getAllProducts);
router.post('/create', checkRole("ADMIN"), createProduct);
router.get('/get:id', getOneProduct)
router.delete('/delete', checkRole("ADMIN"), deleteProduct);
router.get('/recommends', recommendsProducts);
router.put('/update', checkRole("ADMIN"), updateProduct);

module.exports = router;