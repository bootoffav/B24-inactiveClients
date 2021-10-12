import { stringify } from "qs";
import type { departId } from "./types";

const B24Config = {
  hostname: process.env.REACT_APP_B24_HOSTNAME || "",
  hook: process.env.REACT_APP_B24_HOOK || "",
};

async function getEmployees(depart: departId): Promise<[]> {
  return await fetch(B24Config.hostname + B24Config.hook + "user.get", {
    method: "post",
    body: stringify({
      FILTER: { UF_DEPARTMENT: depart },
    }),
  })
    .then((r) => r.json())
    .then(({ result }: any) =>
      result
        .filter((employee: any) => employee.ACTIVE)
        .map(({ ID, NAME, LAST_NAME }: any) => ({
          ID,
          NAME: `${NAME} ${LAST_NAME}`,
        }))
    )
    .catch(() => []);
}

export { getEmployees };
