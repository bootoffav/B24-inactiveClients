import type { InActiveData } from "../../types";
import { TabWithContent } from "./Tabs/TabWithContent";

type ResultProps = {
  inActiveData: InActiveData;
  type: keyof InActiveData;
};

function Result({ inActiveData, type }: ResultProps) {
  return (
    <section className="container">
      <TabWithContent
        key={type}
        type={type}
        inActiveEntities={inActiveData[type]}
      />
    </section>
  );
}

export default Result;
