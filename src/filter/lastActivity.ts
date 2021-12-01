import type { InActiveData, Activity, userRelatedCRMEntities } from "../types";
import { getAllData } from "../B24";
import dayjs from "dayjs";

function findLatestActivity(activities: Activity[]): Activity {
  return activities.reduce((curLastActivity, currentActivity) => {
    if (!currentActivity) {
      return curLastActivity;
    }
    return currentActivity.LAST_UPDATED &&
      dayjs(curLastActivity.LAST_UPDATED).isAfter(currentActivity.LAST_UPDATED)
      ? curLastActivity
      : currentActivity;
  });
}

type RelatedEntity = "contact" | "deal" | "lead";

function getCompanyRelatedEntities(
  companyId: `${number}`,
  entityType: RelatedEntity,
  relatedCRMEntities: userRelatedCRMEntities
): `${number}`[] {
  return relatedCRMEntities[entityType]
    .filter((entity) => entity.companyId === companyId)
    .map((entity) => entity.id);

  // return await getAllData(
  //   `crm.${entityType}.list`,
  //   {
  //     FILTER: {
  //       COMPANY_ID: companyId,
  //     },
  //     SELECT: ["ID"],
  //   },
  //   true
  // )
  //   .then((relatedEntities) => relatedEntities.map((entity) => entity.ID))
  //   .catch(() => []);
}

async function getLastActivity(
  ownerId: `${number}`,
  type: keyof InActiveData,
  relatedCRMEntities?: userRelatedCRMEntities
): Promise<Activity | undefined> {
  const ownerTypeIdMap: {
    [K in "company" | "contact" | "lead" | "deal"]: `${1 | 2 | 3 | 4}`;
  } = {
    company: "4",
    contact: "3",
    deal: "2",
    lead: "1",
  };
  const allActivities = await getAllData(
    "crm.activity.list",
    {
      ORDER: { ID: "DESC" },
      FILTER: {
        OWNER_TYPE_ID: ownerTypeIdMap[type],
        OWNER_ID: ownerId,
      },
    },
    true
  );

  if (type === "company") {
    let allLastActivitiesForRelatedEntities: Activity[] = [];

    const relatedEntities: RelatedEntity[] = ["deal", "contact", "lead"];
    for (const entityType of relatedEntities) {
      for (const entityId of await getCompanyRelatedEntities(
        ownerId,
        entityType,
        relatedCRMEntities as userRelatedCRMEntities
      )) {
        const activities = await getAllData(
          "crm.activity.list",
          {
            ORDER: { ID: "DESC" },
            FILTER: {
              OWNER_TYPE_ID: ownerTypeIdMap[entityType],
              OWNER_ID: entityId,
            },
          },
          true
        );
        if (activities.length) {
          allLastActivitiesForRelatedEntities = [
            ...allLastActivitiesForRelatedEntities,
            activities[0],
          ];
        }
      }
    }

    const candidatesToLastActivity: Activity[] = allActivities[0]
      ? [
          ...allLastActivitiesForRelatedEntities,
          allActivities[0], // companie's own activity
        ]
      : allLastActivitiesForRelatedEntities;

    return candidatesToLastActivity.length
      ? findLatestActivity(candidatesToLastActivity)
      : undefined;
  }

  return allActivities[0];
}

export { getLastActivity, findLatestActivity };
