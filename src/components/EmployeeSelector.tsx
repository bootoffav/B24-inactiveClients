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
    if (departId) {
      setIsLoading(true);
      getEmployees(departId)
        .then(setEmployees)
        .finally(() => setIsLoading(false));
    }
  }, [departId, setIsLoading]);

  return (
    <div className={`select is-fullwidth ${isLoading ? "is-loading" : ""}`}>
      <select
        disabled={!departId}
        required
        id="employee"
        onChange={({ target: { value: id } }: React.BaseSyntheticEvent) => {
          const employee = employees.find((empl) => empl.id === id);
          changeEmployee(employee as Employee);
        }}
      >
        <option></option>
        {employees.map(({ id, name }) => {
          return (
            <option key={id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export { EmployeeSelector };
