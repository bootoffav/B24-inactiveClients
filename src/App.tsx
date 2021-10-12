import { useState } from "react";
import { Form } from "./components/Form";
import { Progress } from "./components/Progress/Progress";
import { Result } from "./components/Result/Result";
import { AppState } from "./types";

function App() {
  const [state, setState] = useState<AppState>("initial");

  return (
    <main className="is-0">
      <div className="main-menu">
        <section className="container mb-4">
          <p className="is-size-4 has-text-centered">
            APP shows inactive clients in Bitrix24 CRM within specified period
            of time.
          </p>
          <Form
            changeAppState={(newState: AppState) => {
              setState(newState);
            }}
          />
        </section>
      </div>
      <div className="result-menu">
        {state === "started" && <Progress />}
        {state === "finished" && <Result />}
      </div>
    </main>
  );
}

export default App;
