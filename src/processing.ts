import { delay, isInActiveEntity, inActivityDataTypes } from "./helpers";
import { getEntities } from "./B24";
import { getLastActivity } from "./lastActivity";
import { ProcessingProps, InActiveData, Entity, ProgressTuple } from "./types";

async function* processing({
  employee,
  inactivityPeriod,
}: ProcessingProps): AsyncGenerator<
  [keyof InActiveData & string, Entity[] | ProgressTuple],
  any,
  void
> {
  for (const type of inActivityDataTypes) {
    let inactiveEntities: Entity[] = [];
    const entities = await getEntities(
      type as keyof InActiveData & string,
      employee.ID
    );
    yield [type, [0, entities.length]];

    let index = 1;
    for (const entity of entities) {
      yield [type, [index, entities.length]];

      await delay(); // to exclude hitting B24 endpoint limits
      const lastActivity = await getLastActivity(entity.ID, type);

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
}

export default processing;