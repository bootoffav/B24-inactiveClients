import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";

type CompanyStatusProps = {
  options: {
    status: string;
    id: string;
  }[];
};

function CompanyStatus({ options }: CompanyStatusProps) {
  const [checkboxState, setCheckboxState] = useState(false);
  const [optionsState, setOptionsState] = useState(options);

  useEffect(() => {
    if (!checkboxState) {
      setOptionsState(options);
      console.log("hit");
    }
  }, [checkboxState, options]);

  const changeOptionsState = (list: CompanyStatusProps["options"]) =>
    setOptionsState(list);

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
        options={optionsState}
        selectedValues={optionsState}
        onRemove={changeOptionsState}
        onSelect={changeOptionsState}
        disablePreSelectedValues={!checkboxState}
        displayValue="status"
      />
    </>
  );
}

export { CompanyStatus };
