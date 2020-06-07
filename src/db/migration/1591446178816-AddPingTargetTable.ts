import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPingTargetTable1591446178816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "ping_target" (
      "target_id" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "name" TEXT,
      "created_at" timestamp with time zone NOT NULL DEFAULT now(),
      "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY("target_id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "ping_target"`);
  }
}
