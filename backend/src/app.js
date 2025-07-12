const express = require('express');
const cors =require('cors');
const dotenv = require('dotenv');

// Load environment variables
// Assuming .env is in the 'backend' directory, one level up from 'src'
dotenv.config({ path: __dirname + '/../.env' });

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Sequelize database connection setup
const sequelize = require('./db/sequelize'); // We'll create this file next

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bitedge Network API! Database connection pending.' });
});

// Import and use main API router
const mainRouter = require('./routes/index'); // Corrected path if routes/index.js is in the same dir as app.js
app.use('/api', mainRouter);


// Global error handler (basic example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({ error: err.message || 'Something went wrong!' });
});

async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
        // Sync all models (optional, good for development, use migrations for production)
        // await sequelize.sync(); // or sequelize.sync({ alter: true })
        // console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:');
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { app, assertDatabaseConnectionOk };
