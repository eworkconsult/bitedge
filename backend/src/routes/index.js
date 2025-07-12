const express = require('express');
const router = express.Router();

// Import individual resource routers
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const forumRoutes = require('./forumRoutes');
const topicRoutes = require('./topicRoutes');
// const postRoutes = require('./postRoutes'); // Posts are handled within topicRoutes for now

// Mount resource routers
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/forums', forumRoutes);
router.use('/topics', topicRoutes);   // Handles /topics/:topicSlug and /topics/:topicSlug/posts
// router.use('/posts', postRoutes);     // Not needed as a top-level route if always nested

router.get('/', (req, res) => {
    res.json({ message: 'Bitedge API main route. See /api/auth for authentication.' });
});

// Remove the placeholder now that actual auth routes are mounted
// router.use('/auth', (req, res, next) => {
//     // Placeholder for auth routes like /auth/register, /auth/login
//     // These will be implemented in a dedicated authRoutes.js or userRoutes.js
//     res.status(501).json({ message: 'Auth routes not yet implemented.'});
// });


module.exports = router;
