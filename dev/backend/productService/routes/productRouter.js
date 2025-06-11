const Router = require('express'); // Importa o módulo Express
const getAllProducts = require('../controllers/getAllProductsController');
const router = new Router(); // Cria uma nova instância do Router do Express

router.get('/all', getAllProducts);
module.exports = router;