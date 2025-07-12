const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// === ADMIN ROUTES ===
router.get('/', authenticateToken, isAdmin, userController.listUsers);
router.patch('/:userId/toggle-active', authenticateToken, isAdmin, userController.toggleUserActive);

// === PUBLIC & USER ROUTES ===

// GET /api/users/:username - Get a user's public profile
router.get('/:username', userController.getUserProfile);

// PUT /api/users/me/profile - Update the logged-in user's profile
router.put('/me/profile', authenticateToken, userController.updateUserProfile);

module.exports = router;
