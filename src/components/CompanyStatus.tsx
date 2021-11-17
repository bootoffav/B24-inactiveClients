import Multiselect from "multiselect-react-dropdown";

type CompanyStatusProps = {
  options: {
    status: string;
    id: string;
  }[];
};

function CompanyStatus({ options }: CompanyStatusProps) {
  //   const onSelect = (selectedList, selectedItem) => {
  //     console.log(selectedItem);
  //     console.log(selectedList);
  //   };

  // @ts-ignore
  const onRemove = (selectedList, removedItem) => {};

  return (
    <label data-tooltip="Additional filter by company Status field">
      {" "}
      Company Status:
      <Multiselect
        emptyRecordMsg="All options chosen"
        avoidHighlightFirstOption
        hidePlaceholder
        options={options}
        selectedValues={options}
        // onSelect={onSelect}
        onRemove={onRemove}
        displayValue="status"
      />
    </label>
  );
}

export { CompanyStatus };
