import dayjs from "dayjs";
import { Activity } from "./types";

const today = dayjs();

function isInactiveEntity(
  activity: Activity,
  inactivityPeriod: string
): Boolean {
  const lastPossibleDayForBeingActive = today.subtract(
    Number(inactivityPeriod),
    "days"
  );
  return lastPossibleDayForBeingActive.isAfter(activity.LAST_UPDATED);
}

export { isInactiveEntity };
