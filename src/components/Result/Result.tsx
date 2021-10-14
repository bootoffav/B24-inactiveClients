import type { InActiveData } from "../../types";
import dayjs from "dayjs";

type ResultProps = {
  inActiveData: InActiveData;
};

function Result({ inActiveData }: ResultProps) {
  return (
    <section className="container">
      <div className="columns">
        <div className="column">
          <table className="table center">
            <thead>
              <tr>
                <th>
                  <abbr title="#">#</abbr>
                </th>
                <th>Name</th>
                <th>Last activity date</th>
              </tr>
            </thead>
            <tbody>{genRows("companies", inActiveData)}</tbody>
            {/* <tbody>{genRows("contacts", inActiveData)}</tbody> */}
            {/* <tbody>{genRows("leads", inActiveData)}</tbody> */}
          </table>
        </div>
      </div>
    </section>
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
              href={`${process.env.REACT_APP_B24_HOSTNAME}/crm/company/details/${ID}/`}
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
        </tr>
      );
    });
  }
}

export { Result };
