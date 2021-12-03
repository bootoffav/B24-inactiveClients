import { pluralMap } from "../../helpers";
import { InActiveData } from "../../types";

type ProgressProps = {
  current?: number;
  total?: number;
  type: keyof InActiveData;
};

const Progress = ({ current, total, type }: ProgressProps) => {
  return (
    <div className="block columns">
      <div className="column is-one-third">
        Checking activities of{" "}
        <span className="is-capitalized">{pluralMap[type]}</span>: {current} of{" "}
        {total}
      </div>
      <div className="column is-align-self-center">
        {total ? (
          <progress className="progress is-info" value={current} max={total}>
            {current}%
          </progress>
        ) : (
          <progress className="progress is-info" max={total}>
            {current}%
          </progress>
        )}
      </div>
    </div>
  );
};

export default Progress;
