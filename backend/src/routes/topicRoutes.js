const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const postController = require('../controllers/postController'); // For creating posts within a topic
const { authenticateToken } = require('../middlewares/authMiddleware');

// GET /api/topics/:topicSlug - Get a specific topic by slug, including its posts
router.get('/:topicSlug', topicController.getTopicBySlug);

// POST /api/topics/:topicSlug/posts - Create a new post in a specific topic
router.post('/:topicSlug/posts', authenticateToken, postController.createPostInTopic);


// Routes for updating/deleting topics, locking, pinning would go here
// Example:
// router.put('/:topicSlug', authenticateToken, topicController.updateTopic);
// router.delete('/:topicSlug', authenticateToken, topicController.deleteTopic);
// router.patch('/:topicSlug/lock', authenticateToken, /* isAdminOrModerator, */ topicController.lockTopic);
// router.patch('/:topicSlug/pin', authenticateToken, /* isAdminOrModerator, */ topicController.pinTopic);


module.exports = router;
