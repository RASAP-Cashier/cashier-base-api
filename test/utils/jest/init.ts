import { knex as Knex } from "knex";

import { ENVIRONMENT } from "../../../app/shared/constants";
import { dropDb, createDb, close } from "../db";
import knexConfig from "../../../app/knexConfig";

const { client, connection } = knexConfig[ENVIRONMENT.test];

module.exports = async function () {
  console.info(`[${ENVIRONMENT.test}] creating db ${connection.database}`);
  await dropDb();
  await createDb();
  close();

  const newKnex = Knex({
    client,
    connection,
  });

  console.info(`[${ENVIRONMENT.test}] migrating db ${connection.database}`);
  await newKnex.migrate.latest();
  await newKnex.seed.run();
  await newKnex.destroy();
};
