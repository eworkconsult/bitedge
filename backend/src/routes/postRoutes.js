const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Note: Creating posts is handled under /api/topics/:topicSlug/posts
// This file is for actions on existing posts, identified by their own ID.

// PUT /api/posts/:postId - Update a post
router.put('/:postId', authenticateToken, postController.updatePost);
router.patch('/:postId', authenticateToken, postController.updatePost); // Also support PATCH

// DELETE /api/posts/:postId - Delete a post
router.delete('/:postId', authenticateToken, postController.deletePost);

module.exports = router;
