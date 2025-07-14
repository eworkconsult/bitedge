const { Advertisement, Sequelize } = require('../../models');

// === ADMIN CRUD FUNCTIONS ===

// Create a new Advertisement
exports.createAdvertisement = async (req, res, next) => {
    try {
        const { name, ad_code, target_page_type, target_identifier, position, is_active } = req.body;
        const newAd = await Advertisement.create({
            name,
            ad_code,
            target_page_type,
            target_identifier,
            position,
            is_active
        });
        res.status(201).json(newAd);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors.map(e => e.message) });
        }
        next(error);
    }
};

// List all Advertisements (for admin panel)
exports.listAdvertisements = async (req, res, next) => {
    try {
        const ads = await Advertisement.findAll({ order: [['createdAt', 'DESC']] });
        res.json(ads);
    } catch (error) {
        next(error);
    }
};

// Get a single Advertisement by ID
exports.getAdvertisementById = async (req, res, next) => {
    try {
        const ad = await Advertisement.findByPk(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found.' });
        }
        res.json(ad);
    } catch (error) {
        next(error);
    }
};

// Update an Advertisement
exports.updateAdvertisement = async (req, res, next) => {
    try {
        const ad = await Advertisement.findByPk(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found.' });
        }
        const { name, ad_code, target_page_type, target_identifier, position, is_active } = req.body;
        const updatedAd = await ad.update({
            name,
            ad_code,
            target_page_type,
            target_identifier,
            position,
            is_active
        });
        res.json(updatedAd);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors.map(e => e.message) });
        }
        next(error);
    }
};

// Delete an Advertisement
exports.deleteAdvertisement = async (req, res, next) => {
    try {
        const ad = await Advertisement.findByPk(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found.' });
        }
        await ad.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// === PUBLIC AD SERVING LOGIC ===

// Get all active ads for a specific page context
exports.getActiveAdsForPage = async (req, res, next) => {
    try {
        const { page_type, identifier } = req.query;

        if (!page_type) {
            return res.status(400).json({ message: 'Query parameter "page_type" is required.' });
        }

        const whereConditions = {
            is_active: true,
            [Sequelize.Op.or]: [
                { target_page_type: 'all' },
                {
                    target_page_type: page_type,
                    target_identifier: identifier || null
                }
            ]
        };

        // If the identifier is not provided for a specific page_type, we might only want 'all'
        if (page_type !== 'all' && !identifier) {
            whereConditions[Sequelize.Op.or] = [{ target_page_type: 'all' }];
        }

        const ads = await Advertisement.findAll({
            where: whereConditions,
            attributes: ['ad_code', 'position'] // Only return necessary fields
        });

        // Group ads by position for easier rendering on the frontend
        const adsByPosition = ads.reduce((acc, ad) => {
            if (!acc[ad.position]) {
                acc[ad.position] = [];
            }
            acc[ad.position].push(ad.ad_code);
            return acc;
        }, {});

        res.json(adsByPosition);

    } catch (error) {
        next(error);
    }
};
