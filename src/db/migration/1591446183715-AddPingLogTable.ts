import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPingLogTable1591446183715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`CREATE TABLE "ping_log" (
      "log_id" UUID NOT NULL default uuid_generate_v4(),
      "target_id" TEXT NOT NULL,
      "alive" BOOL NOT NULL,
      "raw_output" TEXT NOT NULL,
      "numeric_host" TEXT,
      "logged_at" timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY("log_id")
    )`);

    await queryRunner.query(`
      CREATE INDEX "ix_ping_log_target_id" ON ping_log (target_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "ping_log"`);
  }
}
