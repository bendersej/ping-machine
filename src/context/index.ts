import { Repositories } from "../db";
import { SyncTargetsFromIntranet, SyncBackStateChanges } from "../sync";
import { PingTargets, GetStateChanges } from "../ping";

export interface Context {
  repositories: Repositories;
  syncTargetsFromIntranet: SyncTargetsFromIntranet;
  getStateChanges: GetStateChanges;
  pingTargets: PingTargets;
  syncBackStateChanges: SyncBackStateChanges;
}
