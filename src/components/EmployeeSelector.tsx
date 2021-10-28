import { getEmployees } from "../B24";
import { useState, useEffect } from "react";
import type { departId, Employee } from "../types";

type EmployeeSelectorProps = {
  departId?: departId;
  changeEmployee: (employee: Employee) => void;
};

function EmployeeSelector({ departId, changeEmployee }: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    departId &&
      (async () => {
        setIsLoading(true);
        setEmployees(await getEmployees(departId));
        setIsLoading(false);
      })();
  }, [departId]);

  return (
    <div className={`select is-fullwidth ${isLoading ? "is-loading" : ""}`}>
      <select
        disabled={!departId}
        required
        id="employee"
        onChange={({ target: { value: id } }: React.BaseSyntheticEvent) => {
          const employee = employees.find((empl) => empl.ID === id);
          changeEmployee(employee as Employee);
        }}
      >
        <option></option>
        {employees.map(({ ID, NAME }) => {
          return (
            <option key={ID} value={ID}>
              {NAME}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export { EmployeeSelector };
