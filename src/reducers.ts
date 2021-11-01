import type { InActiveData, Entity, ProgressTuple } from "./types";

function inActiveReducer(
  state: InActiveData,
  { type, payload }: inactiveReducerProps
) {
  return { ...state, [type]: payload };
}

type initProgressStateType = {
  [K in keyof InActiveData]: { current: number; total: number };
};

const initProgressState: initProgressStateType = {
  company: { current: 0, total: 0 },
  contact: { current: 0, total: 0 },
  lead: { current: 0, total: 0 },
};

type inactiveReducerProps = {
  readonly type: keyof InActiveData;
  readonly payload: Entity[];
};

type ProgressReducerProps = {
  readonly type: inactiveReducerProps["type"] | "reset";
  readonly payload: ProgressTuple;
};

function progressReducer(
  state: typeof initProgressState,
  { type, payload: [current, total] }: ProgressReducerProps
): typeof initProgressState {
  switch (type) {
    case "reset":
      return initProgressState;
    default:
      return {
        ...state,
        [type]: {
          current,
          total,
        },
      };
  }
}

export { inActiveReducer, progressReducer, initProgressState };
