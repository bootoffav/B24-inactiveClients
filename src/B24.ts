import { stringify } from "qs";
import type { departId, Company } from "./types";

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

async function getCompanies(responsibleId: string): Promise<Company[]> {
  return await getAllData("crm.company.list", {
    order: { DATE_CREATE: "ASC" },
    filter: { ASSIGNED_BY_ID: responsibleId },
    select: ["ID", "TITLE"],
  });
}

async function getAllData(
  method: string,
  body: any,
  runOnce: boolean = false // for last activity
): Promise<any[]> {
  let next = 0;
  let wholeResult: any = [];
  while (next !== undefined) {
    const [chunk, currentNext]: any = await fetch(
      B24Config.hostname + B24Config.hook + method,
      {
        method: "post",
        body: stringify({
          ...body,
          start: next,
        }),
      }
    )
      .then((r) => r.json())
      .then((res) => [res.result, res.next])
      .catch(() => []);
    wholeResult = wholeResult.concat(chunk);
    next = currentNext;
    if (runOnce) break;
  }

  return wholeResult;
}

async function getActivities(
  ownerId: string,
  ownerTypeId: number
): Promise<any> {
  const allActivities = await getAllData(
    "crm.activity.list",
    {
      order: { ID: "DESC" },
      FILTER: {
        OWNER_TYPE_ID: ownerTypeId,
        OWNER_ID: ownerId,
      },
    },
    true
  );

  return allActivities[0];
}

export { getEmployees, getCompanies, getActivities };
