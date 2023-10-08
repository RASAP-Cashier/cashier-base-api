async function addCommonColumns(table, knex, with_is_deleted = true) {
  if (with_is_deleted) {
    table.boolean("is_deleted").defaultTo(false);
  }
  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
  table.string("created_by");
  table.string("updated_by");

  // Post-table creation: Set up trigger for `updated_at` column
  const tableName = table._tableName;

  // Trigger function creation
  const triggerFunction = `
    CREATE OR REPLACE FUNCTION ${tableName}_update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  // Trigger binding to the table
  const triggerCreation = `
    CREATE TRIGGER ${tableName}_update_updated_at
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION ${tableName}_update_timestamp();
  `;

  await knex.raw(triggerFunction);
  await knex.raw(triggerCreation);
}

module.exports = {
  addCommonColumns,
};
