const express = require('express');
const authController = require('../controllers/authController');

const { validateRequest, signupSchema, loginSchema } = require('../middlewares/validator');

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/logout', authController.logout);

module.exports = router;
