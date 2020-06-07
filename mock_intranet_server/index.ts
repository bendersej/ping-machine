import dotenv from "dotenv";
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";

import { listOfHosts } from "./hosts";

dotenv.config({ path: ".env" });

const app = new Koa();

const router = new Router();

router.get("/sync", async (ctx, _next) => {
  console.log("Sync Endpoint called");
  ctx.body = {
    success: true,
    data: listOfHosts,
  };
});

router.post("/state-changes", async (ctx) => {
  console.log(ctx.request.body);
  ctx.body = {
    success: true,
  };
});

app.use(helmet());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.INTRANET_MOCK_SERVER_PORT);

console.log(
  `Intranet Mock Server running on port ${process.env.INTRANET_MOCK_SERVER_PORT}`
);
