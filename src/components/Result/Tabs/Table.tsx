// @ts-nocheck

import { useMemo } from "react";
import { useTable, usePagination } from "react-table";
import { InActiveData } from "../../../types";

type TableProps = {
  data: Entity[];
  type: keyof InActiveData;
  activeTab: boolean;
};

function Table(props: TableProps) {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "position",
      },
      {
        Header: "Name",
        accessor: "title",
      },
      {
        Header: "Last activity date",
        accessor: "lastActivityDate",
      },
      {
        Header: "Type of activity",
        accessor: "activityType",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
    ],
    []
  );

  const data = useMemo(() => genRows(props.type, props.data[props.type]), []);
  debugger;
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
    },
    usePagination
  );

  return (
    <section style={{ display: `${props.activeTab ? "" : "none"}` }}>
      <table
        className="table is-hoverable center"
        {...getTableProps()}
        //   id={type}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav
        className="pagination mx-auto"
        role="navigation"
        aria-label="pagination"
        style={{
          width: "60%",
          display: `${pageOptions.length === 1 ? "none" : ""}`,
        }}
      >
        <a
          className="button bd-fat-button is-primary is-light"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <i>←</i>
          <span className="ml-2">Previous page</span>
        </a>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <a
          className="button bd-fat-button is-primary is-light"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <span className="mr-2">Next page</span>
          <i>→</i>
        </a>
      </nav>
    </section>
  );
}

interface TableRow {
  position: number;
  title: string;
  lastActivityDate: string | Element;
  activityType: string | Element;
  subject: string | Element;
}

function genRows(
  type: keyof InActiveData,
  inActiveEntities?: Entity[]
): TableRow[] {
  return inActiveEntities
    ? inActiveEntities.map(({ TITLE, lastActivity }, index) => {
        return {
          position: index + 1,
          title: TITLE,
          lastActivityDate: printActivityDetail("LAST_UPDATED", lastActivity),
          activityType: printActivityDetail("PROVIDER_TYPE_ID", lastActivity),
          subject: printActivityDetail("SUBJECT", lastActivity),
        };
      })
    : [];
}

type ActivityDetailType = "LAST_UPDATED" | "PROVIDER_TYPE_ID" | "SUBJECT";

function printActivityDetail(
  type: ActivityDetailType,
  lastActivity?: Activity
): string | Element {
  if (!lastActivity) return "-";
  let valueToReturn: string | Element;
  switch (type) {
    case "LAST_UPDATED":
      valueToReturn = dayjs(lastActivity[type]).format("YYYY-MM-DD");
      break;
    case "SUBJECT":
      // @ts-ignore
      valueToReturn =
        lastActivity.PROVIDER_TYPE_ID === "TASK" ? (
          <a
            href={`${process.env.REACT_APP_B24_HOSTNAME}/company/personal/user/${lastActivity.RESPONSIBLE_ID}/tasks/task/view/${lastActivity.ASSOCIATED_ENTITY_ID}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lastActivity.SUBJECT}
          </a>
        ) : (
          lastActivity.SUBJECT
        );
      break;
    default:
      valueToReturn = lastActivity[type];
  }

  return valueToReturn;
}

export { Table };
