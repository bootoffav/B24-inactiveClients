import { isManager } from "./helpers";

it("checks if User is a Manager", () => {
  expect(isManager()).toBe(false);
  expect(isManager("maxim@xmtextiles.com")).toBe(true);
  expect(isManager("admin@xmtextiles.com")).toBe(true);
  expect(isManager("anzelika@xmtextiles.eu")).toBe(true);
  expect(isManager("lilija@xmtextiles.eu")).toBe(false);
  expect(isManager("jurgita@xmtextiles.eu")).toBe(false);
});
