"use strict";

const { addCommonColumns } = require("./utils");
const TABLE_NAME = "permissions";

exports.up = async (knex) => {
  await knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments("id").primary();
    t.text("name");
    t.text("description");

    // Add common columns without the is_deleted column
    addCommonColumns(t, knex, false);
  });
};

exports.down = async function (knex) {
  await knex.raw(`DROP TRIGGER IF EXISTS ${TABLE_NAME}_update_updated_at ON ${TABLE_NAME}`);
  await knex.raw(`DROP FUNCTION IF EXISTS ${TABLE_NAME}_update_timestamp`);
  return knex.schema.dropTable(TABLE_NAME);
};
