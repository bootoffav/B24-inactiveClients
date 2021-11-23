import { SyntheticEvent } from "react";
import type { Employee, InActiveData } from "../../types";
import { pluralMap } from "../../helpers";
import XLSX from "xlsx";
import dayjs from "dayjs";

interface ExportProps {
  inActiveData: InActiveData;
  type: keyof InActiveData;
  employee?: Employee;
}

const Export = (props: ExportProps) => {
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();
    getExcelFile(props);
  };
  return (
    <section>
      <button
        className="button is-small is-pulled-right is-info is-light"
        onClick={onClick}
      >
        <span className="icon is-small">
          <i className="fas fa-file-download"></i>
        </span>
        <span>Export in Excel</span>
      </button>
    </section>
  );
};

const getExcelFile = ({ employee, type }: ExportProps) => {
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push(`${pluralMap[type]}`);

  const ws = XLSX.utils.aoa_to_sheet([["hello", "world"]]);

  wb.Sheets[`${pluralMap[type]}`] = ws;

  const name = employee ? `_${employee.name}` : "";
  const filename = `Inactive_${pluralMap[type]}${name}_${dayjs().format(
    "YYYY-MM-DD-HHmmss"
  )}.xlsx`;

  XLSX.writeFile(wb, filename);
};

export default Export;
