import { getLastDayOfActivePeriod } from "./helpers";

it("get last day of active period", () => {
  const lastDay = getLastDayOfActivePeriod("6", "months");

  //   console.log(lastDay);
  //   expect(lastDay.format("YYYY-MM-DD")).toBe("2021-05-11");
});
