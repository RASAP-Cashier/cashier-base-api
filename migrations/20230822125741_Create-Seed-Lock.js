/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const TABLE_NAME = "knex_seeds_lock";
exports.up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments("id").primary();
    table.boolean("is_locked");
  });

  await knex(TABLE_NAME).insert({ id: 1, is_locked: false });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};
