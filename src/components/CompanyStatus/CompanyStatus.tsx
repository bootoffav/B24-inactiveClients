import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { CompanyStatusType } from "../../types";

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
  setCompanyStatuses: (ids?: CompanyStatusType[]) => void;
};

function CompanyStatus({ setCompanyStatuses }: CompanyStatusProps) {
  const [checkboxState, setCheckboxState] = useState(false);
  const [options, setOptions] = useState(initCompanyStatuses);

  useEffect(() => {
    if (!checkboxState) {
      setOptions(initCompanyStatuses);
      setCompanyStatuses();
    }
  }, [checkboxState, setCompanyStatuses]);

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
