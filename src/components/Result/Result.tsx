import type { Company } from "../../types";
import dayjs from "dayjs";

interface CompanyWithLastActivity extends Company {
  lastActivity: any;
}

type inactiveDataProps = {
  inactiveData: any;
};

function Result(props: inactiveDataProps) {
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
            <tbody>{props.inactiveData.companies.map(genRow)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function genRow(
  { ID, TITLE, lastActivity }: CompanyWithLastActivity,
  index: number
) {
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
}
export { Result };
