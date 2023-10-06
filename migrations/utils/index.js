function addCommonColumns(table, knex, with_is_deleted = true) {
  if (with_is_deleted) {
    table.boolean("is_deleted").defaultTo(false);
  }
  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  table.string("created_by");
  table.string("updated_by");
}

module.exports = {
  addCommonColumns,
};
