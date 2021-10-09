import Select from "react-select";

function EmployeeSelector(props: any) {
  return <Select isDisabled isLoading options={props.employees} />;
}

export { EmployeeSelector };
