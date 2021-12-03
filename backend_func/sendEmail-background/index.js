import { parse } from "qs";
import processing from "../../src/processing";
import sendEmail from "./sendEmail";
import getExcelFile from "../../src/components/Export/ExcelGeneration";

const handler = async function (event, context) {
  const { inactivityPeriod, id, email, entityToCheck } = parse(event.body);
  let inActiveEntities = [];

  for await (const [_, payload] of processing({
    employee: {
      id,
    },
    inactivityPeriod,
    entityToCheck,
  })) {
    if (typeof payload[0] !== "number" && typeof payload[1] !== "number") {
      inActiveEntities = [...inActiveEntities, payload];
    }
    //  else {
    //   console.log(payload);
    // }
  }

  // console.log(inActiveEntities);
  const buffer = getExcelFile({
    inActiveEntities,
    name: "Stub",
    type: entityToCheck,
  });

  return {
    statusCode: 202,
  };
};

export { handler };
