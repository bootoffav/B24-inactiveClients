import { useReducer, useState } from "react";
import Form from "./components/Form";
import Progress from "./components/Progress/Progress";
import SentEmail from "./components/SentEmail/SentEmail";
import Result from "./components/Result/Result";
import { AppState, Entity, InActiveData, ProgressTuple } from "./types";
import { inActivityDataTypes } from "./helpers";
import proceeding from "./proceeding";
import {
  inActiveReducer,
  progressReducer,
  initProgressState,
} from "./reducers";
import { stringify } from "querystring";

function App() {
  const [state, setAppState] = useState<AppState>("initial");
  const [emailWhereToBeSent, setEmailWhereToBeSent] = useState<string>();
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
            process={async ({ output, employee, inactivityPeriod }: any) => {
              switch (output) {
                case "email":
                  fetch(
                    `http://localhost:9999/.netlify/functions/sendEmail-background`,
                    {
                      mode: "no-cors", // todo
                      method: "post",
                      body: stringify({
                        inactivityPeriod,
                        id: employee.ID,
                        email: employee.email,
                      }),
                    }
                  ).then(() => {
                    setEmailWhereToBeSent(employee.email);
                    setAppState("emailed");
                  });
                  break;
                case "screen":
                  setAppState("started");
                  dispatchProgressReducer({ type: "reset", payload: [0, 0] });

                  for await (const [type, payload] of proceeding({
                    id: employee.id,
                    inactivityPeriod,
                  })) {
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
                  setAppState("finished");
              }
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
        {state === "emailed" && <SentEmail email={emailWhereToBeSent} />}
      </div>
    </main>
  );
}

export default App;
