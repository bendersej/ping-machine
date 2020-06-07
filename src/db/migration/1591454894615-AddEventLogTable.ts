import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventLogTable1591454894615 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "event_log" (
      "event_id" UUID NOT NULL default uuid_generate_v4(),
      "event" TEXT NOT NULL,
      "metadata" JSONB,
      "logged_at" timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY("event_id")
    )`);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_event_log_event_logged_at" ON event_log (event, logged_at);
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_event_log_logged_at" ON event_log (logged_at);
    `);

    await queryRunner.query(`
    CREATE INDEX "ix_event_log_event" ON event_log (event);
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "event_log"`);
  }
}
