import React, { useEffect, useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { departId, Employee, ProcessingProps, CorporateEmail } from "../types";
import { Department, getDepartments } from "../B24";
import { useAuth0 } from "@auth0/auth0-react";
import { CompanyStatus } from "./CompanyStatus";

type FormProps = {
  process: (props: ProcessingProps) => Promise<void>;
  isLoading: boolean;
  abort: () => void;
};

const ManagerEmails = JSON.parse(process.env.REACT_APP_MANAGERS ?? "");

const COMPANY_STATUS = {
  1257: "Potential",
  1259: "Working",
  1261: "Not working",
} as const;

function Form({ process, isLoading, abort }: FormProps) {
  const [departId, setDepartId] = useState<departId>();
  const [employee, setEmployee] = useState<Employee>();
  const [inactivityPeriod, setInactivityPeriod] = useState<string>("6 month");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [companyStatuses, setCompanyStatuses] = useState(
    Object.entries(COMPANY_STATUS).map(([id, status]) => ({
      status,
      id,
    }))
  );

  const { user } = useAuth0();

  useEffect(() => {
    (async () => {
      setDepartments(await getDepartments());
    })();
  }, []);

  const isManager = (): boolean => {
    return !!ManagerEmails.find(
      (email: CorporateEmail) => email === user?.email
    );
  };

  return (
    <form
      method="post"
      className="columns is-variable is-1"
      onSubmit={(event) => {
        event.preventDefault();
        setStarted(true);
        if (employee) {
          process({
            employee,
            inactivityPeriod,
          }).finally(() => setStarted(false));
        }
      }}
    >
      {isManager() && (
        <div className={`column is-2`}>
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
      )}
      <div className="column is-2">
        <label htmlFor="employee" aria-label="employee">
          Choose employee:
          <EmployeeSelector
            departId={departId}
            singleUser={
              isManager() ? undefined : (user?.email as CorporateEmail)
            }
            changeEmployee={setEmployee}
          />
        </label>
      </div>
      <div className="column is-2">
        <label
          htmlFor="inactivePeriod"
          aria-label="inactive period"
          data-tooltip="Choose time period for which clients have not been contacted by the employee"
        >
          Inactive period:
          <div className="select is-fullwidth">
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
      <div className="column">
        <CompanyStatus options={companyStatuses} />
      </div>
      <div className="column is-2 is-flex is-justify-content-space-evenly is-align-items-flex-end">
        {!started && (
          <button
            type="submit"
            className={`button mr-1 is-fullwidth is-info ${
              isLoading ? "is-loading" : ""
            }`}
            disabled={isLoading}
          >
            Get
          </button>
        )}
        {started && (
          <div className="buttons has-addons is-flex-grow-1">
            <button className="button is-info is-loading"></button>
            <button
              className="button is-info is-flex-grow-1"
              onClick={() => {
                abort();
                setStarted(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export default Form;

/* <button
          type="submit"
          className="button ml-1 is-fullwidth is-light"
          disabled={isLoading}
          value="email"
        >
          Send to email
        </button> */
