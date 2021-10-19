import dayjs from "dayjs";
import type { InActiveData, Entity, Activity } from "../../../types";
import { pluralMap } from "../../../helpers";

function TabWithContent({
  type,
  inActiveEntities,
  activeTab,
}: {
  type: keyof InActiveData;
  inActiveEntities: Entity[];
  activeTab: boolean;
}) {
  return inActiveEntities.length ? (
    <table
      className="table is-hoverable center"
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
  ) : (
    <div
      className="notification is-primary is-light has-text-centered is-size-3"
      style={{ display: `${activeTab ? "" : "none"}` }}
    >
      Congrats! There are no inactive {pluralMap[type]}
    </div>
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
            <td>{printActivityDetail("LAST_UPDATED", lastActivity)}</td>
            <td>{printActivityDetail("PROVIDER_TYPE_ID", lastActivity)}</td>
            <td>{printActivityDetail("SUBJECT", lastActivity)}</td>
          </tr>
        );
      })
    : "";
}

type ActivityDetailType = "LAST_UPDATED" | "PROVIDER_TYPE_ID" | "SUBJECT";

function printActivityDetail(
  type: ActivityDetailType,
  lastActivity?: Activity
) {
  if (!lastActivity) return "-";
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

  return valueToReturn;
}
export { TabWithContent };
