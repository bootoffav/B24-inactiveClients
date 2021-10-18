import type { InActiveData, Entity, ProgressTuple } from "./types";

function inActiveReducer(
  state: InActiveData,
  { type, payload }: inactiveReducerProps
) {
  return { ...state, [type]: payload };
}

const initProgressState = {
  company: {},
  contact: {},
  lead: {},
};

type inactiveReducerProps = {
  type: keyof InActiveData;
  payload: Entity[];
};

type ProgressReducerProps = {
  type: keyof InActiveData | "reset";
  payload: ProgressTuple;
};

function progressReducer(
  state: any,
  { type, payload: [current, total] }: ProgressReducerProps
) {
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
