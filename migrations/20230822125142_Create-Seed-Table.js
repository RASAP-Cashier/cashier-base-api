const TABLE_NAME = "knex_seeds";

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments("id");
    table.string("file_name").notNullable();
    table.timestamp("seed_time").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
