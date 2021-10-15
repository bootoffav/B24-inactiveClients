import dayjs from "dayjs";
import type { InActiveData, Entity } from "../../../types";

function TabWithContent({
  type,
  inActiveEntities,
  activeTab,
}: {
  type: keyof InActiveData;
  inActiveEntities?: Entity[];
  activeTab: boolean;
}) {
  return (
    <table
      className="table center"
      id={type}
      style={{ display: `${activeTab ? "" : "none"}` }}
    >
      <thead>
        <tr>
          <th>
            <abbr title="#">#</abbr>
          </th>
          <th>Name</th>
          <th>Last activity date</th>
          <th>Type of activity</th>
          <th>Subject</th>
        </tr>
      </thead>
      <tbody>{genRows(type, inActiveEntities)}</tbody>
    </table>
  );
}

function genRows(type: keyof InActiveData, inActiveEntities?: Entity[]) {
  return inActiveEntities
    ? inActiveEntities.map(({ ID, TITLE, lastActivity }, index) => {
        return (
          <tr key={ID}>
            <th>{index + 1}</th>
            <td>
              <a
                href={`${process.env.REACT_APP_B24_HOSTNAME}/crm/${type}/details/${ID}/`}
                title={TITLE}
                target="_blank"
                rel="noopener noreferrer"
              >
                {TITLE}
              </a>{" "}
            </td>
            <td>
              {lastActivity
                ? dayjs(lastActivity.LAST_UPDATED).format("YYYY-MM-DD")
                : "-"}
            </td>
            <td>{lastActivity ? lastActivity.PROVIDER_TYPE_ID : "-"}</td>
            <td>{lastActivity ? lastActivity.SUBJECT : "-"}</td>
          </tr>
        );
      })
    : "";
}

export { TabWithContent };
