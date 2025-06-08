const express = require('express');
const router = express.Router();
const productRouter = require("./productRouter")

router.use('/products', productRouter); // Usa o roteador de usuários para a rota /users

module.exports = router;
