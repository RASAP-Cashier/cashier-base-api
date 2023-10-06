import * as path from "path";

import * as dotenv from "dotenv";

import { ENVIRONMENT } from "./shared/constants";
import { KnexMysql2Config } from "./interfaces";

const env = (process.env.NODE_ENV as ENVIRONMENT) || ENVIRONMENT.development;

dotenv.config({ path: path.resolve(__dirname, "..", ".env"), override: env === ENVIRONMENT.development });

const commonConfig: KnexMysql2Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 3306,
    typeCast(field: any, next: () => {}) {
      if (field.type === "TINY" && field.length === 1) {
        const val = field.string();
        return val === null ? null : val === "1"; // 1 = true, 0 = false
      }
      return next();
    },
  },
  pool: {
    min: 2,
    max: 20,
  },
  migrations: {
    extension: "js",
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    extension: "js",
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};

const envConfigs: Record<ENVIRONMENT, KnexMysql2Config> = {
  [ENVIRONMENT.development]: commonConfig,
  [ENVIRONMENT.qa]: commonConfig,
  [ENVIRONMENT.uat]: commonConfig,
  [ENVIRONMENT.production]: commonConfig,
  [ENVIRONMENT.test]: {
    ...commonConfig,
    connection: { ...commonConfig.connection, database: process.env.DB_NAME_TEST },
  },
};

export default envConfigs;
