import dayjs from "dayjs";

const today = dayjs();

function isOutOfActivityPeriod(
  activity: any,
  inactivityPeriod: string
): Boolean {
  const lastPossibleDayForBeingActive = today.subtract(
    Number(inactivityPeriod),
    "days"
  );
  return lastPossibleDayForBeingActive.isAfter(activity.LAST_UPDATED);
}

export { isOutOfActivityPeriod };
