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
      <div className="column is-narrow has-text-right">
        {total
          ? `Checking activities of ${pluralMap[type]}: ${current} of ${total}`
          : "Getting companies"}
      </div>
      <div className="column is-align-self-center">
        <progress
          className="progress is-info"
          {...(total ? { value: current } : {})}
          max={total}
        >
          {current}%
        </progress>
      </div>
    </div>
  );
};

export default Progress;
