'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topics', // Name of the table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Name of the table
          key: 'id'
        },
        onUpdate: 'CASCADE', // Or SET NULL
        onDelete: 'CASCADE'  // Or SET NULL
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      parentPostId: { // For threaded replies
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'posts', // Self-reference
          key: 'id'
        },
        onUpdate: 'CASCADE', // Or SET NULL
        onDelete: 'SET NULL'  // Or CASCADE if replies should be deleted with parent
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on topicId for faster querying of posts within a topic
    await queryInterface.addIndex('posts', ['topicId'], {
      name: 'posts_topicId_idx'
    });

    // Add index on userId for faster querying of user's posts
    await queryInterface.addIndex('posts', ['userId'], {
      name: 'posts_userId_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeIndex('posts', 'posts_topicId_idx'); // If added separately
    // await queryInterface.removeIndex('posts', 'posts_userId_idx'); // If added separately
    await queryInterface.dropTable('posts');
  }
};
