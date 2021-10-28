import { useMemo } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import dayjs from "dayjs";
import type { InActiveData, Entity } from "../../../types";
import EmptyTab from "./EmptyTab";

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
      initialState: {
        pageSize,
        sortBy: [
          {
            id: "title",
          },
        ],
      },
    },
    useSortBy,
    usePagination
  );

  return inActiveEntities.length ? (
    <section style={{ display: `${activeTab ? "" : "none"}` }}>
      <table className={`table is-hoverable is-fullwidth`} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i: number) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="is-pulled-right">🔽</span>
                      ) : (
                        <span className="is-pulled-right">🔼</span>
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
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
                  cell.column.id === "#" ? (
                    <td key={i}>{pageIndex * pageSize + (i + 1)}</td>
                  ) : (
                    <td key={i} {...cell.getCellProps()}>
                      {cellView(cell)}
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
    title: TITLE,
    lastActivityDate: lastActivity?.LAST_UPDATED,
    activityType:
      lastActivity && lastActivity.PROVIDER_TYPE_ID !== null
        ? lastActivity.PROVIDER_TYPE_ID
        : undefined,
    subject: lastActivity?.SUBJECT,
    payload: {
      id: ID,
      type,
      responsibleId: lastActivity?.RESPONSIBLE_ID,
      accossiateEntityId: lastActivity?.ASSOCIATED_ENTITY_ID,
    },
  }));
}

const printLink = ({
  id,
  text,
  type,
}: {
  id: string;
  text: string;
  type: keyof InActiveData;
}) => (
  <a
    href={`${process.env.REACT_APP_B24_HOSTNAME}/crm/${type}/details/${id}/`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {text}
  </a>
);

function cellView({ column, value, row }: any) {
  const { payload, activityType } = row.original;
  switch (column.id) {
    case "title":
      return printLink({ id: payload.id, text: value, type: payload.type });
    case "lastActivityDate":
      return value ? dayjs(value).format("YYYY-MM-DD") : "-";
    case "activityType":
      return (
        <span className="is-capitalized">
          {value ? value.toLowerCase() : "-"}
        </span>
      );
    case "subject":
      return activityType === "TASK" ? (
        <a
          href={`${process.env.REACT_APP_B24_HOSTNAME}/company/personal/user/${payload.responsibleId}/tasks/task/view/${payload.accossiateEntityId}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      ) : (
        value || "-"
      );
    default:
      return "-";
  }
}

export { TabWithContent };
