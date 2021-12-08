import { parse } from "qs";
import processing from "../../src/processing";
import sendEmail from "./sendEmail";
import getExcelFile from "../../src/components/Export/ExcelGeneration";
import { CorporateEmail, Employee, InActiveData } from "../../src/types";
import generateBody from "./generateBody";

const handler = async function (event) {
  const { inactivityPeriod, employee, email, entityToCheck } = parse(
    event.body
  ) as {
    employee: Employee;
    inactivityPeriod: string;
    entityToCheck: keyof InActiveData;
    email: CorporateEmail;
  };
  let inActiveEntities = [];

  for await (const [_, payload] of processing({
    employee,
    inactivityPeriod,
    entityToCheck,
  })) {
    if (typeof payload[0] !== "number" && typeof payload[1] !== "number") {
      inActiveEntities = [...inActiveEntities, ...payload];
    } else {
      console.log(payload);
    }
  }

  const excelFile = getExcelFile({
    inActiveEntities,
    name: employee.name,
    type: entityToCheck,
  });

  const html = generateBody(inActiveEntities, entityToCheck);
  sendEmail(excelFile, html, email, entityToCheck, employee.name);
  return {
    statusCode: 202,
  };
};

export { handler };
