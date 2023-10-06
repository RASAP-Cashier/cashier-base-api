import * as Koa from "koa";

export default async (ctx: Koa.Context, next: () => Koa.Next) => {
  // const token = getToken(ctx.request.headers.authorization);
  // if (token) {
  //   const user: User = await getUserFromToken(token);

  //   if (!user) {
  //     throw PERMISSION_DENIED;
  //   }

  //   ctx.user = user;
  // }
  await next();
};
