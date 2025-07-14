const express = require('express');
const router = express.Router();

// Import individual resource routers
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const forumRoutes = require('./forumRoutes');
const topicRoutes = require('./topicRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');
const searchRoutes = require('./searchRoutes');
const advertisementRoutes = require('./advertisementRoutes');
const adServingRoutes = require('./adServingRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount resource routers
router.use('/auth', authRoutes);
router.use('/search', searchRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/forums', forumRoutes);
router.use('/topics', topicRoutes);   // Handles reading topics and creating posts within topics
router.use('/posts', postRoutes);     // Handles actions on existing posts (edit, delete)
router.use('/advertisements', advertisementRoutes); // Admin routes for managing ads
router.use('/ads', adServingRoutes); // Public route for serving ads

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
