export type departId = "8640" | "8496";

export type AppState = "initial" | "started" | "finished" | "emailed";

export interface ProcessingProps {
  employee: Employee;
  inactivityPeriod: string;
}

export type Output = "screen" | "email";

export interface Employee {
  ID: string;
  NAME: string;
  email: string;
}

export interface Activity {
  ID: string;
  ASSOCIATED_ENTITY_ID: string;
  RESPONSIBLE_ID: string;
  LAST_UPDATED: string;
  PROVIDER_TYPE_ID: string;
  SUBJECT: string;
}

export type Entity = {
  ID: string;
  TITLE: string;
  lastActivity?: Activity;
};

export interface InActiveData {
  company: Entity[];
  contact: Entity[];
  lead: Entity[];
}

export type ProgressTuple = [number, number];
