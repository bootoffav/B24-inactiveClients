import { inActivityDataTypes } from "../../../helpers";
import type { InActiveData } from "../../../types";

type TabsProps = {
  inActiveData: InActiveData;
  activeTab: keyof InActiveData;
  setActiveTab: (type: keyof InActiveData) => void;
};

function Tabs({ inActiveData, activeTab, setActiveTab }: TabsProps) {
  const pluralMap = {
    company: "Companies",
    contact: "Contacts",
    lead: "Leads",
  };
  return (
    <div className="tabs is-fullwidth">
      <ul>
        {inActivityDataTypes.map((type) => (
          <li className={`${activeTab === type ? "is-active" : ""}`}>
            <a
              href={`#${type}`}
              id={`${type}`}
              onClick={() => setActiveTab(type)}
            >
              {`${pluralMap[type as keyof InActiveData & string]}`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Tabs };
