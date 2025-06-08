const Router = require('express'); // Importa o módulo Express
const router = new Router(); // Cria uma nova instância do Router do Express

const productRouter = require('./productRouter'); // Importa o roteador de produtos
const typeRouter = require('./typeRouter'); // Importa o roteador de tipos
const ratingRouter = require('./ratingRouter'); // Importa o roteador de avaliações
const basketProductRouter = require('./basketProductRouter'); // Importa o roteador de produtos na cesta
const purchaseRouter = require("./purchaseRouter"); // Importa o roteador de compras
const paymentRouter = require("./paymentRouter")

// Define o uso dos diferentes roteadores para diferentes rotasrouter.use('/types', typeRouter); // Usa o roteador de tipos para a rota /types
router.use('/products', productRouter); // Usa o roteador de produtos para a rota /products
router.use('/rating', ratingRouter); // Usa o roteador de avaliações para a rota /rating
router.use('/basket-products', basketProductRouter); // Usa o roteador de produtos na cesta para a rota /basket-products
router.use('/purchases', purchaseRouter); // Usa o roteador de compras para a rota /purchases
router.use('/payment', paymentRouter);
router.use('/types', typeRouter); // Usa o roteador de tipos para a rota /types
module.exports = router; // Exporta o roteador para uso em outros módulos