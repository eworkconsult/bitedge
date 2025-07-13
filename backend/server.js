const { app, assertDatabaseConnectionOk } = require('./src/app');

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    const content = `User-agent: *
Disallow: /settings/
Disallow: /admin/ # Assuming an admin dashboard might be here later
Allow: /

Sitemap: ${process.env.BASE_URL}/sitemap.xml
`;
    res.send(content);
});

// Serve sitemap.xml
const sitemapController = require('./src/controllers/sitemapController');
app.get('/sitemap.xml', sitemapController.generateSitemap);

const PORT = process.env.PORT || 3001; // Default to 3001 if not in .env

async function startServer() {
    await assertDatabaseConnectionOk();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access it at http://localhost:${PORT}`);
    });
}

startServer();
