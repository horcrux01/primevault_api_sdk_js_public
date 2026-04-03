import { APIClient, ApprovalAction } from "../src";
import type { BankAccount, BankAccountListResponse, CreateBankAccountRequest } from "../src";

/**
 * Example: Create a bank account and approve it.
 *
 * Flow:
 *  1. Create a bank account with flat top-level fields.
 *  2. List bank accounts to verify creation.
 *  3. Fetch the created bank account by ID.
 *  4. Approve the pending bank account change request.
 *  5. Verify the bank account status after approval.
 */
const createAndApproveBankAccount = async (
  apiClient: APIClient,
): Promise<BankAccount> => {
  // Step 1: Create a bank account
  const request: CreateBankAccountRequest = {
    accountNumber: "123456789",
    accountName: "Treasury Account",
    routingNumber: "021000021",
    thirdParty: "Bridge",
    paymentMethod: "ACH",
    region: "US",
    bankName: "Chase",
    currency: "USD",
    streetLine: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
  };

  const bankAccount = await apiClient.createBankAccount(request);

  // The response contains all fields at the top level:
  //
  //   bankAccount.id
  //   bankAccount.status          // "PENDING"
  //   bankAccount.accountName     // "Treasury Account"
  //   bankAccount.accountNumber   // "123456789"
  //   bankAccount.routingNumber   // "021000021"
  //   bankAccount.bankName        // "Chase"
  //   bankAccount.currency        // "USD"
  //   bankAccount.city            // "New York"

  // Step 2: List bank accounts (optionally filter by status)
  const listResponse: BankAccountListResponse = await apiClient.getBankAccounts({ status: "PENDING" }, 20);

  for (const account of listResponse.results) {
    console.log(`  ${account.id} — ${account.accountName} (${account.status})`);
  }

  // Step 3: Fetch by ID
  const fetched = await apiClient.getBankAccountById(bankAccount.id);

  // Step 4: Approve the pending change request
  const approval = await apiClient.submitBankAccountApprovalAction(bankAccount.id);

  // Step 5: Verify status after approval
  const verified = await apiClient.getBankAccountById(bankAccount.id);

  return verified;
};

/**
 * Example: Decline a pending bank account change request.
 */
const declineBankAccount = async (
  apiClient: APIClient,
  bankAccountId: string,
): Promise<void> => {
  await apiClient.submitBankAccountApprovalAction(bankAccountId, ApprovalAction.REJECT);
};

const listBankAccounts = async (apiClient: APIClient) => {
    const allAccounts: BankAccount[] = [];
    let cursor: string | null = null;

    while (true) {
        const response: BankAccountListResponse = await apiClient.getBankAccounts(
            { status: "APPROVED" }, 20, cursor
        );
        allAccounts.push(...response.results);
        for (const account of response.results) {
            console.log(`  ${account.id} — ${account.accountName} (${account.status})`);
        }

        if (!response.has_next || !response.next_cursor) break;
        cursor = response.next_cursor;
    }

    console.log(`Total bank accounts: ${allAccounts.length}`);
}

export { createAndApproveBankAccount, declineBankAccount, listBankAccounts };
