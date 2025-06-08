const Router = require('express'); // Importa o módulo Express
const router = new Router(); // Cria uma nova instância do Router do Express

router.post('/', (req, res) => {
    // Lógica para criar um novo produto
    res.status(201).json({ message: 'Produto criado com sucesso' });
});

module.exports = router;