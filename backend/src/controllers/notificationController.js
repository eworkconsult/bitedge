const { Notification, User, Topic } = require('../../models');

// Get all notifications for the authenticated user
exports.listNotifications = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const notifications = await Notification.findAll({
            where: { recipientId: userId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username']
                },
                {
                    model: Topic,
                    as: 'topic',
                    attributes: ['id', 'title', 'slug']
                }
            ]
        });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id, recipientId: userId }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or you do not have permission to view it.' });
        }

        notification.is_read = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        next(error);
    }
};

// Mark all of a user's notifications as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        const { userId } = req.user;
        await Notification.update(
            { is_read: true },
            { where: { recipientId: userId, is_read: false } }
        );
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Get the count of unread notifications
exports.getUnreadCount = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const count = await Notification.count({
            where: { recipientId: userId, is_read: false }
        });
        res.json({ count });
    } catch (error) {
        next(error);
    }
};
