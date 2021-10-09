import Select from "react-select";
import { getEmployees } from "../B24";
import { useState, useEffect } from "react";
import type { departId } from "../B24";

function EmployeeSelector({ departId }: { departId?: departId }) {
  const [employees, setEmployees] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    departId &&
      (async () => {
        setIsLoading(true);
        setEmployees(await getEmployees(departId));
        setIsLoading(false);
      })();
  }, [departId, setEmployees]);

  return (
    <Select isDisabled={!departId} isLoading={isLoading} options={employees} />
  );
}

export { EmployeeSelector };
