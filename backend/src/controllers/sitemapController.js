const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { Category, Forum, Topic, User } = require('../../models');

exports.generateSitemap = async (req, res, next) => {
    try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const links = [];

        // 1. Add static pages
        links.push({ url: '/', changefreq: 'daily', priority: 1.0 });
        links.push({ url: '/login', changefreq: 'weekly', priority: 0.5 });
        links.push({ url: '/register', changefreq: 'weekly', priority: 0.5 });

        // 2. Add categories
        const categories = await Category.findAll({ attributes: ['slug', 'updatedAt'] });
        categories.forEach(cat => {
            links.push({
                url: `/categories/${cat.slug}`,
                changefreq: 'daily',
                priority: 0.9,
                lastmod: cat.updatedAt
            });
        });

        // 3. Add forums
        const forums = await Forum.findAll({ attributes: ['slug', 'updatedAt'] });
        forums.forEach(forum => {
            links.push({
                url: `/forums/${forum.slug}`,
                changefreq: 'daily',
                priority: 0.8,
                lastmod: forum.updatedAt
            });
        });

        // 4. Add topics
        const topics = await Topic.findAll({ attributes: ['slug', 'updatedAt'] });
        topics.forEach(topic => {
            links.push({
                url: `/topics/${topic.slug}`,
                changefreq: 'weekly',
                priority: 0.7,
                lastmod: topic.updatedAt
            });
        });

        // 5. Add user profiles
        const users = await User.findAll({ attributes: ['username', 'updatedAt'] });
        users.forEach(user => {
            links.push({
                url: `/users/${user.username}`,
                changefreq: 'monthly',
                priority: 0.6,
                lastmod: user.updatedAt
            });
        });

        // Create a stream to write to
        const stream = new SitemapStream({ hostname: baseUrl });

        // Set XML header
        res.header('Content-Type', 'application/xml');

        // Return a promise that resolves with your XML string
        const xmlStream = streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
            data.toString()
        );

        xmlStream.then(xml => {
            res.send(xml);
        }).catch(err => {
            next(err);
        });

    } catch (error) {
        next(error);
    }
};
