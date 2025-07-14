const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// All routes in this file are protected

// GET /api/notifications - Get all notifications for the logged-in user
router.get('/', authenticateToken, notificationController.listNotifications);

// GET /api/notifications/unread-count - Get the count of unread notifications
router.get('/unread-count', authenticateToken, notificationController.getUnreadCount);

// POST /api/notifications/mark-all-read - Mark all notifications as read
router.post('/mark-all-read', authenticateToken, notificationController.markAllAsRead);

// PATCH /api/notifications/:id/read - Mark a single notification as read
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);


module.exports = router;
