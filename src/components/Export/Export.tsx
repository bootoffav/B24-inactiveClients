import type { InActiveData, Entity } from "../../types";
import excelFile from "./ExcelGeneration";
import XLSX from "xlsx-js-style";

export interface ExportProps {
  inActiveEntities: Entity[];
  type: keyof InActiveData;
  name: string;
}

const Export = (props: ExportProps) => (
  <section>
    <button
      className="button is-small is-pulled-right is-info is-light"
      onClick={() => {
        const { filename, content } = excelFile(props);
        XLSX.writeFile(content, filename);
      }}
    >
      <span className="icon is-small">
        <i className="fas fa-file-download"></i>
      </span>
      <span>Export to Excel</span>
    </button>
  </section>
);

export default Export;
