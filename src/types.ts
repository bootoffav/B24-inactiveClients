declare global {
  interface Window {
    aborted: boolean;
  }
}

export type departId = `${number}`;

export type CompanyStatusType = "1257" | "1259" | "1261";

export type AppState =
  | "initial"
  | "started"
  | "finished"
  | "emailed"
  | "aborted";

export interface ProcessingProps {
  readonly employee: Employee;
  readonly inactivityPeriod: string;
  readonly companyStatuses?: CompanyStatusType[];
  readonly entityToCheck: keyof InActiveData;
}

export interface ProcessProps extends ProcessingProps {
  readonly destination: "web"; // | "mail";
}

export type CorporateEmail = `${string}@xmtextiles.${"com" | "eu"}`;
export type Output = "screen" | "email";

export type RawEmployee = {
  readonly [Prop in "NAME" | "LAST_NAME" | "EMAIL"]: string;
} & { ACTIVE: boolean; ID: `${number}` };

export type Employee = {
  [Prop in keyof Pick<
    RawEmployee,
    "ID" | "NAME" | "EMAIL"
  > as `${Lowercase<Prop>}`]: RawEmployee[Prop];
};

export type RawEntity = {
  readonly ID: `${number}`;
  readonly TITLE: string;
  readonly COMPANY_ID?: `${number}`;
};

export type userRelatedCRMEntities = {
  contact: Entity[];
  deal: Entity[];
  lead: Entity[];
};

export type Entity = {
  readonly id: `${number}`;
  readonly title: string;
  readonly companyId?: `${number}`;
} & { lastActivity?: Activity };

export type Activity = {
  [Prop in
    | "ASSOCIATED_ENTITY_ID"
    | "RESPONSIBLE_ID"
    | "LAST_UPDATED"
    | "PROVIDER_TYPE_ID"
    | "SUBJECT"]: string;
} & { ID: `${number}` };

export interface InActiveData {
  readonly company: Entity[];
  readonly contact: Entity[];
  readonly lead: Entity[];
}

export type ProgressTuple = [number, number];
