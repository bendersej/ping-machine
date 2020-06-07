import Router from "@koa/router";

import { Context } from "../context";
import { PingRequestParametersRuntype, validateWith } from "../interface";

export const createRouter = (context: Context) => {
  const router = new Router({
    prefix: "/api/v1",
  });

  router.post("/sync", async (ctx) => {
    const syncResponse = await context.syncTargetsFromIntranet();

    return (ctx.body = syncResponse);
  });

  router.post("/ping", async (ctx) => {
    try {
      const requestParameters = validateWith(
        PingRequestParametersRuntype,
        ctx.request.body
      );

      const pingTargets = await context.pingTargets(requestParameters);

      return (ctx.body = pingTargets);
    } catch (e) {
      return (ctx.body = {
        success: false,
        error: e.message,
      });
    }
  });

  return router;
};
