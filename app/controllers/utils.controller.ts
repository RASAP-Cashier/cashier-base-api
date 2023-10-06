import { ParameterizedContext } from "koa";

export const getAliveHandler = async (ctx: ParameterizedContext) => {
  const uptime_minutes = process.uptime() / 60;
  const current_date = new Date().toISOString();
  const start_date = new Date(Date.now() - process.uptime() * 1000).toISOString();
  ctx.ok({
    uptime_minutes,
    current_date,
    start_date,
  });
};
