export type departId = `${number}`;

export type AppState = "initial" | "started" | "finished" | "emailed";

export interface ProcessingProps {
  readonly employee: Employee;
  readonly inactivityPeriod: string;
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
};

export type Entity = {
  [Prop in keyof RawEntity as `${Lowercase<Prop>}`]: RawEntity[Prop];
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
