import { useReducer, useState } from "react";
import Form from "./components/Form";
import Progress from "./components/Progress/Progress";
// import SentEmail from "./components/SentEmail";
import Abort from "./components/Abort";
import UserMenu from "./components/UserMenu/UserMenu";
import Result from "./components/Result/Result";
import {
  AppState,
  Entity,
  InActiveData,
  Employee,
  ProgressTuple,
  CorporateEmail,
  ProcessProps,
} from "./types";
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
import Export from "./components/Export/Export";
import { isManager } from "./helpers";

function App() {
  const [appState, setAppState] = useState<AppState>("initial");
  const [employee, setEmployee] = useState<Employee>();
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

  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <LoadingUserData />;
  }

  const analize = async ({
    employee,
    inactivityPeriod,
    companyStatuses,
    entityToCheck,
    destination,
  }: ProcessProps) => {
    // if (destination === "mail") {
    //   fetch(`http://localhost:9999/.netlify/functions/sendEmail-background`, {
    //     method: "post",
    //     mode: "no-cors",
    //     body: stringify({
    //       inactivityPeriod,
    //       employee,
    //       email: user?.email,
    //       entityToCheck,
    //     }),
    //   }).then(() => {
    //     setAppState("emailed");
    //     setTimeout(() => setAppState("initial"), 8000);
    //   });
    //   return;
    // }
    setAppState("started");
    setEntityToCheck(entityToCheck);
    setEmployee(employee);
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
            <UserMenu />
          </div>
          <Form
            process={analize}
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
        <section className="container">
          {appState === "started" && (
            <Progress
              current={progressState[entityToCheck].current}
              total={progressState[entityToCheck].total}
              type={entityToCheck}
            />
          )}
          {appState === "finished" && (
            <>
              {isManager(user?.email as CorporateEmail) && (
                <Export
                  inActiveEntities={inActiveData[entityToCheck]}
                  type={entityToCheck}
                  name={employee?.name ?? ""}
                />
              )}
              <Result
                inActiveEntities={inActiveData[entityToCheck]}
                type={entityToCheck}
              />
            </>
          )}
          {/* {appState === "emailed" && <SentEmail />} */}
          {appState === "aborted" && <Abort />}
        </section>
      </div>
    </main>
  ) : (
    loginWithRedirect()
  );
}

export default App;
