import { pluralMap } from "../../helpers";
import { InActiveData } from "../../types";

type EmptyTabProps = {
  type: keyof InActiveData;
};

const EmptyResult = ({ type }: EmptyTabProps) => {
  return (
    <div className="notification is-primary is-light has-text-centered is-size-3">
      Congrats! There are no inactive {pluralMap[type]}
    </div>
  );
};

export default EmptyResult;
