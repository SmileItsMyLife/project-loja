const express = require('express');
const router = express.Router();
const userRouter = require("./userRouter")

router.use('/users', userRouter); // Usa o roteador de usuários para a rota /users

module.exports = router;
