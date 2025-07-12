'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      Topic.belongsTo(models.Forum, {
        foreignKey: 'forumId',
        as: 'forum',
        onDelete: 'CASCADE',
      });
      Topic.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // or 'author'
        onDelete: 'CASCADE', // Or SET NULL if user deletion shouldn't delete topics
      });
      Topic.hasMany(models.Post, {
        foreignKey: 'topicId',
        as: 'posts',
        onDelete: 'CASCADE',
      });
      // For last_post_id, if you want to fetch the Post object directly
       Topic.belongsTo(models.Post, {
        foreignKey: 'lastPostId',
        as: 'lastPost',
        constraints: false, // No actual FK constraint in DB for this
        allowNull: true,
      });
    }
  }
  Topic.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    forumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forums', // table name
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(300), // Increased length for title + potential ID
      allowNull: false,
      unique: true
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reply_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastPostId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // No direct DB constraint for this one either to avoid circular issues at migration
      // and to simplify. Can be managed by application logic.
    },
    last_activity_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
    // Timestamps createdAt and updatedAt are added by Sequelize by default
  }, {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
    timestamps: true,
    hooks: {
      beforeValidate: (topic, options) => {
        if (topic.title && !topic.slug) {
          // Simple slug generation, consider a more robust library for production
          // e.g., adding a unique ID or short hash to ensure uniqueness if titles can be similar
          const baseSlug = topic.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
          topic.slug = `${baseSlug}-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`; // Ensure uniqueness
        }
        if (!topic.last_activity_at) {
            topic.last_activity_at = new Date();
        }
      },
      beforeUpdate: (topic, options) => {
        // Ensure last_activity_at is updated if certain fields change or explicitly set
        // This might also be handled when a new post is added to the topic.
        // topic.last_activity_at = new Date();
      }
    }
  });
  return Topic;
};
