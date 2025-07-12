const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const postController = require('../controllers/postController'); // For creating posts within a topic
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// GET /api/topics/:topicSlug - Get a specific topic by slug, including its posts
router.get('/:topicSlug', topicController.getTopicBySlug);

// POST /api/topics/:topicSlug/posts - Create a new post in a specific topic
router.post('/:topicSlug/posts', authenticateToken, postController.createPostInTopic);


// Routes for updating/deleting topics, locking, pinning would go here
router.put('/:topicSlug', authenticateToken, topicController.updateTopic);
router.patch('/:topicSlug', authenticateToken, topicController.updateTopic);
router.delete('/:topicSlug', authenticateToken, topicController.deleteTopic);

// Admin-only routes
router.patch('/:topicSlug/pin', authenticateToken, isAdmin, topicController.togglePin);
router.patch('/:topicSlug/lock', authenticateToken, isAdmin, topicController.toggleLock);


module.exports = router;
