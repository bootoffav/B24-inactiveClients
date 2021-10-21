import { useMemo } from "react";
import { useTable, usePagination } from "react-table";
import dayjs from "dayjs";
import type { InActiveData, Entity, Activity } from "../../../types";
import EmptyTab from "./EmptyTab";
import styles from "./TabWithContent.module.css";

function TabWithContent({
  type,
  inActiveEntities,
  activeTab,
}: {
  type: keyof InActiveData;
  inActiveEntities: Entity[];
  activeTab: boolean;
}) {
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

  const data = useMemo(
    () => genRows(inActiveEntities, type),
    [inActiveEntities, type]
  );
  const pageSize = 20;

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
      // @ts-expect-error
      columns,
      data,
      initialState: { pageSize },
    },
    usePagination
  );

  return inActiveEntities.length ? (
    <section style={{ display: `${activeTab ? "" : "none"}` }}>
      <table
        className="table is-hoverable is-fullwidth center"
        {...getTableProps()}
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
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) =>
                  cell.column.id === "position" ? (
                    <td className={styles.equalWidth} key={i}>
                      {pageIndex * pageSize + (i + 1)}
                    </td>
                  ) : (
                    <td key={i} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  )
                )}
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
        <button
          className="button bd-fat-button is-primary is-light"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <i>←</i>
          <span className="ml-2">Previous page</span>
        </button>
        <strong>
          Page {pageIndex + 1} of {pageOptions.length}
        </strong>{" "}
        <button
          className="button bd-fat-button is-primary is-light"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <span className="mr-2">Next page</span>
          <i>→</i>
        </button>
      </nav>
    </section>
  ) : (
    <EmptyTab type={type} activeTab={activeTab} />
  );
}

function genRows(inActiveEntities: Entity[], type: keyof InActiveData) {
  return inActiveEntities.map(({ ID, TITLE, lastActivity }) => ({
    title: printLink({ ID, TITLE, type }),
    lastActivityDate: printActivityDetail("LAST_UPDATED", lastActivity),
    activityType: printActivityDetail("PROVIDER_TYPE_ID", lastActivity),
    subject: printActivityDetail("SUBJECT", lastActivity),
  }));
}

const printLink = ({
  ID,
  TITLE,
  type,
}: {
  ID: string;
  TITLE: string;
  type: keyof InActiveData;
}) => (
  <a href={`${process.env.REACT_APP_B24_HOSTNAME}/crm/${type}/details/${ID}}`}>
    {TITLE}
  </a>
);

type ActivityDetailType = "LAST_UPDATED" | "PROVIDER_TYPE_ID" | "SUBJECT";

function printActivityDetail(
  type: ActivityDetailType,
  lastActivity?: Activity
): JSX.Element {
  if (!lastActivity) return <>-</>;
  let valueToReturn;
  switch (type) {
    case "LAST_UPDATED":
      valueToReturn = dayjs(lastActivity[type]).format("YYYY-MM-DD");
      break;
    case "SUBJECT":
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

  return <>{valueToReturn}</>;
}
export { TabWithContent };
