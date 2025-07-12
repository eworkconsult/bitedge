const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const topicController = require('../controllers/topicController'); // For creating topics within a forum
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// GET /api/forums/:forumSlug - Get a specific forum by slug, including its topics
router.get('/:forumSlug', forumController.getForumBySlug);

// POST /api/forums - Create a new forum (admin)
router.post('/', authenticateToken, isAdmin, forumController.createForum);

// POST /api/forums/:forumSlug/topics - Create a new topic in a specific forum
router.post('/:forumSlug/topics', authenticateToken, topicController.createTopicInForum);


// The plan also mentioned: List Topics within a Forum (GET /api/forums/<forum_slug>/topics/)
// This is effectively covered by GET /api/forums/:forumSlug which includes topics.
// If a dedicated route is desired for just topics of a forum (e.g. for cleaner API or specific topic pagination):
// router.get('/:forumSlug/topics', topicController.listTopicsInForum); // Would need a listTopicsInForum controller method

module.exports = router;
