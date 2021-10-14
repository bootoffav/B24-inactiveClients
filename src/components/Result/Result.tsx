import type { InActiveData } from "../../types";
import dayjs from "dayjs";

type ResultProps = {
  inActiveData: InActiveData;
};

function Result({ inActiveData }: ResultProps) {
  return (
    <section className="container">
      <div className="tabs is-fullwidth">
        <ul>
          <li className="is-active">
            <a href="#company">Companies</a>
          </li>
          <li>
            <a href="#contact">Contacts</a>
          </li>
          <li>
            <a href="#leads">Leads</a>
          </li>
        </ul>
      </div>
      {genTable("company", inActiveData)}
      {genTable("contact", inActiveData)}
    </section>
  );
}
function genTable(type: string, inActiveData: any) {
  return (
    <table className="table center" id={type}>
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
      {/* @ts-ignore */}
      <tbody>{genRows(type, inActiveData)}</tbody>
    </table>
  );
}

function genRows(
  type: keyof InActiveData & string,
  inActiveData: InActiveData
) {
  const entities = inActiveData?.[type];
  if (entities) {
    return entities.map(({ ID, TITLE, lastActivity }, index) => {
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
              : "not known"}
          </td>
          <td>{lastActivity ? lastActivity.PROVIDER_TYPE_ID : "not known"}</td>
          <td>{lastActivity ? lastActivity.SUBJECT : "not known"}</td>
        </tr>
      );
    });
  }
}

export { Result };

{
  /* <tbody>{genRows("contact", inActiveData)}</tbody> */
}
{
  /* <tbody>{genRows("leads", inActiveData)}</tbody> */
}
