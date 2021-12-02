import React, { useEffect, useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { isManager } from "../helpers";
import type {
  departId,
  Employee,
  ProcessingProps,
  CorporateEmail,
  CompanyStatusType,
  InActiveData,
} from "../types";
import { Department, getDepartments } from "../B24";
import { useAuth0 } from "@auth0/auth0-react";
import { CompanyStatus } from "./CompanyStatus/CompanyStatus";
import EntityChecking from "./EntityChecking/EntityChecking";
import GetButton from "./SubmitButtons/GetButton/GetButton";
import SendToEmailButton from "./SubmitButtons/SendToEmailButton/SendToEmailButton";

type FormProps = {
  process: (props: ProcessingProps) => Promise<void>;
  isLoading: boolean;
  abort: () => void;
};

function Form({ process, isLoading, abort }: FormProps) {
  const [departId, setDepartId] = useState<departId>();
  const [employee, setEmployee] = useState<Employee>();
  const [entityToCheck, setEntityToCheck] =
    useState<keyof InActiveData>("company");
  const [inactivityPeriod, setInactivityPeriod] = useState<string>("6 month");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companyStatuses, setCompanyStatuses] = useState<CompanyStatusType[]>();
  const [started, setStarted] = useState(false);

  const { user } = useAuth0();

  useEffect(() => {
    (async () => {
      setDepartments(await getDepartments());
    })();
  }, []);

  return (
    <form
      method="post"
      className="is-variable is-1"
      onSubmit={(event) => {
        event.preventDefault();
        setStarted(true);
        const destination =
          ((event.nativeEvent as SubmitEvent).submitter?.dataset.destination as
            | "web"
            | "mail") ?? "web";
        if (employee) {
          process({
            employee,
            inactivityPeriod,
            companyStatuses,
            entityToCheck,
            destination,
          }).finally(() => setStarted(false));
        }
      }}
    >
      <div className="columns">
        {isManager(user?.email as CorporateEmail) && (
          <div className={`column`}>
            <label htmlFor="department" aria-label="department">
              Choose department:
              <div
                className={`select is-fullwidth ${
                  departments.length ? "" : "is-loading"
                }
          `}
              >
                <select
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
        <div className="column">
          <label htmlFor="employee" aria-label="employee">
            Choose employee:
            <EmployeeSelector
              departId={departId}
              singleUser={
                isManager(user?.email as CorporateEmail)
                  ? undefined
                  : (user?.email as CorporateEmail)
              }
              changeEmployee={setEmployee}
            />
          </label>
        </div>
        <div className="column">
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
      </div>
      <div className="columns">
        <div className="column is-4">
          <EntityChecking
            entityToCheck={entityToCheck}
            setEntityToCheck={setEntityToCheck}
          />
        </div>
        <div className="column is-4">
          <CompanyStatus
            setCompanyStatuses={setCompanyStatuses}
            entityToCheck={entityToCheck}
          />
        </div>
        <div className="column is-2 is-flex is-align-items-end">
          <GetButton abort={abort} started={started} setStarted={setStarted} />
        </div>
        <div className="column is-2 is-flex is-align-items-end">
          <SendToEmailButton />
        </div>
      </div>
    </form>
  );
}

export default Form;
export type { FormProps };
