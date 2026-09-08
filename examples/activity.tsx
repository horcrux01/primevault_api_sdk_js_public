import { APIClient } from "../src";
import type { ActivityEvent, ActivityEventListResponse } from "../src";

const PAGE_SIZE = 100;

// Filters, all optional, one value each, all composable with the cursor:
//   action        create_requested | create_approved | create_rejected | create_applied,
//                 and the same four for update_ and delete_
//   outcome       success | failure
//   entityType    Vault | Transaction | Contact | Group | ECUser | OrgBankAccount |
//                 PolicyRule | PolicySet | PolicyTemplate | OrgMetaPolicy | CustomDApp
//   entityId      id of the entity the action was performed on
//   actorId       id of the user who performed the action
//   platformType  web | pwa | ios | android | api | unknown, which the response
//                 gathers into metaData.platform rather than onto the row
//   createdAtGte  ISO-8601 timestamp, inclusive lower bound on createdAt
//   createdAtLte  ISO-8601 timestamp, inclusive upper bound on createdAt
const exportActivityEvents = async (
  apiClient: APIClient,
  params: Record<string, string> = {},
) => {
  const events: ActivityEvent[] = [];
  let cursor: string | null = "";

  while (true) {
    const page: ActivityEventListResponse = await apiClient.getActivityEvents(
      params,
      PAGE_SIZE,
      cursor,
    );
    events.push(...page.results);
    console.log(
      `Fetched ${page.results.length} events (total: ${events.length})`,
    );

    if (!page.hasNext || !page.nextCursor) break;
    cursor = page.nextCursor;
  }

  for (const event of events) {
    console.log(
      `  ${event.createdAt}  ${event.action}  ${event.outcome}  ` +
        `${event.entityType}/${event.entityId} (${event.entityName})  ` +
        `by ${event.actorId}  [${event.schemaVersion}]`,
    );
    const meta = event.metaData;
    if (meta) {
      console.log(
        `      platform=${meta.platform}  sourceIp=${meta.sourceIp}  ` +
          `userAgent=${meta.userAgent}`,
      );
    }
  }

  console.log(`Total events: ${events.length}`);
  return events;
};

export { exportActivityEvents };
