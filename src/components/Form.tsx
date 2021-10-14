import React, { useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { departId } from "../types";

type FormProps = {
  process: any;
  isLoading: boolean;
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
        <label>
          Choose department:
          <div className="select is-fullwidth">
            <select
              className="is-focused"
              required
              onChange={({ target }: React.BaseSyntheticEvent) =>
                setDepartId((target as HTMLInputElement).value as departId)
              }
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
            changeEmployeeId={setEmployeeId}
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
