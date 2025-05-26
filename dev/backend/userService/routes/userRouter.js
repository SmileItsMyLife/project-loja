const Router = require('express'); // Importa o módulo Express
const router = new Router(); // Cria uma nova instância do Router do Express

const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação
const registration = require('../controllers/registration');
const login = require('../controllers/login');
const check = require('../controllers/check');
const verifyEmail = require('../controllers/verifyEmail');


router.post('/register', registration);
router.post('/login', login);
router.get('/check', authMiddleware, check);
router.get('/verify', verifyEmail); // Rota para verificação de usuários, chamando o método de verificação do controlador de usuários
//router.get('/ask-reset-password', userController.askResetPassword); // Rota para solicitar redefinição de senha, chamando o método de solicitação de redefinição de senha do controlador de usuários
//router.put('/reset-password', userController.resetPassword); // Rota para redefinir senha, chamando o método de redefinição de senha do controlador de usuários

module.exports = router;