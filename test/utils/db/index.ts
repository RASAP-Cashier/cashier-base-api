import { Pool } from "pg";

import { ENVIRONMENT } from "../../../app/shared/constants";
import knexConfig from "../../../app/knexConfig";

const { connection } = knexConfig[ENVIRONMENT.test];

const pool = new Pool({
  host: connection.host,
  port: connection.port as number,
  user: connection.user,
  password: connection.password,
  database: connection.database,
});

const makeQuery = async (queryString: string, params: any[]) => {
  const client = await pool.connect();
  try {
    await client.query(queryString, params);
  } finally {
    client.release();
  }
};

export const createDb = async () => {
  const query = `CREATE DATABASE "${connection.database}" WITH ENCODING 'UTF8'`;
  await makeQuery(query, []);
};

export const dropDb = async () => {
  const client = await pool.connect();
  try {
    // Drop all tables and sequences
    await client.query(`
            DO $$ DECLARE
                r RECORD;
            BEGIN
                -- Drop all tables
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || r.tablename || ' CASCADE';
                END LOOP;

                -- Drop all sequences
                FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = current_schema()) LOOP
                    EXECUTE 'DROP SEQUENCE IF EXISTS ' || r.sequence_name || ' CASCADE';
                END LOOP;
            END $$;
        `);

    // Depending on your needs, you might also want to drop other objects, like types, functions, etc.
    // However, note that if you have extensions installed, you might need a more elaborate script.
  } finally {
    client.release();
  }
};

export const close = () => {
  pool.end();
};
