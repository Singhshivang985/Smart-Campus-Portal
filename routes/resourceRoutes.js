const express = require('express');
const resourceController = require('../controllers/resourceController');
const authController = require('../middlewares/auth');
const uploadMiddleware = require('../middlewares/upload');
const { validateRequest, resourceSchema } = require('../middlewares/validator');

const router = express.Router();

router.get('/analytics', authController.protect, authController.restrictTo('Admin'), resourceController.getAnalytics);

router
  .route('/')
  .get(resourceController.getAllResources)
  .post(
    authController.protect,
    uploadMiddleware.uploadResourceFile,
    validateRequest(resourceSchema),
    resourceController.createResource
  );

router
  .route('/:id')
  .get(resourceController.getResource);

router.post('/:id/bookmark', authController.protect, resourceController.toggleBookmark);
router.post('/:id/download', resourceController.incrementDownload);

// Admin / Faculty Routes
router.patch(
  '/:id/status',
  authController.protect,
  authController.restrictTo('Admin', 'Faculty'),
  resourceController.updateResourceStatus
);

module.exports = router;
