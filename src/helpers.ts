import dayjs from "dayjs";
import { Activity, InActiveData } from "./types";

const today = dayjs();

const inActivityDataTypes: (keyof InActiveData)[] = [
  "company",
  "contact",
  "lead",
];

function isInActiveEntity(
  activity: Activity,
  inactivityPeriod: string
): Boolean {
  const lastPossibleDayForBeingActive = today.subtract(
    Number(inactivityPeriod),
    "days"
  );
  return lastPossibleDayForBeingActive.isAfter(activity.LAST_UPDATED);
}

export { isInActiveEntity, inActivityDataTypes };
