import { ParameterizedContext } from "koa";
import { SwaggerAPI } from "koa-joi-router-docs-v2";

import auth from "./auth";

const generator = new SwaggerAPI();

[auth].forEach((route) => {
  generator.addJoiRouter(route);
});

const spec = generator.generateSpec(
  {
    info: {
      title: "API",
      description: "API for backend.",
      version: process.env.npm_package_version,
    },
    basePath: "/api/v1/",
    tags: [],
  },
  {},
);

export const swagger = async (ctx: ParameterizedContext) => {
  ctx.body = JSON.stringify(spec, null, "  ");
};
