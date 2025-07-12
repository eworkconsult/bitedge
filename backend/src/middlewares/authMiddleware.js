const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token expired.' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
            }
            return res.status(403).json({ message: 'Forbidden: Token verification failed.' }); // Other errors
        }

        // Token is valid, attach user info to request object
        // Optionally, fetch user from DB to ensure they are still active/valid
        try {
            const user = await User.findByPk(decodedPayload.userId);
            if (!user || !user.is_active) {
                return res.status(401).json({ message: 'Unauthorized: User not found or inactive.' });
            }
            req.user = {
                userId: user.id,
                username: user.username,
                isAdmin: user.is_admin
            }; // Attach subset of user info, not the whole Sequelize model instance
            next();
        } catch (dbError) {
            console.error("Error fetching user during token verification:", dbError);
            return res.status(500).json({ message: "Error verifying authentication."});
        }
    });
};

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Requires admin privileges.' });
    }
    next();
};

// Placeholder for moderator check if needed later
// const isModerator = (req, res, next) => { ... }

module.exports = {
    authenticateToken,
    isAdmin
};
