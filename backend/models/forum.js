'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Forum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      Forum.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'CASCADE',
      });
      Forum.hasMany(models.Topic, {
        foreignKey: 'forumId',
        as: 'topics',
        onDelete: 'CASCADE',
      });
      // For last_topic_id, if you want to fetch the Topic object directly
      Forum.belongsTo(models.Topic, {
        foreignKey: 'lastTopicId', // This must match the column name
        as: 'lastTopic',
        constraints: false, // No actual FK constraint in DB for this, managed by app logic
        allowNull: true,
      });
    }
  }
  Forum.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories', // Table name
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(170),
      allowNull: false
      // Consider making slug unique within a category, or globally unique
      // unique: true, // If globally unique
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    topic_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    post_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastTopicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // No direct DB constraint here, this is for linking to the last topic model
      // Actual FK to topics table is not strictly needed if managed by application logic
      // and can avoid circular dependencies if Topic model also refers to Forum.
      // However, if you want a DB level constraint, you'd add:
      // references: {
      //  model: 'topics', // This can be tricky with circular dependencies at migration level
      //  key: 'id'
      // },
      // onDelete: 'SET NULL'
    }
    // Timestamps createdAt and updatedAt are added by Sequelize by default
  }, {
    sequelize,
    modelName: 'Forum',
    tableName: 'forums',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['categoryId', 'slug'] // Ensures slug is unique within a category
      }
      // {
      //   unique: true, // Or if you want globally unique forum slugs
      //   fields: ['slug']
      // }
    ],
    hooks: {
      beforeValidate: (forum, options) => {
        if (forum.name && !forum.slug) {
          forum.slug = forum.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
      }
    }
  });
  return Forum;
};
