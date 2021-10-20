import type { InActiveData, Entity } from "../../../types";
import { Table } from "./Table";
import EmptyTab from "./EmptyTab";

function TabWithContent({
  type,
  inActiveEntities,
  activeTab,
}: {
  type: keyof InActiveData;
  inActiveEntities: Entity[];
  activeTab: boolean;
}) {
  return !inActiveEntities.length ? (
    <EmptyTab type={type} activeTab={activeTab} />
  ) : (
    <Table data={inActiveEntities} type={type} activeTab={activeTab} />
  );
}

export { TabWithContent };
