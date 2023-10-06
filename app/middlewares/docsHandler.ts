import * as path from "path";

import * as Koa from "koa";
import { compose } from "koa-convert";
import * as serve from "koa-static";
import * as mount from "koa-mount";

const docsRedirect = async (ctx: Koa.Context, next: () => Promise<Koa.Next>) => {
  if (ctx.originalUrl === "/docs") {
    return ctx.redirect("/docs/");
  }
  await next();
};

export default () => compose(mount("/docs/", serve(path.join(__dirname, "..", "..", "docs"))), docsRedirect);
