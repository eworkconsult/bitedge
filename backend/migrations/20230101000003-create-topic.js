'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('topics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      forumId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'forums', // Name of the table
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
        onUpdate: 'CASCADE', // Or SET NULL if user deletion shouldn't delete topics
        onDelete: 'CASCADE'  // Or SET NULL
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true
      },
      is_pinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      reply_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      lastPostId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { // Potential circular dependency if Post table not yet created.
                      // Safer to add this constraint in a later migration.
          model: 'posts', // Name of the posts table
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      last_activity_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
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

    // If lastPostId FK causes issues, remove its 'references' block above
    // and add it in a new migration after posts table is created.
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('topics');
  }
};
