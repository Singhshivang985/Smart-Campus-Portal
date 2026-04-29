const express = require('express');
const viewController = require('../controllers/viewController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware.isLoggedIn);

router.get('/', viewController.getDashboard);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/resources', viewController.getResources);

// Protected routes
router.use(authMiddleware.protect);

router.get('/upload', viewController.getUploadForm);
router.get('/profile', viewController.getProfile);

// Admin only
router.get('/admin', authMiddleware.restrictTo('Admin', 'Faculty'), viewController.getAdminPanel);

module.exports = router;
