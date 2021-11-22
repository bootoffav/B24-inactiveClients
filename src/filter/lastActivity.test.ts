import { Activity } from "../types";
import { findLatestActivity } from "./lastActivity";

it("find latest Activity", () => {
  const notActivity = undefined as unknown as Activity;

  let result = findLatestActivity([latestActivity, oldActivity]);
  expect(result).toBe(latestActivity);

  result = findLatestActivity([notActivity]);
  expect(result).toBe(undefined);

  result = findLatestActivity([latestActivity, notActivity]);
  expect(result).toBe(latestActivity);
});

const latestActivity = {
  ID: "1816508",
  OWNER_ID: "25657",
  OWNER_TYPE_ID: "4",
  TYPE_ID: "2",
  PROVIDER_ID: "VOXIMPLANT_CALL",
  PROVIDER_TYPE_ID: "CALL",
  PROVIDER_GROUP_ID: null,
  ASSOCIATED_ENTITY_ID: "0",
  SUBJECT: "Исходящий звонок Medka Marika Bury-Kubacka",
  CREATED: "2021-11-17T11:44:32+03:00",
  LAST_UPDATED: "2021-11-17T11:44:32+03:00",
  START_TIME: "2021-11-23T11:45:00+03:00",
  END_TIME: "2021-11-23T12:28:00+03:00",
  DEADLINE: "2021-11-23T11:45:00+03:00",
  COMPLETED: "N",
  STATUS: "1",
  RESPONSIBLE_ID: "165",
  PRIORITY: "2",
  NOTIFY_TYPE: "1",
  NOTIFY_VALUE: "15",
  DESCRIPTION: "polucila obrozec viskozy na testy 2m?",
  DESCRIPTION_TYPE: "1",
  DIRECTION: "2",
  LOCATION: "",
  SETTINGS: [],
  ORIGINATOR_ID: null,
  ORIGIN_ID: null,
  AUTHOR_ID: "165",
  EDITOR_ID: "165",
  PROVIDER_PARAMS: [],
  PROVIDER_DATA: null,
  RESULT_MARK: "0",
  RESULT_VALUE: null,
  RESULT_SUM: null,
  RESULT_CURRENCY_ID: null,
  RESULT_STATUS: "0",
  RESULT_STREAM: "0",
  RESULT_SOURCE_ID: null,
  AUTOCOMPLETE_RULE: "0",
} as Activity;

const oldActivity = {
  ID: "1709707",
  OWNER_ID: "25657",
  OWNER_TYPE_ID: "4",
  TYPE_ID: "2",
  PROVIDER_ID: "VOXIMPLANT_CALL",
  PROVIDER_TYPE_ID: "CALL",
  PROVIDER_GROUP_ID: null,
  ASSOCIATED_ENTITY_ID: "0",
  SUBJECT: "Исходящий звонок Medka Marika Bury-Kubacka",
  CREATED: "2021-06-14T10:40:32+03:00",
  LAST_UPDATED: "2021-07-07T11:43:44+03:00",
  START_TIME: "2021-06-21T10:40:00+03:00",
  END_TIME: "2021-06-21T11:23:00+03:00",
  DEADLINE: "2021-06-21T10:40:00+03:00",
  COMPLETED: "Y",
  STATUS: "2",
  RESPONSIBLE_ID: "165",
  PRIORITY: "2",
  NOTIFY_TYPE: "1",
  NOTIFY_VALUE: "15",
  DESCRIPTION:
    "vyslalla katalog XM, lenty , color card i 155 gsm polester/spandex, polucila?",
  DESCRIPTION_TYPE: "1",
  DIRECTION: "2",
  LOCATION: "",
  SETTINGS: [],
  ORIGINATOR_ID: null,
  ORIGIN_ID: null,
  AUTHOR_ID: "165",
  EDITOR_ID: "165",
  PROVIDER_PARAMS: [],
  PROVIDER_DATA: null,
  RESULT_MARK: "0",
  RESULT_VALUE: null,
  RESULT_SUM: null,
  RESULT_CURRENCY_ID: null,
  RESULT_STATUS: "0",
  RESULT_STREAM: "0",
  RESULT_SOURCE_ID: null,
  AUTOCOMPLETE_RULE: "0",
} as Activity;
