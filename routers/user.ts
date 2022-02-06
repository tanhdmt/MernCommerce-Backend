export{};
const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/userRole', userController.getRole);
router.put('/:id', userController.update);
router.patch('/restore', userController.restore);
router.delete('/force', userController.forceDestroy);
router.delete('/', userController.destroy);
router.get('/trash', userController.trash);
router.get('/:id/edit', userController.edit);
router.get('/', userController.show);
// router.post('/handle-form-actions', userController.handleFormAction);
// router.get('/:slug', userController.showBySlug);

module.exports = router;