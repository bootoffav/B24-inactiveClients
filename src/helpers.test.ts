import { getLastDayOfActivePeriod, isManager } from "./helpers";

// it("get last day of active period", () => {
// const lastDay = getLastDayOfActivePeriod("6", "months");

//   console.log(lastDay);
//   expect(lastDay.format("YYYY-MM-DD")).toBe("2021-05-11");
// });

it("checks if User is a Manager", () => {
  expect(isManager()).toBe(false);
  expect(isManager("maxim@xmtextiles.com")).toBe(true);
  expect(isManager("admin@xmtextiles.com")).toBe(true);
  expect(isManager("anzelika@xmtextiles.eu")).toBe(true);
  expect(isManager("lilija@xmtextiles.eu")).toBe(false);
  expect(isManager("jurgita@xmtextiles.eu")).toBe(false);
});
