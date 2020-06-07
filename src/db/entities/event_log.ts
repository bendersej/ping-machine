import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from "typeorm";

export enum Event {
  PING_TARGETS_STARTED = "PING_TARGETS_STARTED",
  PING_TARGETS_COMPLETED = "PING_TARGETS_COMPLETED",
  PING_TARGETS_ABORTED = "PING_TARGETS_ABORTED",
  TARGETS_LIST_SYNC_STARTED = "TARGETS_LIST_SYNC_STARTED",
  TARGETS_LIST_SYNC_SYNC_COMPLETED = "TARGETS_LIST_SYNC_SYNC_COMPLETED",
  TARGETS_LIST_SYNC_SYNC_ABORTED = "TARGETS_LIST_SYNC_SYNC_ABORTED",
  TARGETS_STATE_CHANGES_REQUEST_STARTED = "TARGETS_STATE_CHANGES_REQUEST_STARTED",
  TARGETS_STATE_CHANGES_REQUEST_COMPLETED = "TARGETS_STATE_CHANGES_REQUEST_COMPLETED",
  TARGETS_STATE_CHANGES_REQUEST_ABORTED = "TARGETS_STATE_CHANGES_REQUEST_ABORTED",
}

@Unique("uq_event_log_event_logged_at", ["event", "logged_at"])
@Entity("event_log")
export class EventLog {
  @PrimaryGeneratedColumn({ type: "uuid" })
  event_id!: string;

  @Index("ix_event_log_event")
  @Column({ type: "text" })
  event!: Event;

  @Index("ix_event_log_logged_at")
  @Column({ type: "timestamp with time zone" })
  logged_at!: Date;

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    [key: string]: boolean | number | string | null | Array<any> | Object;
  } | null = null;
}
