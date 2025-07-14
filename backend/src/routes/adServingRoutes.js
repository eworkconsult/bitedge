const express = require('express');
const router = express.Router();
const adController = require('../controllers/advertisementController');

// GET /api/ads?page_type=...&identifier=...
// This is a public route to fetch ads for a given page.
router.get('/', adController.getActiveAdsForPage);

module.exports = router;
