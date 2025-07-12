'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Forum, {
        foreignKey: 'categoryId',
        as: 'forums',
        onDelete: 'CASCADE',
      });
    }
  }
  Category.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Timestamps createdAt and updatedAt are added by Sequelize by default
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    // Auto-generate slug from name if not provided
    hooks: {
      beforeValidate: (category, options) => {
        if (category.name && !category.slug) {
          category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
      }
    }
  });
  return Category;
};
