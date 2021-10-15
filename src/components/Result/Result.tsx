import { useState } from "react";
import { inActivityDataTypes } from "../../helpers";
import type { InActiveData } from "../../types";
import { Tabs } from "./Tabs/Tabs";
import { TabWithContent } from "./Tabs/TabWithContent";

type ResultProps = {
  inActiveData: InActiveData;
};

function Result({ inActiveData }: ResultProps) {
  const [activeTab, setActiveTab] = useState<keyof InActiveData>("company");
  return (
    <section className="container mb-6">
      <Tabs
        inActiveData={inActiveData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {inActivityDataTypes.map((type) => {
        return (
          <TabWithContent
            key={type}
            type={type}
            inActiveEntities={inActiveData[type]}
            activeTab={type === activeTab}
          />
        );
      })}
    </section>
  );
}

export { Result };
