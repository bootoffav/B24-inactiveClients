import React, { useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { departId } from "../types";

type FormProps = {
  process: any;
  isLoading: boolean;
};

const departmentMap = {
  "Sales Lithuania": 8640,
  "XM Textiles Brazil": 113,
  "XM Textiles Hungary": 8596,
  "XM Textiles Italy": 8560,
  "XM Textiles Kazakhstan": 8618,
  "XM Textiles Portugal": 8520,
  "XM Textiles Romania": 8496,
  "XM Textiles Russia": 8622,
  "XM Textiles Spain": 8470,
  "XM Textiles Turkey": 8638,
  "XM Textiles UK": 8625,
};

function Form({ process, isLoading }: FormProps) {
  const [departId, setDepartId] = useState<departId>();
  const [employeeId, setEmployeeId] = useState<string>();
  const [inactivityPeriod, setInactivityPeriod] = useState<
    string | undefined
  >();

  return (
    <form
      method="post"
      className="columns"
      onSubmit={(e) =>
        process({
          event: e,
          employeeId,
          inactivityPeriod,
        })
      }
    >
      <div className="column">
        <label htmlFor="department" aria-label="department">
          Choose department:
          <div className="select is-fullwidth">
            <select
              className="is-focused"
              required
              id="department"
              onChange={({ target }: React.BaseSyntheticEvent) =>
                setDepartId((target as HTMLInputElement).value as departId)
              }
            >
              <option></option>
              {Object.entries(departmentMap).map(([label, id]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
      <div className="column">
        <label htmlFor="employee" aria-label="employee">
          Choose employee:
          <EmployeeSelector
            departId={departId}
            changeEmployeeId={setEmployeeId}
          />
        </label>
      </div>
      <div className="column">
        <label htmlFor="inactivePeriod" aria-label="inactive period">
          Inactive period:
          <div className="select is-fullwidth">
            <select
              required
              id="inactivePeriod"
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
        <button
          type="submit"
          className={`button is-info is-fullwidth  ${
            isLoading ? "is-loading" : ""
          }`}
          disabled={isLoading}
        >
          GET
        </button>
      </div>
    </form>
  );
}

export { Form };
