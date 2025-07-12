const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// GET /api/users/:username - Get a user's public profile
router.get('/:username', userController.getUserProfile);

// PUT /api/users/me/profile - Update the logged-in user's profile
router.put('/me/profile', authenticateToken, userController.updateUserProfile);

module.exports = router;
