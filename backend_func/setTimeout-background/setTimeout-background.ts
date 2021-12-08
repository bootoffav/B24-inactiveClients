import { Handler } from "@netlify/functions";
import { delay } from "../../src/helpers";

export const handler: Handler = async (event, context) => {
  const { name = "stranger" } = event.queryStringParameters;

  for (let i = 0; i < 10; i++) {
    await delay();
    console.log(i);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  };
};
