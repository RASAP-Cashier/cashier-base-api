"use strict";

const TABLE_NAME = "social_logins";

exports.up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").index();
    table.text("social_id");
    table.text("first_name");
    table.text("last_name");
    table.text("provider");
    table.text("photo");
    table.text("email");

    table.timestamp("first_login").defaultTo(knex.fn.now());
    table.timestamp("last_login").defaultTo(knex.fn.now());
  });

  // Trigger for last_login timestamp
  await knex.raw(`
    CREATE OR REPLACE FUNCTION ${TABLE_NAME}_update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.last_login = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  await knex.raw(`
    CREATE TRIGGER update_${TABLE_NAME}_last_login
    BEFORE UPDATE ON ${TABLE_NAME}
    FOR EACH ROW
    EXECUTE FUNCTION ${TABLE_NAME}_update_timestamp();
  `);
};

exports.down = async function (knex) {
  await knex.raw(`DROP TRIGGER IF EXISTS update_${TABLE_NAME}_last_login ON ${TABLE_NAME}`);
  await knex.raw(`DROP FUNCTION IF EXISTS ${TABLE_NAME}_update_timestamp`);
  return knex.schema.dropTable(TABLE_NAME);
};
