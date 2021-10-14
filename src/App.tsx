import { useReducer, useState } from "react";
import { Form } from "./components/Form";
import { Progress } from "./components/Progress/Progress";
import { Result } from "./components/Result/Result";
import { AppState, Entity, ProcessProps, InActiveData } from "./types";
import { getCompanies, getActivities } from "./B24";
import { isInactiveEntity } from "./helpers";

type inactiveReducerProps = {
  type: "companies" | "contacts" | "leads";
  payload: Entity[];
};

function inActiveReducer(
  state: InActiveData,
  { type, payload }: inactiveReducerProps
) {
  return { ...state, [type]: payload };
}

function App() {
  const [state, setState] = useState<AppState>("initial");
  const [inActiveData, dispatch] = useReducer(inActiveReducer, {});

  return (
    <main className="is-0">
      <div className="main-menu">
        <section className="container mb-4">
          <p className="is-size-4 has-text-centered">
            APP shows inactive clients in Bitrix24 CRM within specified period
            of time.
          </p>
          <Form
            process={async (props: ProcessProps) => {
              props.event.preventDefault();
              setState("started");

              for await (const [type, payload] of process(props)) {
                dispatch({
                  type,
                  payload,
                });
                setState("finished");
              }
            }}
            isLoading={state === "started"}
          />
        </section>
      </div>
      <div className="result-menu">
        {state === "started" && <Progress />}
        {state === "finished" && <Result inActiveData={inActiveData} />}
      </div>
    </main>
  );
}

async function* process(
  params: ProcessProps
): AsyncGenerator<["companies", Entity[]], any, void> {
  const companies = await getCompanies(params.employeeId);
  const inactiveCompanies = [];

  for (const company of companies) {
    const lastActivity = await getActivities(company.ID, 4);

    if (lastActivity === undefined) {
      inactiveCompanies.push({ lastActivity, ...company });
      continue;
    }

    if (isInactiveEntity(lastActivity, params.inactivityPeriod)) {
      inactiveCompanies.push({ lastActivity, ...company });
    }
  }

  yield ["companies", inactiveCompanies];
}

export default App;
