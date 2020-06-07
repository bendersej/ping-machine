import { Database } from "../db";
import { Event } from "../db/entities/event_log";

export { Event };

export type LogEvent = (
  event: Event,
  metadata?: { error: string }
) => Promise<{ success: true }>;

export const createLogEvent = ({
  repositories,
}: Pick<Database, "repositories">): LogEvent => {
  return async (event, metadata) => {
    try {
      await repositories.event_logs.save({
        event,
        metadata: metadata ?? null,
      });

      return {
        success: true,
      };
    } catch (e) {
      throw Error(`Failed to log internal event: ${e.message}`);
    }
  };
};
