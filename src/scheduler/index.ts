import { CronJob } from "cron";
import { Context } from "../context";

const CRON_EVERY_MINUTE = "* * * * *";
const CRON_EVERY_HOUR = "0 * * * *";

export const initScheduler = (context: Context) => {
  const pingTargets = new CronJob(CRON_EVERY_MINUTE, async () => {
    await context.pingTargets();

    const stateChangesResult = await context.getStateChanges();

    if (stateChangesResult.success && stateChangesResult.data.length !== 0) {
      context.syncBackStateChanges(stateChangesResult.data);
    }
  });

  const syncWithIntranet = new CronJob(CRON_EVERY_HOUR, async () => {
    await context.syncTargetsFromIntranet();
  });

  pingTargets.start();
  syncWithIntranet.start();
};
