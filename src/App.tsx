import { useReducer, useState } from "react";
import { Form } from "./components/Form";
import { Progress } from "./components/Progress/Progress";
import { Result } from "./components/Result/Result";
import { AppState, Entity, ProcessProps, InActiveData } from "./types";
import { getEntities, getActivities } from "./B24";
import { inActivityDataTypes, isInActiveEntity } from "./helpers";

type inactiveReducerProps = {
  type: keyof InActiveData;
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
  const [inActiveData, dispatch] = useReducer(inActiveReducer, {
    company: [],
    contact: [],
    lead: [],
  });

  return (
    <main className="is-0">
      <div className="main-menu">
        <section className="container mb-4">
          <p className="is-size-4 has-text-centered">
            APP shows inactive clients in Bitrix24 CRM within specified period
            of time
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
              }

              setState("finished");
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
): AsyncGenerator<[keyof InActiveData & string, Entity[]], any, void> {
  for (const type of inActivityDataTypes) {
    let inactiveEntities: Entity[] = [];
    const entities = await getEntities(
      type as keyof InActiveData & string,
      params.employeeId
    );
    for (const entity of entities) {
      const lastActivity = await getActivities(entity.ID, 4);

      if (
        (lastActivity &&
          isInActiveEntity(lastActivity, params.inactivityPeriod)) ||
        !lastActivity
      ) {
        inactiveEntities = [
          ...inactiveEntities,
          ...[{ lastActivity, ...entity }],
        ];
      }
    }
    yield [type, inactiveEntities];
  }
}

export default App;
