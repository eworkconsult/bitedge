'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('advertisements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ad_code: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      target_page_type: {
        type: Sequelize.ENUM('all', 'category', 'forum', 'topic'),
        allowNull: false,
        defaultValue: 'all',
      },
      target_identifier: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // Add index on is_active and target_page_type for faster ad serving queries
    await queryInterface.addIndex('advertisements', ['is_active', 'target_page_type'], {
      name: 'advertisements_active_target_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('advertisements');
  }
};
