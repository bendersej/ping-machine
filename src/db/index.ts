import { createConnection, Connection, Repository } from "typeorm";
import { PingLog, PingTarget, EventLog } from "./entities";

export type Database = {
  connection: Connection;
  repositories: Repositories;
};

export type Repositories = {
  ping_targets: Repository<PingTarget>;
  ping_logs: Repository<PingLog>;
  event_logs: Repository<EventLog>;
};

export const createRepositories = (connection: Connection): Repositories => ({
  ping_targets: connection.getRepository(PingTarget),
  ping_logs: connection.getRepository(PingLog),
  event_logs: connection.getRepository(EventLog),
});

export async function createDbConnection() {
  try {
    const connection = await createConnection();

    return { repositories: createRepositories(connection), connection };
  } catch (e) {
    console.log(`Failed to connect to DB: ${e.message}`);
    throw e;
  }
}
