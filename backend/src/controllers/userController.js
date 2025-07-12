const { User, Topic, Post } = require('../../models');
const { Op } = require('sequelize');

// Get a user's public profile by username
exports.getUserProfile = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 10 } = req.query; // For paginating user's topics

        const offset = (page - 1) * limit;

        const user = await User.findOne({
            where: { username: { [Op.iLike]: username } }, // Case-insensitive search
            attributes: ['id', 'username', 'profile_bio', 'avatar_url', 'createdAt'],
            include: [
                {
                    model: Topic,
                    as: 'topics',
                    attributes: ['id', 'title', 'slug', 'createdAt', 'reply_count'],
                    limit: parseInt(limit),
                    offset: offset,
                    order: [['createdAt', 'DESC']]
                }
            ],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // We can also get total topic count for pagination headers
        const totalTopics = await Topic.count({ where: { userId: user.id } });
        const totalPages = Math.ceil(totalTopics / limit);

        res.json({
            user,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalTopics,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        next(error);
    }
};

// === ADMIN-ONLY FUNCTIONS ===

// List all users (paginated)
exports.listUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'username', 'email', 'is_admin', 'is_active', 'createdAt'],
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            users: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalUsers: count,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Toggle a user's 'is_active' status (ban/unban)
exports.toggleUserActive = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const userToToggle = await User.findByPk(userId);

        if (!userToToggle) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent an admin from deactivating themselves
        if (userToToggle.id === req.user.userId) {
            return res.status(400).json({ message: "You cannot change your own active status."});
        }

        userToToggle.is_active = !userToToggle.is_active;
        await userToToggle.save();

        res.json({
            message: `User ${userToToggle.username} has been ${userToToggle.is_active ? 'unbanned' : 'banned'}.`,
            user: {
                id: userToToggle.id,
                username: userToToggle.username,
                is_active: userToToggle.is_active
            }
        });

    } catch (error) {
        next(error);
    }
};

// Update the logged-in user's own profile
exports.updateUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.user; // from authenticateToken middleware
        const { profile_bio, avatar_url } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            // This should technically not happen if token is valid, but as a safeguard
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the fields that are allowed to be changed
        if (profile_bio !== undefined) {
            user.profile_bio = profile_bio;
        }
        if (avatar_url !== undefined) {
            user.avatar_url = avatar_url;
        }

        await user.save();

        // Return the updated public profile info
        res.json({
            id: user.id,
            username: user.username,
            profile_bio: user.profile_bio,
            avatar_url: user.avatar_url,
            createdAt: user.createdAt
        });

    } catch (error) {
        next(error);
    }
};
