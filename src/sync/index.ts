import fetch from "node-fetch";

import { Database } from "../db";
import {
  validateWith,
  StateChangeRequestRuntype,
  IntranetSyncResponseRuntype,
  StateChange,
} from "../interface";
import { LogEvent, Event } from "../internal_log";

export type SyncTargetsFromIntranet = () => Promise<
  { success: true } | { success: false; error: string }
>;

export type SyncBackStateChanges = (
  stateChanges: StateChange[]
) => Promise<{ success: true } | { success: false; error: string }>;

export const syncTargetsFromIntranet = ({
  repositories,
  intranetBaseURL,
  logEvent,
}: Pick<Database, "repositories"> & {
  intranetBaseURL: string;
  logEvent: LogEvent;
}): SyncTargetsFromIntranet => {
  return async () => {
    try {
      await logEvent(Event.TARGETS_LIST_SYNC_STARTED);

      const intranetSyncRequest = await (
        await fetch(`${intranetBaseURL}/sync`)
      ).json();

      const syncResponse = validateWith(
        IntranetSyncResponseRuntype,
        intranetSyncRequest
      );

      if (!syncResponse.success) {
        await logEvent(Event.TARGETS_LIST_SYNC_SYNC_ABORTED);

        return {
          success: false,
          error: syncResponse.error,
        };
      }

      const targetsToSync = syncResponse.data.map((target) => ({
        target_id: target.id,
        address: target.address,
        name: target.name,
      }));

      await repositories.ping_targets.save(targetsToSync);

      await logEvent(Event.TARGETS_LIST_SYNC_SYNC_COMPLETED);

      return {
        success: true,
      };
    } catch (e) {
      const errorMessage = e.message;

      await logEvent(Event.TARGETS_LIST_SYNC_SYNC_ABORTED, {
        error: errorMessage,
      });

      return {
        success: false,
        error: `Something went wrong when syncing: ${errorMessage}`,
      };
    }
  };
};

export const syncBackStateChanges = ({
  intranetBaseURL,
  logEvent,
}: Pick<Database, "repositories"> & {
  intranetBaseURL: string;
  logEvent: LogEvent;
}): SyncBackStateChanges => {
  return async (stateChanges) => {
    try {
      await logEvent(Event.TARGETS_STATE_CHANGES_REQUEST_STARTED);

      await fetch(`${intranetBaseURL}/state-changes`, {
        body: JSON.stringify(
          validateWith(StateChangeRequestRuntype, {
            state_changes: stateChanges,
          })
        ),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      await logEvent(Event.TARGETS_STATE_CHANGES_REQUEST_COMPLETED);

      return {
        success: true,
      };
    } catch (e) {
      const errorMessage = e.message;

      await logEvent(Event.TARGETS_STATE_CHANGES_REQUEST_ABORTED, {
        error: errorMessage,
      });

      return {
        success: false,
        error: `Something went wrong when syncing back the state changes: ${errorMessage}`,
      };
    }
  };
};
