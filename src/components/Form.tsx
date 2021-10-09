import Select from "react-select";
import { useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";
import { departId } from "../B24";

function Form() {
  const departments = [
    { value: "8640", label: "Sales Lithuania" },
    { value: "8496", label: "XM Textiles Romania" },
  ];
  const inactivePeriods = [
    { value: "90", label: "3 months" },
    { value: "183", label: "6 months" },
  ];
  const [departId, setDepartId] = useState<departId | undefined>();
  const [inactivityPeriod, setInactivityPeriod] = useState<
    string | undefined
  >();

  return (
    <div className="columns">
      <div className="column">
        <label>
          Choose department:
          <Select
            autoFocus
            options={departments}
            onChange={({ value: departId }: any) => setDepartId(departId)}
          />
        </label>
      </div>
      <div className="column">
        <label>
          Choose employee:
          <EmployeeSelector departId={departId} />
        </label>
      </div>
      <div className="column">
        <label>
          Inactive period:
          <Select
            options={inactivePeriods}
            onChange={(e) => setInactivityPeriod(e?.value)}
          />
        </label>
      </div>
      <div className="column is-flex is-align-items-flex-end">
        <button
          className="button is-info is-fullwidth"
          onClick={() => process()}
        >
          GET
        </button>
      </div>
    </div>
  );
}

function process() {
  console.log("begin");
}
export { Form };
