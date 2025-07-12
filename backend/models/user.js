'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Topic, {
        foreignKey: 'userId',
        as: 'topics',
        onDelete: 'CASCADE', // Or 'SET NULL' if preferred
      });
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts',
        onDelete: 'CASCADE', // Or 'SET NULL'
      });
    }

    // Method to check password
    validPassword(password) {
      return bcrypt.compareSync(password, this.password_hash);
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    profile_bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Timestamps are managed by Sequelize by default if not disabled
    // createdAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW
    // },
    // updatedAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW
    // }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Explicitly define table name
    timestamps: true, // Sequelize will automatically add createdAt and updatedAt
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash') && user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });
  return User;
};
