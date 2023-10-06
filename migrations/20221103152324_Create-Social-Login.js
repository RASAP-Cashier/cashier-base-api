"use strict";

const TABLE_NAME = "social_logins";

exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE").index();
    table.string("social_id");
    table.string("first_name");
    table.string("last_name");
    table.string("provider");
    table.string("photo");
    table.string("email");

    table.timestamp("first_login").defaultTo(knex.fn.now());
    table.timestamp("last_login").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
