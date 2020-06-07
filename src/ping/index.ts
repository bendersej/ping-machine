import * as ping from "ping";
import { Database } from "../db";
import { PingLog } from "../db/entities";
import { getTargetsStates, getTargetsStatesChanges } from "./helpers";
import { Any } from "typeorm";
import { PingRequestParameters, StateChange } from "../interface";
import { LogEvent, Event } from "../internal_log";

type Options = {
  targets?: { target_id: string }[];
};

export type PingTargets = (
  options?: PingRequestParameters
) => Promise<
  { success: true; data: PingLog[] } | { success: false; error: string }
>;

export type GetStateChanges = (
  options?: Options
) => Promise<
  { success: true; data: StateChange[] } | { success: false; error: string }
>;

export const pingTargets = ({
  repositories,
  logEvent,
}: Pick<Database, "repositories"> & { logEvent: LogEvent }): PingTargets => {
  return async (options) => {
    try {
      await logEvent(Event.PING_TARGETS_STARTED);

      const targets =
        options?.targets?.length !== undefined
          ? await repositories.ping_targets.find({
              where: {
                target_id: Any(
                  (options?.targets ?? []).map(({ target_id }) => target_id)
                ),
              },
            })
          : await repositories.ping_targets.find();

      if (targets.length === 0) {
        return {
          success: false,
          error:
            options !== undefined
              ? "No target found matching this query"
              : "No target found in the database",
        };
      }

      const hostsToPing = targets.map(({ target_id, address }) => {
        return {
          host: address
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
            .split("/")[0],
          target_id,
        };
      });

      const pingResults = (
        await Promise.all(
          hostsToPing.map(({ host }) => ping.promise.probe(host))
        )
      ).map((result, resultIndex) => ({
        target_id: hostsToPing[resultIndex].target_id,
        raw_output: result.output,
        ...result,
      }));

      const savedPingResults = await repositories.ping_logs.save(pingResults);

      await logEvent(Event.PING_TARGETS_COMPLETED);

      return {
        success: true,
        data: savedPingResults,
      };
    } catch (e) {
      const errorMessage = e.message;

      await logEvent(Event.PING_TARGETS_ABORTED, { error: errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };
};

export const getStateChanges = ({
  repositories,
}: Pick<Database, "repositories">): GetStateChanges => {
  return async (options) => {
    try {
      const targets =
        options?.targets?.length !== 0
          ? await repositories.ping_targets.find({
              where: {
                target_id: Any(
                  (options?.targets ?? []).map(({ target_id }) => target_id)
                ),
              },
            })
          : [];

      const lastTwoPingLogsPerTarget: PingLog[] = await repositories.event_logs
        .query(`SELECT rank_filter.* FROM (
        select *, rank() OVER (
          PARTITION BY target_id
          ORDER BY logged_at DESC
        ) FROM ping_log) rank_filter where RANK <= 2 ${
          targets.length > 0
            ? `AND target_id = ANY('{${targets.map(
                ({ target_id }) => target_id
              )}}')`
            : ""
        } ORDER BY logged_at ASC`);

      const targetStates = getTargetsStates(lastTwoPingLogsPerTarget);
      const listOfStateChanges = getTargetsStatesChanges(targetStates);

      return {
        data: listOfStateChanges,
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  };
};
