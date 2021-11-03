import { useReducer, useState } from "react";
import Form from "./components/Form";
import Progress from "./components/Progress/Progress";
import SentEmail from "./components/SentEmail/SentEmail";
import Result from "./components/Result/Result";
import { AppState, Entity, InActiveData, ProgressTuple } from "./types";
import { inActivityDataTypes } from "./helpers";
import processing from "./processing";
import {
  inActiveReducer,
  progressReducer,
  initProgressState,
} from "./reducers";
import { stringify } from "querystring";
import { useAuth0 } from "@auth0/auth0-react";

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

  const { loginWithRedirect, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return isAuthenticated ? (
    <main className="is-0">
      <div className="main-menu">
        <section className="container mb-4">
          <div className="columns is-gapless" style={{ height: "20px" }}>
            {/* TODO: FIX height in CSS styles */}
            <div className="column is-size-4 has-text-centered">
              APP shows inactive clients in Bitrix24 CRM within specified period
              of time
            </div>
            <div className="column is-1">
              <button
                className="button is-ghost"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </button>
            </div>
          </div>
          <Form
            process={async ({ output, employee, inactivityPeriod }) => {
              switch (output) {
                case "email":
                  fetch(
                    `http://localhost:9999/.netlify/functions/sendEmail-background`,
                    {
                      mode: "no-cors", // todo
                      method: "post",
                      body: stringify({
                        inactivityPeriod,
                        id: employee.id,
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

                  for await (const [type, payload] of processing({
                    employee,
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
  ) : (
    loginWithRedirect()
  );
}

export default App;
