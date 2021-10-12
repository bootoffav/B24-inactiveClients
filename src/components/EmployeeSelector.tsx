import { getEmployees } from "../B24";
import { useState, useEffect } from "react";
import type { departId } from "../types";

type EmployeeSelectorProps = {
  departId?: departId;
  changeEmployeeId: any;
};

function EmployeeSelector({
  departId,
  changeEmployeeId,
}: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<[]>([]);
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
        onChange={({ target }: React.BaseSyntheticEvent) => {
          changeEmployeeId(target.value);
        }}
      >
        <option></option>
        {employees.map(({ ID, NAME }: any) => (
          <option key={ID} value={ID}>
            {NAME}
          </option>
        ))}
      </select>
    </div>
  );
}

export { EmployeeSelector };
