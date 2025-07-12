const { app, assertDatabaseConnectionOk } = require('./src/app');

const PORT = process.env.PORT || 3001; // Default to 3001 if not in .env

async function startServer() {
    await assertDatabaseConnectionOk();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access it at http://localhost:${PORT}`);
    });
}

startServer();
