import Select from "react-select";
import React, { useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { AppState, departId } from "../types";

type FormProps = {
  changeAppState: (newState: AppState) => void;
};

function Form({ changeAppState }: FormProps) {
  function process(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) {
      changeAppState("error");
      return;
    }
    changeAppState("started");
  }

  const departments = [
    { value: "8640", label: "Sales Lithuania" },
    { value: "8496", label: "XM Textiles Romania" },
  ];
  const inactivePeriods = [
    { value: "90", label: "3 months" },
    { value: "183", label: "6 months" },
  ];
  const [departId, setDepartId] = useState<departId | undefined>();
  const [employeeId, setEmployeeId] = useState<string>();
  const [inactivityPeriod, setInactivityPeriod] = useState<
    string | undefined
  >();

  return (
    <form method="post" className="columns" onSubmit={process}>
      <div className="column">
        <label>
          Choose department:
          <Select
            autoFocus
            options={departments}
            onChange={(e) => e && setDepartId(e.value as departId)}
          />
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
          <Select
            value={inactivePeriods[1]}
            options={inactivePeriods}
            onChange={(e) => setInactivityPeriod(e?.value)}
          />
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
