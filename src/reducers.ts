import type { InActiveData, Entity, ProgressTuple } from "./types";

function inActiveReducer(
  state: InActiveData,
  { type, payload }: inactiveReducerProps
) {
  switch (type) {
    case "reset":
      return { ...initInactiveState };
    default:
      return { ...state, [type]: payload };
  }
}

type initProgressStateType = {
  [K in keyof InActiveData]: { current: number; total: number };
};

const initInactiveState = {
  company: [],
  contact: [],
  lead: [],
};

const initProgressState: initProgressStateType = {
  company: { current: 0, total: 0 },
  contact: { current: 0, total: 0 },
  lead: { current: 0, total: 0 },
};

type inactiveReducerProps = {
  readonly type: (keyof InActiveData & string) | "reset";
  readonly payload: Entity[];
};

type ProgressReducerProps = {
  readonly type: inactiveReducerProps["type"];
  readonly payload: ProgressTuple;
};

function progressReducer(
  state: typeof initProgressState,
  { type, payload: [current, total] }: ProgressReducerProps
): typeof initProgressState {
  switch (type) {
    case "reset":
      return { ...initProgressState };
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

export {
  inActiveReducer,
  progressReducer,
  initProgressState,
  initInactiveState,
};
