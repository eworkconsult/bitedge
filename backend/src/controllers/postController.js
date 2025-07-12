const { Post, Topic, User, Forum } = require('../../models');
const sequelize = require('../db/sequelize'); // For transactions

// Create a new Post within a Topic
// This controller method would be called from a route like /api/topics/:topicSlug/posts
exports.createPostInTopic = async (req, res, next) => {
    const t = await sequelize.transaction(); // Start a transaction
    try {
        const { topicSlug } = req.params; // from the route
        const { content, parentPostId } = req.body; // parentPostId for threaded replies (optional)
        const userId = req.user?.userId; // Assuming authenticateToken middleware adds req.user

        if (!userId) {
            await t.rollback();
            return res.status(401).json({ message: 'Authentication required to create a post.' });
        }
        if (!content) {
            await t.rollback();
            return res.status(400).json({ message: 'Post content is required.' });
        }

        const topic = await Topic.findOne({ where: { slug: topicSlug }, transaction: t });
        if (!topic) {
            await t.rollback();
            return res.status(404).json({ message: 'Topic not found.' });
        }

        if (topic.is_locked) {
            await t.rollback();
            return res.status(403).json({ message: 'This topic is locked and does not allow new replies.' });
        }

        const newPost = await Post.create({
            content,
            topicId: topic.id,
            userId: userId,
            parentPostId: parentPostId || null // Handle optional parentPostId
        }, { transaction: t });

        // Update topic's reply_count, last_activity_at, and lastPostId
        topic.reply_count = (topic.reply_count || 0) + 1;
        topic.last_activity_at = newPost.createdAt;
        topic.lastPostId = newPost.id;
        await topic.save({ transaction: t });

        // Update forum's post_count (and potentially lastTopicId if this new post makes this topic the latest active)
        const forum = await Forum.findByPk(topic.forumId, { transaction: t });
        if (forum) {
            forum.post_count = (forum.post_count || 0) + 1;
            // Check if this topic should become the forum's last active topic
            if (newPost.createdAt > (forum.updatedAt || 0)) { // A simple check, could be more complex
                 // The forum's lastTopicId should reflect the topic that had the most recent post.
                 // This is already topic.id because we just posted to it.
                 // But we need to ensure the forum's updatedAt is also touched.
                 forum.lastTopicId = topic.id;
            }
            await forum.save({ transaction: t });
        }

        await t.commit();

        // Fetch the created post with some associations for the response
        const resultPost = await Post.findByPk(newPost.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'username'] },
                { model: Topic, as: 'topic', attributes: ['id', 'title', 'slug'] }
            ]
        });
        res.status(201).json(resultPost);

    } catch (error) {
        await t.rollback();
        next(error);
    }
};

// TODO: Get Post (rarely needed individually, usually part of Topic)
// TODO: Update Post (Admin/Owner)
// TODO: Delete Post (Admin/Owner)
