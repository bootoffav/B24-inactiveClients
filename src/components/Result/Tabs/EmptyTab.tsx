import { pluralMap } from "../../../helpers";
import { InActiveData } from "../../../types";

type EmptyTabProps = {
  // activeTab: boolean;
  type: keyof InActiveData;
};

const EmptyTab = ({
  //  activeTab,
  type,
}: EmptyTabProps) => {
  return (
    <div
      className="notification is-primary is-light has-text-centered is-size-3"
      // style={{ display: `${activeTab ? "" : "none"}` }}
    >
      Congrats! There are no inactive {pluralMap[type]}
    </div>
  );
};

export default EmptyTab;
