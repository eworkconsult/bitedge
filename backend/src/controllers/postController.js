const { Post, Topic, User, Forum, Notification } = require('../../models');
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

        // Create a notification for the topic author, if they aren't the one replying
        if (topic.userId !== userId) {
            await Notification.create({
                recipientId: topic.userId,
                senderId: userId,
                topicId: topic.id,
                type: 'new_reply'
            }, { transaction: t });
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

// Update a Post
exports.updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const { userId, isAdmin } = req.user; // from authenticateToken middleware

        if (!content) {
            return res.status(400).json({ message: 'Content cannot be empty.' });
        }

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if user is the owner or an admin
        if (post.userId !== userId && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this post.' });
        }

        post.content = content;
        await post.save();

        res.json(post);

    } catch (error) {
        next(error);
    }
};

// Delete a Post
exports.deletePost = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { postId } = req.params;
        const { userId, isAdmin } = req.user;

        const post = await Post.findByPk(postId, { transaction: t });

        if (!post) {
            await t.rollback();
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if user is the owner or an admin
        if (post.userId !== userId && !isAdmin) {
            await t.rollback();
            return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this post.' });
        }

        const topic = await Topic.findByPk(post.topicId, { transaction: t });
        const forum = topic ? await Forum.findByPk(topic.forumId, { transaction: t }) : null;

        // Delete the post
        await post.destroy({ transaction: t });

        // Decrement counts
        if (topic) {
            topic.reply_count = Math.max(0, (topic.reply_count || 1) - 1);
            // TODO: Add logic here to find the new lastPostId for the topic if this was the last post.
            // This can be complex. For now, we can set it to null or leave it.
            // A simpler approach is to just decrement counts.
            await topic.save({ transaction: t });
        }
        if (forum) {
            forum.post_count = Math.max(0, (forum.post_count || 1) - 1);
            await forum.save({ transaction: t });
        }

        await t.commit();
        res.status(204).send(); // 204 No Content for successful deletion

    } catch (error) {
        await t.rollback();
        next(error);
    }
};
