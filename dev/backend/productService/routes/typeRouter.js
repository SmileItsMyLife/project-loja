const Router = require('express');
const router = new Router();
const TypeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.delete('/delete', checkRole("ADMIN"), TypeController.delete);
router.post('/create', checkRole("ADMIN"), TypeController.create);
router.get('/get', TypeController.getAll);

module.exports = router;