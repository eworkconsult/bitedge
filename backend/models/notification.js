'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      // The user who receives the notification
      Notification.belongsTo(models.User, {
        foreignKey: 'recipientId',
        as: 'recipient'
      });
      // The user who triggered the notification (e.g., who replied)
      Notification.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      });
      // The topic the notification is about
      Notification.belongsTo(models.Topic, {
        foreignKey: 'topicId',
        as: 'topic'
      });
    }
  }
  Notification.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'topics', key: 'id' },
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM('new_reply'), // Can be expanded later (e.g., 'mention', 'quote')
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true, // Will add createdAt and updatedAt
  });
  return Notification;
};
