import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { CompanyStatusType, InActiveData } from "../../types";

const COMPANY_STATUS = {
  1257: "Potential",
  1259: "Working",
  1261: "Not working",
} as const;

const initCompanyStatuses = Object.entries(COMPANY_STATUS).map(
  ([id, status]) => ({
    status,
    id: id as CompanyStatusType,
  })
);

type CompanyStatusProps = {
  entityToCheck: keyof InActiveData;
  setCompanyStatuses: (ids?: CompanyStatusType[]) => void;
};

function CompanyStatus({
  setCompanyStatuses,
  entityToCheck,
}: CompanyStatusProps) {
  const [checkboxState, setCheckboxState] = useState(false);
  const [options, setOptions] = useState(initCompanyStatuses);

  useEffect(() => {
    if (!checkboxState) {
      setOptions(initCompanyStatuses);
      setCompanyStatuses();
    }
  }, [checkboxState, setCompanyStatuses]);

  useEffect(() => {
    if (entityToCheck !== "company") {
      setCheckboxState(false);
    }
  }, [entityToCheck]);

  const changeOptions = (list: typeof initCompanyStatuses) => {
    setOptions(list);
    setCompanyStatuses(list.map(({ id }) => id));
  };

  return (
    <>
      <label
        className="checkbox"
        data-tooltip="Additional filter by company status field"
      >
        <input
          type="checkbox"
          checked={checkboxState}
          onChange={() => setCheckboxState(!checkboxState)}
          disabled={entityToCheck !== "company"}
        />{" "}
        Check by company status:
      </label>
      <Multiselect
        emptyRecordMsg="All options chosen"
        avoidHighlightFirstOption
        hidePlaceholder
        options={initCompanyStatuses}
        selectedValues={options}
        onRemove={changeOptions}
        onSelect={changeOptions}
        disablePreSelectedValues={!checkboxState}
        displayValue="status"
      />
    </>
  );
}

export { CompanyStatus };
