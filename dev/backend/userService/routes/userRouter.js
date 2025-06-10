const Router = require('express'); // Importa o módulo Express
const router = new Router(); // Cria uma nova instância do Router do Express

const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação
const registerUser = require('../controllers/registerUserController');
const loginUser = require('../controllers/loginUserController');
const checkUser = require('../controllers/checkUserController');
const verifyEmail = require('../controllers/verifyEmailUserController');
const resendEmail = require('../controllers/resendEmailUserController');
const resetPassword = require('../controllers/resetPasswordUserController');
const askResetPassword = require('../controllers/askResetPasswordUserController');
const createBasket = require('../controllers/createBasketUserController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', verifyEmail);
router.get('/ask-reset-password', askResetPassword);
router.put('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/check', authMiddleware, checkUser);
router.get('/resend', authMiddleware, resendEmail);
router.get('/create-basket', authMiddleware, createBasket);

module.exports = router;