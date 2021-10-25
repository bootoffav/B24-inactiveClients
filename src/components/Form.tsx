import React, { useEffect, useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { departId } from "../types";
import { Department, getDepartments } from "../B24";

type FormProps = {
  process: any;
  isLoading: boolean;
};

function Form({ process, isLoading }: FormProps) {
  const [departId, setDepartId] = useState<departId>();
  const [employeeId, setEmployeeId] = useState<string>();
  const [inactivityPeriod, setInactivityPeriod] = useState<string>("6 month");
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    (async () => {
      setDepartments(await getDepartments());
    })();
  }, []);

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
          <div
            className={`select is-fullwidth ${
              departments.length ? "" : "is-loading"
            }
          `}
          >
            <select
              className="is-focused"
              required
              id="department"
              onChange={({ target }: React.BaseSyntheticEvent) =>
                setDepartId((target as HTMLInputElement).value as departId)
              }
            >
              <option></option>
              {departments.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
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
          <div
            data-tooltip="Choose time period for which clients have not been contacted by the employee"
            className="select is-fullwidth"
          >
            <select
              required
              id="inactivePeriod"
              onChange={({ target }: React.BaseSyntheticEvent) => {
                setInactivityPeriod(target.value);
              }}
              defaultValue={inactivityPeriod}
            >
              <option></option>
              <option value="1 month">last month</option>
              <option value="3 month">last 3 months</option>
              <option value="6 month">last 6 months</option>
              <option value="1 year">1 year</option>
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
