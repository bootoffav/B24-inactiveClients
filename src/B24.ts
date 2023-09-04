import { stringify } from "qs";
import type {
  userRelatedCRMEntities,
  departId,
  Entity,
  InActiveData,
  RawEmployee,
  Employee,
  RawEntity,
  CorporateEmail,
  CompanyStatusType,
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
  ids = [
    8640, 113, 8596, 8560, 8618, 8978, 8520, 8496, 8622, 8470, 8638, 8625, 9014,
    8421,
  ]
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
  type: (keyof InActiveData & string) | "deal",
  responsibleId: `${number}`,
  statuses?: CompanyStatusType[]
): Promise<Entity[]> {
  const selectMap = {
    company: ["ID", "TITLE", COMPANY_STATUS_CRM_FIELD], //UF_CRM used to provide Status: Potential, Working, Not Working.
    contact: ["ID", "NAME", "LAST_NAME", "COMPANY_ID"],
    lead: ["ID", "NAME", "LAST_NAME", "TITLE", "COMPANY_ID"],
    deal: ["ID", "TITLE", "COMPANY_ID"],
  };
  let rawEntities: RawEntity[] = [];

  if (type === "company" && statuses) {
    // if status has some values request those companies, do concatenation
    for (const status of statuses) {
      const currentRawEntities = await getAllData(`crm.${type}.list`, {
        ORDER: { DATE_CREATE: "ASC" },
        FILTER: {
          ASSIGNED_BY_ID: responsibleId,
          [COMPANY_STATUS_CRM_FIELD]: status,
        },
        SELECT: selectMap[type],
      });
      rawEntities = [...rawEntities, ...currentRawEntities];
    }
  } else {
    // statuses === undefined do by default
    rawEntities = await getAllData(`crm.${type}.list`, {
      ORDER: { DATE_CREATE: "ASC" },
      FILTER: {
        ASSIGNED_BY_ID: responsibleId,
      },
      SELECT: selectMap[type],
    });
  }

  // @ts-ignore
  // const getTitle = (NAME, LAST_NAME) =>
  //   `${NAME ?? ""}${LAST_NAME ? ` ${LAST_NAME}` : ""}`;

  // const entities =
  //   type === "contact"
  //     ? (rawEntities as ContactEntity[]).map(
  //         ({ NAME, LAST_NAME, ...entity }) => {
  //           return {
  //             id: entity.ID,
  //             companyId: entity.COMPANY_ID,
  //             title: `${NAME ?? ""}${LAST_NAME ? ` ${LAST_NAME}` : ""}`,
  //           };
  //         }
  //       )
  //     : rawEntities.map((entity) => ({ id: entity.ID, title: entity.TITLE }));

  if (type === "company") {
    return rawEntities.map((entity) => ({
      id: entity.ID,
      title: entity.TITLE,
    }));
  }

  if (type === "contact") {
    return (rawEntities as ContactEntity[]).map(
      ({ NAME, LAST_NAME, ...entity }) => {
        return {
          id: entity.ID,
          companyId: entity.COMPANY_ID,
          title: `${NAME ?? ""}${LAST_NAME ? ` ${LAST_NAME}` : ""}`,
        };
      }
    );
  } else {
    return rawEntities.map((entity) => ({
      id: entity.ID,
      companyId: entity.COMPANY_ID,
      title: entity.TITLE,
    }));
  }

  // const entities =
  //   type === "contact"
  //     ? (rawEntities as ContactEntity[]).map(
  //         ({ NAME, LAST_NAME, ...entity }) => {
  //           return {
  //             id: entity.ID,
  //             companyId: entity.COMPANY_ID,
  //             title: `${NAME ?? ""}${LAST_NAME ? ` ${LAST_NAME}` : ""}`,
  //           };
  //         }
  //       )
  //     : rawEntities.map((entity) => ({ id: entity.ID, title: entity.TITLE }));

  // return entities;
}

type Filter = {
  [Prop in
    | "ID"
    | "UF_DEPARTMENT"
    | "EMAIL"
    | "ASSIGNED_BY_ID"
    | "COMPANY_ID"
    | "OWNER_TYPE_ID"
    | typeof COMPANY_STATUS_CRM_FIELD
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

async function getUserRelatedCRMEntities(
  responsibleId: `${number}`
): Promise<userRelatedCRMEntities> {
  const contact = await getEntities("contact", responsibleId);
  const deal = await getEntities("deal", responsibleId);
  const lead = await getEntities("lead", responsibleId);

  return {
    contact,
    deal,
    lead,
  };
}

export {
  getEmployees,
  getEntities,
  getAllData,
  getDepartments,
  getUserRelatedCRMEntities,
};
