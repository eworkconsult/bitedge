const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware'); // For protected routes

// GET /api/categories - List all categories
router.get('/', categoryController.listCategories);

// GET /api/categories/:categorySlug - Get a specific category by slug with its forums
router.get('/:categorySlug', categoryController.getCategoryBySlug);

// POST /api/categories - Create a new category (admin)
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);

// PUT /api/categories/:categoryId (or :categorySlug) - Update category (admin)
// router.put('/:categoryId', authenticateToken, isAdmin, categoryController.updateCategory);

// DELETE /api/categories/:categoryId (or :categorySlug) - Delete category (admin)
// router.delete('/:categoryId', authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
