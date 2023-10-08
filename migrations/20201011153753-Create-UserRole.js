"use strict";

const TABLE_NAME = "user_roles";

exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments();
    table.integer("role_id").notNullable().references("id").inTable("roles").onDelete("CASCADE").index();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
