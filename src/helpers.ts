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

export { isInActiveEntity, pluralMap, inActivityDataTypes, delay };
