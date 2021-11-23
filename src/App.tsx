import { useReducer, useState } from "react";
import Form, { FormProps } from "./components/Form";
import Progress from "./components/Progress/Progress";
// import SentEmail from "./components/SentEmail";
import Abort from "./components/Abort";
import Result from "./components/Result/Result";
import { AppState, Entity, InActiveData, ProgressTuple } from "./types";
import processing from "./processing";
import {
  inActiveReducer,
  progressReducer,
  initProgressState,
  initInactiveState,
} from "./reducers";
import { useAuth0 } from "@auth0/auth0-react";
// import { stringify } from "qs";
import LoadingUserData from "./components/LoadingUserData";

function App() {
  const [appState, setAppState] = useState<AppState>("initial");
  // const [emailWhereToBeSent, setEmailWhereToBeSent] = useState<string>();
  const [inActiveData, dispatchInActiveReducer] = useReducer(
    inActiveReducer,
    initInactiveState
  );

  const [entityToCheck, setEntityToCheck] =
    useState<keyof InActiveData>("company");
  const [progressState, dispatchProgressReducer] = useReducer(
    progressReducer,
    initProgressState
  );

  const { loginWithRedirect, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <LoadingUserData />;
  }

  const process: FormProps["process"] = async ({
    employee,
    inactivityPeriod,
    companyStatuses,
    entityToCheck,
  }) => {
    setAppState("started");
    setEntityToCheck(entityToCheck);
    for await (const [type, payload] of processing({
      employee,
      inactivityPeriod,
      companyStatuses,
      entityToCheck,
    })) {
      if (window.aborted) return Promise.resolve(void (window.aborted = false));

      if (typeof payload[0] === "number" && typeof payload[1] === "number") {
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
    dispatchProgressReducer({ type: "reset", payload: [0, 0] });
    setAppState("finished");
  };

  return isAuthenticated ? (
    <main className="is-0 is-flex is-flex-direction-column">
      <div className="main-menu">
        <section className="container">
          <div className="is-flex">
            <div className="column is-size-4 has-text-centered">
              APP shows inactive clients in Bitrix24 CRM within specified period
              of time
            </div>
            <button
              className="column is-1 button is-ghost"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
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
        {appState === "started" && (
          <Progress
            key={entityToCheck}
            current={progressState[entityToCheck].current}
            total={progressState[entityToCheck].total}
            type={entityToCheck}
          />
        )}
        {appState === "finished" && (
          <Result inActiveData={inActiveData} type={entityToCheck} />
        )}
        {/* {appState === "emailed" && <SentEmail email={emailWhereToBeSent} />} */}
        {appState === "aborted" && <Abort />}
      </div>
    </main>
  ) : (
    loginWithRedirect()
  );
}

export default App;

// fetch(`http://localhost:9999/.netlify/functions/sendEmail-background`, {
//   mode: "no-cors", // todo
//   method: "post",
//   body: stringify({
//     inactivityPeriod,
//     id: employee.id,
//     email: employee.email,
//   }),
// }).then(() => {
//   setEmailWhereToBeSent(employee.email);
//   setAppState("emailed");
// });
