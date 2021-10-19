import { inActivityDataTypes, pluralMap } from "../../../helpers";
import type { InActiveData } from "../../../types";

type TabsProps = {
  inActiveData: InActiveData;
  activeTab: keyof InActiveData;
  setActiveTab: (type: keyof InActiveData) => void;
};

function Tabs({ inActiveData, activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="tabs is-fullwidth">
      <ul>
        {inActivityDataTypes.map((type) => (
          <li key={type} className={`${activeTab === type ? "is-active" : ""}`}>
            <a
              href={`#${type}`}
              id={`${type}`}
              onClick={() => setActiveTab(type)}
              className="has-text-primary-dark is-capitalized"
            >
              {`${pluralMap[type as keyof InActiveData & string]}`}
              <span className="ml-2">
                <sup>({inActiveData[type].length})</sup>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Tabs };
