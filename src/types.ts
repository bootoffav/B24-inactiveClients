import React from "react";

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
  LAST_UPDATED: string;
}

export type Entity = {
  ID: string;
  TITLE: string;
  lastActivity?: Activity;
};

export interface InActiveData {
  companies?: Entity[];
  contacts?: Entity[];
  leads?: Entity[];
}
