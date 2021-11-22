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

const delay = async (ms = process.env.REACT_APP_DELAY || 700) =>
  await new Promise((res) => setTimeout(res, Number(ms)));

function getLastDayOfActivePeriod(amount: string, unit: string) {
  return today.subtract(Number(amount), unit);
}

function isInActiveEntity(
  activity: Activity,
  inactivityPeriod: string
): Boolean {
  const [amount, unit] = inactivityPeriod.split(" ");
  const lastPossibleDayForBeingActive = getLastDayOfActivePeriod(amount, unit);
  return lastPossibleDayForBeingActive.isAfter(activity.LAST_UPDATED);
}

export {
  isInActiveEntity,
  pluralMap,
  inActivityDataTypes,
  delay,
  getLastDayOfActivePeriod,
};
