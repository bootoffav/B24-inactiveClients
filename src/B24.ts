import { stringify } from "qs";
import type { departId, Entity, Employee, InActiveData } from "./types";

interface RawEmployee extends Employee {
  ACTIVE: boolean;
  LAST_NAME: string;
}

const B24Config = {
  hostname: process.env.REACT_APP_B24_HOSTNAME || "",
  hook: process.env.REACT_APP_B24_HOOK || "",
};

async function getEmployees(depart: departId): Promise<Employee[]> {
  return await getAllData("user.get", {
    filter: { UF_DEPARTMENT: depart },
  })
    .then((rawEmployees: RawEmployee[]) => {
      return rawEmployees
        .filter((employee) => employee.ACTIVE)
        .map(({ ID, NAME, LAST_NAME }) => ({
          ID,
          NAME: `${NAME} ${LAST_NAME}`,
        }));
    })
    .catch(() => []);
}

async function getEntities(
  type: keyof InActiveData & string,
  responsibleId: string
): Promise<Entity[]> {
  const selectMap = {
    company: ["ID", "TITLE"],
    contact: ["ID", "NAME", "LAST_NAME"],
    lead: ["ID", "NAME", "LAST_NAME", "TITLE"],
  };

  return await getAllData(`crm.${type}.list`, {
    order: { DATE_CREATE: "ASC" },
    filter: { ASSIGNED_BY_ID: responsibleId },
    select: selectMap[type],
  }).then((entities) => {
    if (type === "contact") {
      return entities.map(
        (entity: Entity & { NAME: string; LAST_NAME: string }) => ({
          ID: entity.ID,
          TITLE: `${entity.NAME} ${entity.LAST_NAME}`,
        })
      );
    }
    return entities;
  });
}

async function getAllData(
  method: string,
  body: {
    order?: {};
    filter?: {};
    select?: string[];
  },
  runOnce: boolean = false // for last activity
): Promise<any[]> {
  let next = 0;
  let wholeResult: any[] = [];
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
  type: keyof InActiveData
): Promise<any> {
  const ownerTypeIdMap = {
    company: 4,
    contact: 3,
    lead: 1,
  };
  const allActivities = await getAllData(
    "crm.activity.list",
    {
      order: { ID: "DESC" },
      filter: {
        OWNER_TYPE_ID: ownerTypeIdMap[type],
        OWNER_ID: ownerId,
      },
    },
    true
  );

  return allActivities[0];
}

export { getEmployees, getEntities, getActivities };
