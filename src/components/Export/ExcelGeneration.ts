import { ExportProps } from "./Export";
import { pluralMap } from "../../helpers";
import XLSX from "xlsx-js-style";
import dayjs from "dayjs";

const HeaderColumnStyle = {
  alignment: {
    horizontal: "center",
  },
  font: {
    sz: 14,
    bold: true,
  },
};

const getExcelFile = ({ name, type, inActiveEntities }: ExportProps) => {
  let ws = {
    A1: { v: "#", s: HeaderColumnStyle },
    B1: { v: "NAME", s: HeaderColumnStyle },
    C1: { v: "LAST ACTIVITY DATE", s: HeaderColumnStyle },
    D1: { v: "TYPE OF ACTIVITY", s: HeaderColumnStyle },
    E1: { v: "SUBJECT", s: HeaderColumnStyle },

    "!ref": `A1:E${inActiveEntities.length + 1}`,
    "!cols": [
      { width: 10 },
      { width: 55 },
      { width: 20 },
      { width: 20 },
      { width: 55 },
    ],
    "!rows": [{ hpt: 30 }, ...Array(inActiveEntities.length).fill({ hpt: 20 })],
  };

  const structuredData = inActiveEntities.map(
    ({ id, title, lastActivity }, index) => {
      const toReturn = [String(index + 1), [id, title]];

      if (lastActivity) {
        const { LAST_UPDATED, PROVIDER_TYPE_ID: type, SUBJECT } = lastActivity;
        const activityType = type
          ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
          : "-";

        toReturn.push(
          dayjs(LAST_UPDATED).format("YYYY-MM-DD"),
          activityType,
          SUBJECT
        );
      } else {
        toReturn.push("-", "-", "-");
      }

      return toReturn;
    }
  );

  function* fillCell() {
    let rowIndex = 2;
    const columnLetters = ["A", "B", "C", "D", "E"];

    for (const row of structuredData) {
      let columnIndex = 0;
      for (const v of row) {
        let toYield: any;
        if (columnIndex === 1) {
          const [id, title] = v;
          toYield = { v: title };
          toYield.l = {
            Target: `${process.env.REACT_APP_B24_HOSTNAME}/crm/company/details/${id}/`,
          };
          toYield.s = {
            font: {
              underline: true,
              color: { rgb: "CC2581FF" },
            },
          };
        } else {
          toYield = { v };
        }
        yield {
          [`${columnLetters[columnIndex]}${rowIndex}`]: toYield,
        };

        columnIndex += 1;
      }
      rowIndex += 1;
    }
  }

  for (const cell of fillCell()) {
    ws = { ...ws, ...cell };
  }

  const filename = `Inactive_${pluralMap[type]}${
    name ? `_${name}` : ""
  }_${dayjs().format("YYYY-MM-DD-HHmmss")}.xlsx`;

  const wb = {
    Props: {
      Title: "Inactive Client Report",
      Subject: "XMT",
      Author: "@bootoffav",
      CreatedDate: new Date(),
    },
    SheetNames: [`${pluralMap[type]}`],
    Sheets: { [`${pluralMap[type]}`]: ws },
  };
  return XLSX.writeFile(wb, filename);
};

export default getExcelFile;
