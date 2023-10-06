import { ConfigInterface } from "./interfaces";
import { ENVIRONMENT } from "./shared/constants";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";

require("dotenv").config({ path: envFile });

const common: ConfigInterface = {
  env: (process.env.NODE_ENV as ENVIRONMENT) || ENVIRONMENT.development,
  host: process.env.HOST,
  port: Number(process.env.PORT),
  server_url: process.env.SERVER_URL,
  frontend_url: process.env.FE_URL,
  sentry_url: process.env.SENTRY_URL,
  aws: {
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1",
    bucket: "",
  },
  postmark: {
    token: "123",
    from: "",
  },
  jwt_secret: "secretOrPrivateKey",
};

const development: ConfigInterface = {
  ...common,
};

const staging: ConfigInterface = {
  ...common,
};

const production: ConfigInterface = {
  ...common,
};

const test: ConfigInterface = {
  ...common,
};

interface EnvConfigInterface {
  [key: string]: ConfigInterface;
}

const config: EnvConfigInterface = {
  staging,
  development,
  production,
  test,
};

export default config[process.env.NODE_ENV || "development"];
