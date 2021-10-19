import { useReducer, useState } from "react";
import { Form } from "./components/Form";
import { Progress } from "./components/Progress/Progress";
import { Result } from "./components/Result/Result";
import {
  AppState,
  Entity,
  ProcessProps,
  InActiveData,
  ProgressTuple,
} from "./types";
import { inActivityDataTypes } from "./helpers";
import process from "./process";
import {
  inActiveReducer,
  progressReducer,
  initProgressState,
} from "./reducers";

function App() {
  const [state, setState] = useState<AppState>("initial");
  const [inActiveData, dispatchInActiveReducer] = useReducer(inActiveReducer, {
    company: [],
    contact: [],
    lead: [],
  });

  const [progressState, dispatchProgressReducer] = useReducer(
    progressReducer,
    initProgressState
  );

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
              dispatchProgressReducer({ type: "reset", payload: [0, 0] });

              for await (const [type, payload] of process(props)) {
                if (
                  typeof payload[0] === "number" &&
                  typeof payload[1] === "number"
                ) {
                  dispatchProgressReducer({
                    type,
                    payload: payload as ProgressTuple,
                  });
                } else {
                  dispatchInActiveReducer({
                    type,
                    payload: payload as Entity[],
                  });
                }
              }
              setState("finished");
            }}
            isLoading={state === "started"}
          />
        </section>
      </div>
      <div className="result-menu">
        {state === "started" &&
          inActivityDataTypes.map((type: keyof InActiveData) => (
            <Progress
              key={type}
              current={progressState[type].current}
              total={progressState[type].total}
              type={type}
            />
          ))}
        {state === "finished" && <Result inActiveData={inActiveData} />}
      </div>
    </main>
  );
}

export default App;
