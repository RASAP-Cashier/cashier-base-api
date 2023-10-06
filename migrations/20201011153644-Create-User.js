"use strict";

const TABLE_NAME = "users";
exports.up = (knex) =>
  knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments("id").primary();
    t.string("first_name");
    t.string("last_name");
    t.string("phone");
    t.string("photo").defaultTo(null);
    t.string("email");
    t.string("password_hash");
    t.string("confirmation_hash").defaultTo(null);
    t.boolean("is_active").defaultTo(false);
    t.boolean("is_email_verified").defaultTo(false);

    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    t.string("created_by");
    t.string("updated_by");
  });

exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
