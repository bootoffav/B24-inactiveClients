import React from "react";

export type departId = "8640" | "8496";

export type AppState = "initial" | "started" | "finished";

export interface ProcessProps {
  employeeId: string;
  event: React.SyntheticEvent;
  inactivityPeriod: string;
}

export type Company = {
  ID: string;
  TITLE: string;
};
