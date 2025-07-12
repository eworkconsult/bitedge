'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.Topic, {
        foreignKey: 'topicId',
        as: 'topic',
        onDelete: 'CASCADE',
      });
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // or 'author'
        onDelete: 'CASCADE', // Or SET NULL
      });

      // For threaded replies (optional)
      Post.belongsTo(models.Post, {
        foreignKey: 'parentPostId',
        as: 'parentPost',
        allowNull: true,
        onDelete: 'SET NULL' // If parent is deleted, children are not deleted but lose parent link
      });
      Post.hasMany(models.Post, {
        foreignKey: 'parentPostId',
        as: 'replies',
        allowNull: true
      });
    }
  }
  Post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topics', // table name
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // table name
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parentPostId: { // For threaded replies
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'posts', // Self-reference to the posts table
        key: 'id'
      },
      onDelete: 'SET NULL'
    }
    // Timestamps createdAt and updatedAt are added by Sequelize by default
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    hooks: {
        // Example hook: after a post is created, update topic's last_activity_at and reply_count
        // This requires access to other models, so it's often handled in service layers
        // or by ensuring models are loaded in sequelize instance passed around.
        // For simplicity here, we'll assume such logic might be in API controllers/services.
        /*
        afterCreate: async (post, options) => {
            const topic = await post.getTopic();
            if (topic) {
                topic.reply_count = (topic.reply_count || 0) + 1;
                topic.last_activity_at = post.createdAt;
                topic.lastPostId = post.id;
                await topic.save({ transaction: options.transaction });

                const forum = await topic.getForum();
                if (forum) {
                    forum.post_count = (forum.post_count || 0) + 1;
                    // forum.lastTopicId = topic.id; // This might be redundant if lastTopicId points to latest topic by activity
                    await forum.save({ transaction: options.transaction });
                }
            }
        },
        afterDestroy: async (post, options) => {
            const topic = await post.getTopic();
             if (topic) {
                topic.reply_count = Math.max(0, (topic.reply_count || 0) - 1);
                // Potentially find the new last post for the topic
                await topic.save({ transaction: options.transaction });

                const forum = await topic.getForum();
                if (forum) {
                    forum.post_count = Math.max(0, (forum.post_count || 0) - 1);
                    await forum.save({ transaction: options.transaction });
                }
            }
        }
        */
    }
  });
  return Post;
};
