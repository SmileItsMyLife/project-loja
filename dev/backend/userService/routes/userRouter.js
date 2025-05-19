const Router = require('express'); // Importa o módulo Express
const router = new Router(); // Cria uma nova instância do Router do Express

const userController = require('../controllers/userController'); // Importa o controlador de usuários
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação
const registration = require('../controllers/registration');

router.post('/registration', registration); // Rota para registro de usuários, chamando o método de registro do controlador de usuários
router.post('/login', userController.login); // Rota para login de usuários, chamando o método de login do controlador de usuários
router.get('/auth', authMiddleware, userController.check); // Rota para verificação de autenticação, usando o middleware de autenticação e chamando o método de verificação do controlador de usuários
router.get('/verificate', userController.verificate); // Rota para verificação de usuários, chamando o método de verificação do controlador de usuários
router.get('/ask-reset-password', userController.askResetPassword); // Rota para solicitar redefinição de senha, chamando o método de solicitação de redefinição de senha do controlador de usuários
router.put('/reset-password', userController.resetPassword); // Rota para redefinir senha, chamando o método de redefinição de senha do controlador de usuários

module.exports = router;