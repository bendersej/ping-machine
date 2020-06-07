import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

import { PingLog } from "./ping_log";

@Entity("ping_target")
export class PingTarget {
  @PrimaryColumn({ type: "text" })
  target_id!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "text", nullable: true })
  name: string | null = null;

  @OneToMany(() => PingLog, (log) => log.target)
  logs!: PingLog[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updated_at!: Date;
}
