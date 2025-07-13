const { Topic, Post, User, Forum, Category } = require('../../models');
const { Sequelize, Op } = require('sequelize');

// Search for topics based on query matching topic titles or post content
exports.search = async (req, res, next) => {
    try {
        const { q: query, page = 1, limit = 10 } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query "q" is required.' });
        }

        const offset = (page - 1) * limit;

        // Process the search query for full-text search.
        // Replace spaces with '&' for AND logic, or '|' for OR. Let's use OR for broader results.
        // Also handle potential special characters. A simple approach:
        const processedQuery = query.trim().split(/\s+/).join(' | ');

        // Find IDs of topics that have matching posts
        const matchingPostTopics = await Post.findAll({
            where: Sequelize.literal(`search_vector @@ to_tsquery('english', :query)`),
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('topicId')), 'topicId']],
            replacements: { query: processedQuery }
        });
        const topicIdsFromPosts = matchingPostTopics.map(p => p.topicId);

        // Find topics that match by title OR have posts that match
        const { count, rows: topics } = await Topic.findAndCountAll({
            where: {
                [Op.or]: [
                    Sequelize.literal(`search_vector @@ to_tsquery('english', :query)`),
                    { id: { [Op.in]: topicIdsFromPosts } }
                ]
            },
            include: [
                { model: User, as: 'user', attributes: ['id', 'username'] },
                { model: Forum, as: 'forum', attributes: ['id', 'name', 'slug'] }
            ],
            order: [['last_activity_at', 'DESC']], // Order results by recent activity
            limit: parseInt(limit),
            offset: offset,
            distinct: true, // Important for counts when using includes
            replacements: { query: processedQuery }
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            results: topics,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalResults: count,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        // Handle potential syntax errors in to_tsquery
        if (error.name === 'SequelizeDatabaseError' && error.parent?.code === '42601') {
            return res.status(400).json({ message: 'Invalid search query syntax.' });
        }
        next(error);
    }
};
