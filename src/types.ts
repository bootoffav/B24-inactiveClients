import React from "react";
import { inActivityDataTypes } from "./helpers";

export type departId = "8640" | "8496";

export type AppState = "initial" | "started" | "finished";

export interface ProcessProps {
  employeeId: string;
  event: React.SyntheticEvent;
  inactivityPeriod: string;
}

export interface Employee {
  ID: string;
  NAME: string;
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
