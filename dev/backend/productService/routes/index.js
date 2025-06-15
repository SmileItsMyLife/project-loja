const express = require('express');
const router = express.Router();
const productRouter = require("./productRouter")
const typeRouter = require("./typeRouter");

router.use('/products', productRouter); // Usa o roteador de usuários para a rota /users
router.use('/types', typeRouter); // Usa o roteador de usuários para a rota /users

module.exports = router;
