import { PingLog } from "../db/entities";
import { StateChange } from "../interface";

type TargetState = {
  target_id: string;
  previous_state: {
    alive: boolean;
    logged_at: Date;
  };
  current_state: {
    alive: boolean;
    logged_at: Date;
  };
};

export const getTargetsStates = (lastTwoPingLogsPerTarget: PingLog[]) => {
  const targetsStatesMap = lastTwoPingLogsPerTarget.reduce<{
    [target_id: string]: TargetState;
  }>((memo, curr) => {
    const existingEntry = memo[curr.target_id];

    return {
      ...memo,
      [curr.target_id]:
        existingEntry === undefined
          ? {
              ...memo[curr.target_id],
              target_id: curr.target_id,
              previous_state: {
                alive: curr.alive,
                logged_at: curr.logged_at,
              },
            }
          : {
              ...memo[curr.target_id],
              current_state: {
                alive: curr.alive,
                logged_at: curr.logged_at,
              },
            },
    };
  }, {});

  return Object.keys(targetsStatesMap).map((key) => targetsStatesMap[key]);
};

export const getTargetsStatesChanges = (targetStates: TargetState[]) =>
  targetStates.reduce<StateChange[]>((memo, curr) => {
    const { target_id, current_state, previous_state } = curr;
    if (previous_state.alive === current_state.alive) {
      if (!current_state.alive) {
        return [
          ...memo,
          {
            target_id,
            status_code: 2,
            status: "CRITICAL",
          },
        ];
      }

      return memo;
    }

    if (previous_state.alive && !current_state.alive) {
      return [
        ...memo,
        {
          target_id,
          status_code: 1,
          status: "WARNING",
        },
      ];
    }

    if (!previous_state.alive && current_state.alive) {
      return [
        ...memo,
        {
          target_id,
          status_code: 0,
          status: "OK",
        },
      ];
    }

    return memo;
  }, []);
