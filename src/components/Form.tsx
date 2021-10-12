import React, { useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { AppState, departId } from "../types";

type FormProps = {
  changeAppState: (newState: AppState) => void;
};

function Form({ changeAppState }: FormProps) {
  function process(e: React.FormEvent) {
    e.preventDefault();
    changeAppState("started");
  }

  const [departId, setDepartId] = useState<departId | undefined>();
  // eslint-disable-next-line
  const [employeeId, setEmployeeId] = useState<string>();
  // eslint-disable-next-line
  const [inactivityPeriod, setInactivityPeriod] = useState<
    string | undefined
  >();

  return (
    <form method="post" className="columns" onSubmit={process}>
      <div className="column">
        <label>
          Choose department:
          <div className="select is-fullwidth">
            <select
              className="is-focused"
              required
              onChange={({ target }: React.BaseSyntheticEvent) => {
                setDepartId(target.value as departId);
              }}
            >
              <option></option>
              <option value="8640">Sales Lithuania</option>
              <option value="8496">XM Textiles Romania</option>
            </select>
          </div>
        </label>
      </div>
      <div className="column">
        <label>
          Choose employee:
          <EmployeeSelector
            departId={departId}
            changeEmployeeId={(id: string) => setEmployeeId(id)}
          />
        </label>
      </div>
      <div className="column">
        <label>
          Inactive period:
          <div className="select is-fullwidth">
            <select
              required
              onChange={({ target }: React.BaseSyntheticEvent) => {
                setInactivityPeriod(target.value);
              }}
            >
              <option></option>
              <option value="90">last 3 months</option>
              <option value="183">last 6 months</option>
            </select>
          </div>
        </label>
      </div>
      <div className="column is-flex is-align-items-flex-end">
        <input
          type="submit"
          className="button is-info is-fullwidth"
          value="GET"
        />
      </div>
    </form>
  );
}

export { Form };
