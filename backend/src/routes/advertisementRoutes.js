const express = require('express');
const router = express.Router();
const adController = require('../controllers/advertisementController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// All routes in this file are for managing ads and are admin-only.

// POST /api/advertisements - Create a new ad
router.post('/', authenticateToken, isAdmin, adController.createAdvertisement);

// GET /api/advertisements - List all ads
router.get('/', authenticateToken, isAdmin, adController.listAdvertisements);

// GET /api/advertisements/:id - Get a single ad
router.get('/:id', authenticateToken, isAdmin, adController.getAdvertisementById);

// PUT /api/advertisements/:id - Update an ad
router.put('/:id', authenticateToken, isAdmin, adController.updateAdvertisement);

// DELETE /api/advertisements/:id - Delete an ad
router.delete('/:id', authenticateToken, isAdmin, adController.deleteAdvertisement);


module.exports = router;
