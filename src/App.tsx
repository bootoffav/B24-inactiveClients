import "bulma";
import { Form } from "./components/Form";
import { Progress } from "./components/Progress/Progress";

function App() {
  return (
    <main className="is-0">
      <div className="main-menu">
        <section className="container mb-4">
          <p className="is-size-4 has-text-centered">
            APP shows inactive clients in Bitrix24 CRM within specified period
            of time.
          </p>
          <Form />
        </section>
      </div>
      <div className="result-menu">
        <Progress />
      </div>
    </main>
  );
}

export default App;
