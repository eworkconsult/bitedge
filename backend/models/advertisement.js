'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Advertisement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // In this case, advertisements are standalone and don't need direct associations.
    }
  }
  Advertisement.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'An internal name for identifying the ad campaign.'
    },
    ad_code: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'The HTML/JavaScript snippet for the ad (e.g., Google AdSense code).'
    },
    target_page_type: {
      type: DataTypes.ENUM('all', 'category', 'forum', 'topic'),
      allowNull: false,
      defaultValue: 'all',
      comment: 'The type of page this ad should appear on.'
    },
    target_identifier: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'The slug of the specific category, forum, or topic. Null if type is "all".'
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The location on the page where the ad should be rendered (e.g., "header", "sidebar", "post_bottom").'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the ad is currently active and should be served.'
    },
    // Timestamps createdAt and updatedAt are added by Sequelize by default
  }, {
    sequelize,
    modelName: 'Advertisement',
    tableName: 'advertisements',
    timestamps: true,
  });
  return Advertisement;
};
