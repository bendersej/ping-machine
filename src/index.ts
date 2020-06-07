import Koa from "koa";

import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import "reflect-metadata";

import { Context } from "./context";
import { config } from "./config";
import { createDbConnection } from "./db";
import { syncTargetsFromIntranet, syncBackStateChanges } from "./sync";
import { pingTargets, getStateChanges } from "./ping";
import { createRouter } from "./api";
import { initScheduler } from "./scheduler";
import { createLogEvent } from "./internal_log";

createDbConnection()
  .then(async ({ repositories }) => {
    const app = new Koa();

    const logEvent = createLogEvent({
      repositories,
    });

    const context: Context = {
      repositories,
      syncTargetsFromIntranet: syncTargetsFromIntranet({
        repositories,
        intranetBaseURL: config.intranetBaseURL,
        logEvent,
      }),
      pingTargets: pingTargets({ repositories, logEvent }),
      getStateChanges: getStateChanges({ repositories }),
      syncBackStateChanges: syncBackStateChanges({
        repositories,
        intranetBaseURL: config.intranetBaseURL,
        logEvent,
      }),
    };

    const router = createRouter(context);

    app.use(helmet());
    app.use(bodyParser());

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(config.port);

    initScheduler(context);

    console.log(`Server running on port ${config.port}`);
  })
  .catch((error: string) => console.log("TypeORM connection error: ", error));
