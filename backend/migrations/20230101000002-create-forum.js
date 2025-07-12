'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forums', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories', // Name of the table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(170),
        allowNull: false
        // Uniqueness is handled by composite index below
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      topic_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      post_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      lastTopicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { // This can be problematic if Topic table isn't created yet.
                      // Usually, FKs to tables created in later migrations are added in their own separate migration
                      // after all primary tables are created.
                      // For now, I will include it but comment it out if it causes issues.
                      // It's safer to add this constraint in a later migration.
          model: 'topics', // Name of the topics table
          key: 'id'
        },
        onUpdate: 'SET NULL', // Or CASCADE, depending on desired behavior
        onDelete: 'SET NULL'
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

    // Add composite unique index for categoryId and slug
    await queryInterface.addIndex('forums', ['categoryId', 'slug'], {
      unique: true,
      name: 'forums_categoryId_slug_unique_idx'
    });

    // If lastTopicId FK causes issues, remove its 'references' block above
    // and add it in a new migration after topics table is created:
    // await queryInterface.addConstraint('forums', {
    //   fields: ['lastTopicId'],
    //   type: 'foreign key',
    //   name: 'fk_forums_last_topic_id',
    //   references: {
    //     table: 'topics',
    //     field: 'id'
    //   },
    //   onDelete: 'SET NULL',
    //   onUpdate: 'CASCADE'
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeIndex('forums', 'forums_categoryId_slug_unique_idx'); // if added separately
    await queryInterface.dropTable('forums');
  }
};
