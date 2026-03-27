import { APIClient } from "../src";
import type { Contact, UpdateContactResponse } from "../src";

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

  // Step 2: Approve the contact
  const approval = await apiClient.approveContact(contact.id);

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
  await apiClient.declineContact(contactId);
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

export { createAndApproveContact, declineContactExample, updateContactAssetList };
