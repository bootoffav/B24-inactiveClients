import dayjs from "dayjs";
import { Activity, InActiveData } from "./types";

const today = dayjs();

const inActivityDataTypes: (keyof InActiveData)[] = [
  "company",
  "contact",
  "lead",
];

const pluralMap = {
  company: "companies",
  contact: "contacts",
  lead: "leads",
};

const delay = async (ms = 200) =>
  await new Promise((res) => setTimeout(res, ms));

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

function findLatestActivity(activities: Activity[]): Activity {
  return activities.reduce((curLastActivity, currentActivity) =>
    currentActivity.LAST_UPDATED &&
    dayjs(curLastActivity.LAST_UPDATED).isAfter(currentActivity.LAST_UPDATED)
      ? curLastActivity
      : currentActivity
  );
}

export {
  isInActiveEntity,
  pluralMap,
  findLatestActivity,
  inActivityDataTypes,
  delay,
};
