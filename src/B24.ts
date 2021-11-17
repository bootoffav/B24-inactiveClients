import { stringify } from "qs";
import type {
  departId,
  Entity,
  InActiveData,
  RawEmployee,
  Employee,
  RawEntity,
  CorporateEmail,
} from "./types";
import fetch from "cross-fetch";
import { COMPANY_STATUS_CRM_FIELD } from "./constants";

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

async function getEmployees({
  value,
  type,
}: {
  value: departId | CorporateEmail;
  type: "manager" | "employee";
}): Promise<Employee[]> {
  const FILTER = { [type === "manager" ? "UF_DEPARTMENT" : "EMAIL"]: value };
  return await getAllData("user.get", {
    FILTER,
  })
    .then((rawEmployees: RawEmployee[]) => {
      return rawEmployees
        .filter((employee) => employee.ACTIVE)
        .map(({ ID: id, NAME, LAST_NAME, EMAIL: email }) => ({
          id,
          name: `${NAME} ${LAST_NAME}`,
          email,
        }));
    })
    .catch(() => []);
}

type ContactEntity = RawEntity & {
  NAME: string | null;
  LAST_NAME: string | null;
};

async function getEntities(
  type: keyof InActiveData & string,
  responsibleId: `${number}`
): Promise<Entity[]> {
  const selectMap = {
    company: ["ID", "TITLE", COMPANY_STATUS_CRM_FIELD], //UF_CRM used to provide Status: Potential, Working, Not Working.
    contact: ["ID", "NAME", "LAST_NAME"],
    lead: ["ID", "NAME", "LAST_NAME", "TITLE"],
  };

  return await getAllData(`crm.${type}.list`, {
    ORDER: { DATE_CREATE: "ASC" },
    FILTER: { ASSIGNED_BY_ID: responsibleId },
    SELECT: selectMap[type],
  }).then((entities: RawEntity[]): Entity[] => {
    debugger;
    return type === "contact"
      ? (entities as ContactEntity[]).map(({ NAME, LAST_NAME, ...entity }) => ({
          id: entity.ID,
          title: `${NAME ?? ""}${LAST_NAME ? ` ${LAST_NAME}` : ""}`,
        }))
      : entities.map((entity) => ({ id: entity.ID, title: entity.TITLE }));
  });
}

type Filter = {
  [Prop in
    | "ID"
    | "UF_DEPARTMENT"
    | "EMAIL"
    | "ASSIGNED_BY_ID"
    | "COMPANY_ID"
    | "OWNER_TYPE_ID"
    | "OWNER_ID"]?: `${number}`;
};

async function getAllData(
  method: string,
  body: {
    ORDER?: {};
    FILTER?: Filter;
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
