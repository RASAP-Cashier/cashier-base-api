import * as http from "http";

import * as Koa from "koa";
import { koaSwagger } from "koa2-swagger-ui";
import * as Sentry from "@sentry/node";

import config from "./config";
import middlewares from "./middlewares";
import docsMiddlewares from "./middlewares/docsHandler";
import router from "./routes";
import { ENVIRONMENT } from "./shared/constants";
import knex from "./shared/utils/knex";

const { host, port, server_url, sentry_url, env } = config;

const app = new Koa();

app.use(middlewares());

app.use(router.routes());

if (env !== ENVIRONMENT.production) {
  app.use(docsMiddlewares());
}

app.use(
  koaSwagger({
    routePrefix: "/swagger", // host at /swagger instead of default /docs
    swaggerOptions: {
      url:
        env === ENVIRONMENT.development
          ? `http://${host}:${port}/api/v1/swagger.json`
          : `${server_url}/api/v1/swagger.json`,
    },
  }),
);

if ([ENVIRONMENT.production, ENVIRONMENT.uat, ENVIRONMENT.qa].includes(env)) {
  Sentry.init({ dsn: sentry_url });
}
// Application error logging.
app.on("error", (err, ctx) => {
  if (env !== ENVIRONMENT.test) {
    console.error(err);
  }
  if ([ENVIRONMENT.production, ENVIRONMENT.uat, ENVIRONMENT.qa].includes(env)) {
    Sentry.withScope((scope) => {
      scope.setSDKProcessingMetadata({ request: ctx.request });
      Sentry.captureException(err);
    });
  }
});

if (env !== ENVIRONMENT.test) {
  (async () => {
    try {
      await knex.migrate.latest();
      await knex.seed.run();

      const server = http.createServer(app.callback());

      server.listen(port, host, () => {
        console.log(`listening on http://${host}:${port}`);
      });
    } catch (e) {
      console.error("ERROR ON SERVER STARTUP", e);
      process.exit(1);
    }
  })();
}

export default {
  app,
};

export { app };
