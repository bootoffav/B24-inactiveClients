import Select from "react-select";
import { getEmployees } from "../B24";
import { useState } from "react";
import { EmployeeSelector } from "./EmployeeSelector";

function Form() {
  const departments = [
    { value: "8640", label: "Sales Lithuania" },
    { value: "8496", label: "XM Textiles Romania" },
  ];

  const [employees, setEmployess] = useState<any>([]);

  return (
    <div className="columns">
      <div className="column is-two-fifths">
        <label>
          Choose department:
          <Select
            autoFocus
            options={departments}
            onChange={async ({ value: departId }: any) => {
              setEmployess(await getEmployees(departId));
            }}
          />
        </label>
      </div>
      <div className="column">
        <label>
          Choose employee:
          <EmployeeSelector employees={employees} />
        </label>
      </div>
      <div className="column">Auto</div>
    </div>
  );
}

export { Form };
