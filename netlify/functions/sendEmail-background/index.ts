import { Handler } from "@netlify/functions";
import { parse } from "qs";
import proceeding from "../../../src/proceeding";
import sendEmail from "./sendEmail";

const handler: Handler = async function (event, context) {
  const { inactivityPeriod, id, email } = parse(event.body);

  // gather data
  for await (const [type, payload] of proceeding({
    id: id as string,
    inactivityPeriod: inactivityPeriod as string,
  })) {
    if (typeof payload[0] !== "number" && typeof payload[1] !== "number") {
      console.log(type, payload);
    }
  }

  // create template

  // send email
  sendEmail(email as string);

  return {
    statusCode: 202,
  };
};

export { handler };

// attachments: [
//   {
//     filename: `report-${new Date().toDateString()}.pdf`,
//     content: report,
//     contentType: "application/pdf",
//   },
// ],
