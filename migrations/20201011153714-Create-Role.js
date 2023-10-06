"use strict";

const { addCommonColumns } = require("./utils");
const TABLE_NAME = "roles";

exports.up = (knex) =>
  knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments("id").primary();
    t.string("name");
    t.string("description");

    addCommonColumns(t, knex, false);
  });

exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
