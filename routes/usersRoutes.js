const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const securityCtrl = require('../controllers/securityController');
const userCtrl = require('../controllers/userController');

router.post('/register', securityCtrl.register);

router.post('/login', securityCtrl.login);

router.get('/users', auth, userCtrl.getAllUsers);

router.get('/users/:id', auth, userCtrl.getOneUser);

router.put('/users/:id', auth, userCtrl.updateUser);

router.delete('/users/:id', auth, userCtrl.deleteUser);

module.exports = router;