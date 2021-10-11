function Result() {
  return (
    <section className="container">
      <table className="table">
        <thead>
          <tr>
            <th>
              <abbr title="#">#</abbr>
            </th>
            <th>Name</th>
            <th>Last activity date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <td>
              <a
                href="https://en.wikipedia.org/wiki/Leicester_City_F.C."
                title="Leicester City F.C."
              >
                Leicester City
              </a>{" "}
            </td>
            <td>38</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export { Result };
