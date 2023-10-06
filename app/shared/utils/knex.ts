import { knex as Knex } from "knex";
import { Model } from "objection";

import knexConfig from "../../knexConfig";
import config from "../../config";

const knex = Knex(knexConfig[config.env]);

Model.knex(knex);

export default knex;
