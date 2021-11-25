import type { Employee, InActiveData } from "../../types";
import { getExcelFile } from "./ExcelGeneration";

export interface ExportProps {
  inActiveData: InActiveData;
  type: keyof InActiveData;
  employee?: Employee;
}

const Export = (props: ExportProps) => (
  <section>
    <button
      className="button is-small is-pulled-right is-info is-light"
      onClick={() => getExcelFile(props)}
    >
      <span className="icon is-small">
        <i className="fas fa-file-download"></i>
      </span>
      <span>Export to Excel</span>
    </button>
  </section>
);

export default Export;
