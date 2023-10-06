import * as Router from "koa-router";

import { swagger } from "./swagger";
import { getAliveHandler } from "../controllers";
import auth from "./auth";

const router = new Router({ prefix: "/api/v1" });

router.get("/swagger.json", swagger).get("/alive", (ctx) => getAliveHandler(ctx));
router.use(auth.middleware());
export default router;
