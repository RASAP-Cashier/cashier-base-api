"use strict";

const TABLE_NAME = "role_permissions";

exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments();
    table.integer("role_id").notNullable().references("id").inTable("roles").onDelete("CASCADE").index();
    table.integer("permission_id").notNullable().references("id").inTable("permissions").onDelete("CASCADE").index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
