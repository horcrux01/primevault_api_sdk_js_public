import { APIClient, ApprovalAction } from "../src";
import type { Contact, ContactListResponse } from "../src";

/**
 * Example: Create a contact with an asset whitelist and approve it.
 *
 * `createContactWithApproval` creates the contact and approves the pending
 * contact change request, so the returned contact is already approved. Use
 * `createContact` / `createContactApproval` to run the steps separately.
 */
const createAndApproveContact = async (
  apiClient: APIClient,
): Promise<Contact> => {
  const contact = await apiClient.createContactWithApproval({
    name: "Base USDT/USDC Contact",
    address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
    chain: "BASE",
    assetList: ["USDT", "USDC"],
    contactGroupIds: [], // Optional: contact group IDs from the UI
  });

  console.log(`Contact created and approved: ${contact.id} (${contact.status})`);

  return contact;
};

/**
 * Example: Decline a pending contact change request.
 */
const declineContactExample = async (
  apiClient: APIClient,
  contactId: string,
): Promise<void> => {
  await apiClient.approveChangeRequest({
    entityId: contactId,
    action: ApprovalAction.REJECT,
  });
};

/**
 * Example: Update a contact's asset whitelist and approve the change.
 *
 * `updateContactWithApproval` updates the contact and approves the pending
 * change request. Use `updateContact` if you want to approve separately.
 */
const updateContactAssetList = async (
  apiClient: APIClient,
  contactId: string,
  assetList: string[],
): Promise<Contact> => {
  const updated = await apiClient.updateContactWithApproval({
    id: contactId,
    assetList,
  });

  console.log(
    `Contact ${updated.id} asset list updated and approved: ${updated.assetList}`,
  );

  return updated;
};

const getContacts = async (apiClient: APIClient) => {
    const allContacts: Contact[] = [];
    let cursor: string | null = null;

    while (true) {
        const response: ContactListResponse = await apiClient.getContacts({}, 50, cursor);
        allContacts.push(...response.results);
        console.log(`Fetched ${response.results.length} contacts (total: ${allContacts.length})`);

        if (!response.hasNext || !response.nextCursor) break;
        cursor = response.nextCursor;
    }

    console.log(`Total contacts: ${allContacts.length}`);
}

const getContactsFiltered = async (apiClient: APIClient) => {
    const response = await apiClient.getContacts({ blockChain: "ETHEREUM" }, 10);
    for (const contact of response.results) {
        console.log(`  ${contact.id} — ${contact.name} (${contact.blockChain})`);
    }
}

export { createAndApproveContact, declineContactExample, updateContactAssetList, getContacts, getContactsFiltered };
