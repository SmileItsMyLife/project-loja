const Router = require('express'); // Importa o módulo Express
const router = new Router(); // Cria uma nova instância do Router do Express

const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação
const registration = require('../controllers/registration');
const login = require('../controllers/login');
const check = require('../controllers/check');
const verifyEmail = require('../controllers/verifyEmail');
const resendEmail = require('../controllers/resendEmail');
const resetPassword = require('../controllers/resetPassword');
const askResetPassword = require('../controllers/askResetPassword');
const createBasket = require('../controllers/createBasket');


router.post('/register', registration);
router.post('/login', login);
router.get('/check', authMiddleware, check);
router.get('/verify', verifyEmail);
router.get('/resend', authMiddleware, resendEmail) // Rota para verificação de usuários, chamando o método de verificação do controlador de usuários
router.get('/ask-reset-password', askResetPassword); // Rota para solicitar redefinição de senha, chamando o método de solicitação de redefinição de senha do controlador de usuários
router.put('/reset-password', resetPassword); // Rota para redefinir senha, chamando o método de redefinição de senha do controlador de usuários
router.get('create-basket', createBasket);

module.exports = router;