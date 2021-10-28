import React, { useEffect, useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { departId, Employee } from "../types";
import { Department, getDepartments } from "../B24";
import netlifyIdentity from "netlify-identity-widget";

type FormProps = {
  process: any;
  isLoading: boolean;
};

function Form({ process, isLoading }: FormProps) {
  const [departId, setDepartId] = useState<departId>();
  const [employee, setEmployee] = useState<Employee>();
  const [inactivityPeriod, setInactivityPeriod] = useState<string>("6 month");
  const [departments, setDepartments] = useState<Department[]>([]);

  const supervisor =
    netlifyIdentity.currentUser()?.email !== "inactiveclients@xmtextiles.eu";
  useEffect(() => {
    (async () => {
      setDepartments(await getDepartments());
    })();
  }, []);

  return (
    <form
      method="post"
      className="columns"
      onSubmit={(event) => {
        event.preventDefault();
        const output = (event.nativeEvent as any).submitter.value;
        process({
          output,
          employee,
          inactivityPeriod,
        });
      }}
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
            // @ts-ignore
            changeEmployee={setEmployee}
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
      <div className="column is-flex is-justify-content-space-evenly is-align-items-flex-end">
        <button
          type="submit"
          className={`${
            supervisor ? "" : "is-hidden"
          } button mr-1 is-fullwidth is-info ${isLoading ? "is-loading" : ""}`}
          disabled={isLoading}
          value="screen"
        >
          GET
        </button>
        <button
          type="submit"
          className="button ml-1 is-fullwidth is-light"
          disabled={isLoading}
          value="email"
        >
          Send to email
        </button>
      </div>
    </form>
  );
}

export default Form;
