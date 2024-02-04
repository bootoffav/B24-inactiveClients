import {
  Activity,
  InActiveData,
  CorporateEmail,
  InactivityPeriod,
} from "./types";
import { isAfter, sub } from "date-fns";

const isManager = (userEmail?: CorporateEmail): boolean => {
  const ManagerEmails = JSON.parse(process.env.REACT_APP_MANAGERS ?? "");
  return !!ManagerEmails.find((email: CorporateEmail) => email === userEmail);
};

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

function isInActiveEntity(
  { LAST_UPDATED }: Activity,
  inactivityPeriod: InactivityPeriod
): Boolean {
  const [amount, unit] = inactivityPeriod;
  return isAfter(
    sub(new Date(), {
      [unit]: +amount,
    }), // last day to be active
    LAST_UPDATED
  );
}

export { isInActiveEntity, pluralMap, inActivityDataTypes, delay, isManager };
