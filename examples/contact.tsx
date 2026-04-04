import { APIClient, ApprovalAction } from "../src";
import type { Contact, ContactListResponse, UpdateContactResponse } from "../src";

/**
 * Example: Create a contact with an asset whitelist and approve it.
 *
 * Flow:
 *  1. Create a contact on a given chain with a restricted assetList.
 *  2. Approve the pending contact change request.
 *  3. Verify the contact status after approval.
 */
const createAndApproveContact = async (
  apiClient: APIClient,
): Promise<Contact> => {
  // Step 1: Create a contact with an asset whitelist
  const contact = await apiClient.createContact({
    name: "Base USDT/USDC Contact",
    address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
    chain: "BASE",
    assetList: ["USDT", "USDC"],
  });

  console.log(`Contact created: ${contact.id} (${contact.status})`);

  // Step 2: Approve the contact using its ID as the entityId
  const approval = await apiClient.submitContactApprovalAction(
    contact.id,
    ApprovalAction.APPROVE,
  );

  console.log(`Approval result: ${JSON.stringify(approval)}`);

  // Step 3: Fetch the contact again to verify it's approved
  const verified = await apiClient.getContactById(contact.id);
  console.log(`Contact status after approval: ${verified.status}`);

  return verified;
};

/**
 * Example: Decline a pending contact change request.
 */
const declineContactExample = async (
  apiClient: APIClient,
  contactId: string,
): Promise<void> => {
  await apiClient.submitContactApprovalAction(
    contactId,
    ApprovalAction.DECLINE,
  );
};

/**
 * Example: Update a contact's asset whitelist.
 *
 * Adds or replaces the list of assets the contact is allowed to receive.
 */
const updateContactAssetList = async (
  apiClient: APIClient,
  contactId: string,
  assetList: string[],
): Promise<UpdateContactResponse> => {
  const updated = await apiClient.updateContact({
    id: contactId,
    assetList,
  });

  console.log(`Contact ${updated.id} asset list updated to: ${updated.assetList}`);
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
