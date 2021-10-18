import { pluralMap } from "../../helpers";
import { InActiveData } from "../../types";

type ProgressProps = {
  current?: number;
  total?: number;
  type: keyof InActiveData;
};

function Progress({ current, total, type }: ProgressProps) {
  const showCurrentProgressedType = () => (
    <div className={`block columns ${total ? "" : "is-hidden"}`}>
      <div className="column is-4 has-text-right">
        Fetching data in CRM{" "}
        <span className="is-capitalized">{pluralMap[type]}</span>: {current} of{" "}
        {total}
      </div>
      <div className="column is-align-self-center">
        <progress className="progress is-primary" value={current} max={total}>
          {current}%
        </progress>
      </div>
    </div>
  );

  return (
    <section className="container block">
      <div className="is-flex is-flex-direction-column">
        {showCurrentProgressedType()}
      </div>
    </section>
  );
}

export { Progress };
