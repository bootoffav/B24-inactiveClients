import type { InActiveData, Activity } from "./types";
import { getAllData } from "./B24";
import dayjs from "dayjs";

function findLatestActivity(activities: Activity[]): Activity {
  return activities.reduce((curLastActivity, currentActivity) =>
    currentActivity.LAST_UPDATED &&
    dayjs(curLastActivity.LAST_UPDATED).isAfter(currentActivity.LAST_UPDATED)
      ? curLastActivity
      : currentActivity
  );
}

async function getCompanyContacts(
  companyId: `${number}`
): Promise<`${number}`[]> {
  return await getAllData(
    "crm.contact.list",
    {
      FILTER: {
        COMPANY_ID: companyId,
      },
      SELECT: ["ID"],
    },
    true
  )
    .then((contacts) => contacts.map((contact) => contact.ID))
    .catch(() => []);
}

async function getLastActivity(
  ownerId: `${number}`,
  type: keyof InActiveData
): Promise<Activity | undefined> {
  const ownerTypeIdMap: {
    [K in "company" | "contact" | "lead"]: `${1 | 3 | 4}`;
  } = {
    company: "4",
    contact: "3",
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
    let allLastActivitiesForContacts: Activity[] = [];

    for (const contactId of await getCompanyContacts(ownerId)) {
      const activities = await getAllData(
        "crm.activity.list",
        {
          ORDER: { ID: "DESC" },
          FILTER: {
            OWNER_TYPE_ID: ownerTypeIdMap.contact,
            OWNER_ID: contactId,
          },
        },
        true
      );
      if (activities.length) {
        allLastActivitiesForContacts = [
          ...allLastActivitiesForContacts,
          activities[0],
        ];
      }
    }

    return findLatestActivity([
      ...allLastActivitiesForContacts,
      allActivities[0], // companie's own activity
    ]);
  }

  return allActivities[0];
}

export { getLastActivity };
