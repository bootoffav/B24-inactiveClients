import { useReducer, useState } from "react";
import Form from "./components/Form";
import Progress from "./components/Progress/Progress";
import SentEmail from "./components/SentEmail";
import Abort from "./components/Abort";
import Result from "./components/Result/Result";
import { AppState, Entity, InActiveData, ProgressTuple } from "./types";
import { inActivityDataTypes } from "./helpers";
import processing from "./processing";
import {
  inActiveReducer,
  progressReducer,
  initProgressState,
  initInactiveState,
} from "./reducers";
import { useAuth0 } from "@auth0/auth0-react";
import { stringify } from "qs";
import LoadingUserData from "./components/LoadingUserData";

function App() {
  const [appState, setAppState] = useState<AppState>("initial");
  const [emailWhereToBeSent, setEmailWhereToBeSent] = useState<string>();
  const [inActiveData, dispatchInActiveReducer] = useReducer(
    inActiveReducer,
    initInactiveState
  );

  const [progressState, dispatchProgressReducer] = useReducer(
    progressReducer,
    initProgressState
  );

  const { loginWithRedirect, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <LoadingUserData />;
  }

  // @ts-ignore
  const process = async ({ output, employee, inactivityPeriod }) => {
    switch (output) {
      case "email":
        fetch(`http://localhost:9999/.netlify/functions/sendEmail-background`, {
          mode: "no-cors", // todo
          method: "post",
          body: stringify({
            inactivityPeriod,
            id: employee.id,
            email: employee.email,
          }),
        }).then(() => {
          setEmailWhereToBeSent(employee.email);
          setAppState("emailed");
        });
        break;
      case "screen":
        setAppState("started");

        for await (const [type, payload] of processing({
          employee,
          inactivityPeriod,
        })) {
          if (window.aborted)
            return Promise.resolve(void (window.aborted = false));

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
  };

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
            process={process}
            isLoading={appState === "started"}
            abort={() => {
              setAppState("aborted");
              dispatchProgressReducer({ type: "reset", payload: [0, 0] });
              dispatchInActiveReducer({
                type: "reset",
                payload: [],
              });
              window.aborted = true;
            }}
          />
        </section>
      </div>
      <div className="result-menu">
        {appState === "started" &&
          inActivityDataTypes.map((type: keyof InActiveData) => (
            <Progress
              key={type}
              current={progressState[type].current}
              total={progressState[type].total}
              type={type}
            />
          ))}
        {appState === "finished" && <Result inActiveData={inActiveData} />}
        {appState === "emailed" && <SentEmail email={emailWhereToBeSent} />}
        {appState === "aborted" && <Abort />}
      </div>
    </main>
  ) : (
    loginWithRedirect()
  );
}

export default App;
