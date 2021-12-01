import { delay, isInActiveEntity } from "./helpers";
import { getEntities, getUserRelatedCRMEntities } from "./B24";
import { getLastActivity } from "./filter/lastActivity";
import { ProcessingProps, InActiveData, Entity, ProgressTuple } from "./types";

async function* processing({
  employee,
  inactivityPeriod,
  companyStatuses,
  entityToCheck: type,
}: ProcessingProps): AsyncGenerator<
  [keyof InActiveData & string, Entity[] | ProgressTuple]
> {
  let inactiveEntities: Entity[] = [];
  let relatedCRMEntities =
    type === "company"
      ? await getUserRelatedCRMEntities(employee.id)
      : undefined;

  const entities = await getEntities(
    type as keyof InActiveData & string,
    employee.id,
    companyStatuses
  );

  yield [type, [0, entities.length]];

  let index = 1;
  for (const entity of entities) {
    yield [type, [index, entities.length]];

    await delay(); // to exclude hitting B24 endpoint limits
    const lastActivity = await getLastActivity(
      entity.id,
      type,
      relatedCRMEntities
    );
    if (
      (lastActivity && isInActiveEntity(lastActivity, inactivityPeriod)) ||
      !lastActivity
    ) {
      inactiveEntities = [
        ...inactiveEntities,
        ...[{ lastActivity, ...entity }],
      ];
    }
    index += 1;
  }
  yield [type, inactiveEntities];
}

export default processing;
