'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add search_vector column to topics table
    await queryInterface.addColumn('topics', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true,
    });

    // Add search_vector column to posts table
    await queryInterface.addColumn('posts', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true,
    });

    // Create GIN index on the new columns for performance
    await queryInterface.sequelize.query(
      'CREATE INDEX topics_search_vector_idx ON topics USING gin(search_vector);'
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX posts_search_vector_idx ON posts USING gin(search_vector);'
    );

    // Create a function to update the topic's search vector
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_topic_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector('english', NEW.title);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a function to update the post's search vector
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_post_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector('english', NEW.content);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a trigger on the topics table
    await queryInterface.sequelize.query(`
      CREATE TRIGGER topics_search_vector_update
      BEFORE INSERT OR UPDATE ON topics
      FOR EACH ROW
      EXECUTE FUNCTION update_topic_search_vector();
    `);

    // Create a trigger on the posts table
    await queryInterface.sequelize.query(`
      CREATE TRIGGER posts_search_vector_update
      BEFORE INSERT OR UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION update_post_search_vector();
    `);

    // Optional: Populate the search_vector for existing data
    await queryInterface.sequelize.query(
      "UPDATE topics SET search_vector = to_tsvector('english', title);"
    );
    await queryInterface.sequelize.query(
      "UPDATE posts SET search_vector = to_tsvector('english', content);"
    );
  },

  async down(queryInterface, Sequelize) {
    // Drop triggers
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS topics_search_vector_update ON topics;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS posts_search_vector_update ON posts;');

    // Drop functions
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_topic_search_vector();');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_post_search_vector();');

    // Drop columns (indexes are dropped automatically with columns)
    await queryInterface.removeColumn('topics', 'search_vector');
    await queryInterface.removeColumn('posts', 'search_vector');
  }
};
