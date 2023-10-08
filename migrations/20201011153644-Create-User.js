"use strict";
const { addCommonColumns } = require("./utils");
const TABLE_NAME = "users";

exports.up = async (knex) => {
  await knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments("id").primary();
    t.text("first_name");
    t.text("last_name");
    t.text("phone");
    t.text("photo").defaultTo(null);
    t.text("email");
    t.text("password_hash");
    t.text("confirmation_hash").defaultTo(null);
    t.boolean("is_active").defaultTo(false);
    t.boolean("is_email_verified").defaultTo(false);

    // Use the utility function to add common columns
    addCommonColumns(t, knex);
  });
};

exports.down = async function (knex) {
  await knex.raw(`DROP TRIGGER IF EXISTS ${TABLE_NAME}_update_updated_at ON ${TABLE_NAME}`);
  await knex.raw(`DROP FUNCTION IF EXISTS ${TABLE_NAME}_update_timestamp`);
  return knex.schema.dropTable(TABLE_NAME);
};
