import {
  Union,
  Runtype,
  Record,
  Partial,
  Array,
  String,
  Null,
  Static,
  Literal,
} from "runtypes";

export const IntranetSyncResponseRuntype = Record({
  success: Literal(true),
  data: Array(
    Record({
      id: String,
      name: String.Or(Null),
      address: String,
    })
  ),
}).Or(
  Record({
    success: Literal(false),
    error: String,
  })
);
export type IntranetSyncResponse = Static<typeof IntranetSyncResponseRuntype>;

export const validateWith = <R extends Runtype>(
  runtype: R,
  payload: any
): Static<R> => {
  try {
    return runtype.check(payload);
  } catch (e) {
    throw Error(`Failed validation: ${e.message}`);
  }
};

const StatusRuntype = Union(
  Record({
    status_code: Literal(0),
    status: Literal("OK"),
  }),
  Record({
    status_code: Literal(1),
    status: Literal("WARNING"),
  }),
  Record({
    status_code: Literal(2),
    status: Literal("CRITICAL"),
  })
);

const StateChangeRuntype = Record({
  target_id: String,
}).And(StatusRuntype);
export type StateChange = Static<typeof StateChangeRuntype>;

export const StateChangeRequestRuntype = Record({
  state_changes: Array(StateChangeRuntype),
});

export type StateChangeRequest = Static<typeof StateChangeRequestRuntype>;

export const PingRequestParametersRuntype = Partial({
  targets: Array(
    Record({
      target_id: String,
    })
  ),
});
export type PingRequestParameters = Static<typeof PingRequestParametersRuntype>;
