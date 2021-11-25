import type { InActiveData } from "../../types";
import { TabWithContent } from "./Tabs/TabWithContent";

type ResultProps = {
  inActiveData: InActiveData;
  type: keyof InActiveData;
};

function Result({ inActiveData, type }: ResultProps) {
  return (
    <TabWithContent
      // todo Remove Tabs
      key={type}
      type={type}
      inActiveEntities={inActiveData[type]}
    />
  );
}

export default Result;
