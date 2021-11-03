import { getEmployees } from "../B24";
import { useState, useEffect } from "react";
import type { departId, Employee, CorporateEmail } from "../types";

type EmployeeSelectorProps = {
  departId?: departId;
  singleUser?: CorporateEmail;
  changeEmployee: (employee: Employee) => void;
};

function EmployeeSelector({
  departId,
  singleUser,
  changeEmployee,
}: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (departId) {
      setIsLoading(true);
      getEmployees({ value: departId, type: "manager" })
        .then(setEmployees)
        .finally(() => setIsLoading(false));
    } else if (singleUser) {
      setIsLoading(true);
      getEmployees({ value: singleUser, type: "employee" })
        .then((employees) => {
          changeEmployee(employees[0]);
          return employees;
        })
        .then(setEmployees)
        .finally(() => setIsLoading(false));
    }
  }, [departId, singleUser, changeEmployee, setIsLoading]);

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
        value={employees.length === 1 ? employees[0].id : undefined}
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
