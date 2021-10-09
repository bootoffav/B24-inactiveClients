import { stringify } from "qs";
type departId = "8640" | "8496";

interface User {
  ID: string;
  NAME: string;
  LAST_NAME: string;
}

const B24Config = {
  hostname: process.env.REACT_APP_B24_HOSTNAME || "",
  hook: process.env.REACT_APP_B24_HOOK || "",
};

async function getEmployees(depart: departId): Promise<any> {
  const users: User[] = await fetch(
    B24Config.hostname + B24Config.hook + "user.get",
    {
      method: "post",
      body: stringify({
        FILTER: { UF_DEPARTMENT: depart },
      }),
    }
  )
    .then((res) => res.json())
    .then(({ result }: any) => result.filter((user: any) => user.ACTIVE))
    .then((users) =>
      users.map(({ ID, NAME, LAST_NAME }: User) => ({
        ID,
        NAME: `${NAME} ${LAST_NAME}`,
      }))
    );

  const employees = users.map((user: any) => ({
    value: user.ID,
    label: user.NAME,
  }));

  return employees;
}

export { getEmployees };
export type { User, departId };
