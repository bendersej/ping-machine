import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
} from "typeorm";

import { PingTarget } from "./ping_target";

@Entity("ping_log")
export class PingLog {
  @PrimaryGeneratedColumn({ type: "uuid" })
  log_id!: string;

  @Index("ix_ping_log_target_id")
  @Column({ type: "text" })
  target_id!: string;

  @ManyToOne(() => PingTarget, (target) => target.logs)
  @JoinColumn({ name: "target_id" })
  target!: PingTarget;

  @Column({ type: "bool" })
  alive!: boolean;

  @Column({ type: "text" })
  raw_output!: string;

  @Column({ type: "text", nullable: true })
  numeric_host?: string | null = null;

  @Column({ type: "timestamp with time zone" })
  logged_at!: Date;
}
