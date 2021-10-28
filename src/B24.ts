import { stringify } from "qs";
import type { departId, Entity, Employee, InActiveData } from "./types";
import fetch from "cross-fetch";

interface RawEmployee extends Employee {
  ACTIVE: boolean;
  LAST_NAME: string;
  EMAIL: string;
}

const B24Config = {
  hostname: process.env.REACT_APP_B24_HOSTNAME || "",
  hook: process.env.REACT_APP_B24_HOOK || "",
};

export type Department = { name: string; id: string };
/**
 *
 * @param ids departmentIds taken from B24 company structure
 * @returns array of department names and their respective ids
 */
async function getDepartments(
  ids = [8640, 113, 8596, 8560, 8618, 8520, 8496, 8622, 8470, 8638, 8625]
): Promise<Department[]> {
  let departments: Department[] = [];

  for (const ID of ids) {
    await fetch(B24Config.hostname + B24Config.hook + "department.get", {
      method: "post",
      body: stringify({
        ID,
      }),
    })
      .then((r) => r.json())
      .then(({ result }) => {
        if (result.length === 1) {
          const { ID, NAME } = result[0];
          departments.push({ name: NAME, id: ID });
        }
      });
  }

  return departments;
}

async function getEmployees(depart: departId): Promise<Employee[]> {
  return await getAllData("user.get", {
    FILTER: { UF_DEPARTMENT: depart },
  })
    .then((rawEmployees: RawEmployee[]) => {
      return rawEmployees
        .filter((employee) => employee.ACTIVE)
        .map(({ ID, NAME, LAST_NAME, EMAIL }) => ({
          ID,
          NAME: `${NAME} ${LAST_NAME}`,
          email: EMAIL,
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
    ORDER: { DATE_CREATE: "ASC" },
    FILTER: { ASSIGNED_BY_ID: responsibleId },
    SELECT: selectMap[type],
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
    ORDER?: {};
    FILTER?: {};
    SELECT?: string[];
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

export { getEmployees, getEntities, getAllData, getDepartments };
