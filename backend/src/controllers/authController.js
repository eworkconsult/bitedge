const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // Adjust path if models/index.js is elsewhere or re-exported

// User Registration
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Check if user already exists
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        const existingUserByUsername = await User.findOne({ where: { username } });
        if (existingUserByUsername) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // Password will be hashed by the model's beforeCreate hook
        const newUser = await User.create({
            username,
            email,
            password_hash: password // Pass plain password; hook will hash it
        });

        // Don't send password hash in response
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json({ message: 'User registered successfully', user: userResponse });

    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

// User Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (email not found).' });
        }

        // Use the validPassword method from the User model
        const isMatch = user.validPassword(password); // Assumes password_hash field is used by validPassword
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (password incorrect).' });
        }

        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
        }

        // Generate JWT
        const payload = {
            userId: user.id,
            username: user.username,
            isAdmin: user.is_admin
        };
        const secret = process.env.JWT_SECRET;
        const options = { expiresIn: process.env.JWT_EXPIRES_IN || '1h' };

        if (!secret) {
            console.error("JWT_SECRET is not defined in environment variables!");
            return res.status(500).json({ message: "Authentication configuration error." });
        }

        const token = jwt.sign(payload, secret, options);

        // Update last_login_at
        user.last_login_at = new Date();
        await user.save();

        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                is_admin: user.is_admin
            }
        });

    } catch (error) {
        next(error);
    }
};

// User Logout (conceptual - JWT is stateless on server, client discards token)
exports.logout = (req, res) => {
    // For session-based auth, you would destroy session here.
    // For JWT, client should discard the token. Server can't "invalidate" a JWT unless
    // it's blacklisted (more complex setup).
    res.json({ message: 'Logged out successfully. Please discard your token.' });
};
