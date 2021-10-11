import Select from "react-select";
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
  const [selectedEmployee, setSelectedEmployee] = useState<{
    value: "";
    label: "";
  } | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedEmployee(null);
    changeEmployeeId();
    // eslint-disable-next-line
  }, [departId]);

  useEffect(() => {
    departId &&
      (async () => {
        setIsLoading(true);
        setEmployees(await getEmployees(departId));
        setIsLoading(false);
      })();
  }, [departId]);

  return (
    <Select
      value={selectedEmployee}
      isDisabled={!departId}
      isLoading={isLoading}
      options={employees}
      onChange={(selected: any) => {
        setSelectedEmployee(selected);
        changeEmployeeId(selected.value);
      }}
    />
  );
}

export { EmployeeSelector };
