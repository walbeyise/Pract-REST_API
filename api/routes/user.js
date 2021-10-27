const express = require('express');
const router = express.Router();
const Auth = require('../auth/auth');
const Password = require('../controllers/password');
const Usercontroller = require('../controllers/user');

router.post('/signup-user', Usercontroller.user_signup);

router.post('/signup-admin', Usercontroller.admin_signup)

router.post('/login-user', Usercontroller.user_login);

router.post('/login-admin', Usercontroller.admin_login);

router.post('/recover', Password.recover);

router.get('/reset/:token', Password.reset);
router.post('/reset/:token', Password.resetPassword)

router.delete('/:userId', Auth, Usercontroller.user_delete);

module.exports = router;