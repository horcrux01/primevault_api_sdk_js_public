import { APIClient, ApprovalAction } from "../src";
import type { BankAccount, BankAccountListResponse, CreateBankAccountRequest } from "../src";

/**
 * Example: Create a bank account and approve it.
 *
 * `createBankAccountWithApproval` creates the bank account and approves the
 * pending change request, so the returned bank account is already approved. Use
 * `createBankAccount` / `createBankAccountApproval` to run the steps separately.
 */
const createAndApproveBankAccount = async (
  apiClient: APIClient,
): Promise<BankAccount> => {
  const request: CreateBankAccountRequest = {
    accountNumber: "123456789",
    accountName: "Treasury Account",
    routingNumber: "021000021",
    paymentMethod: "ACH",
    bankName: "Chase",
    currency: "USD",
    streetLine: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
  };

  const bankAccount = await apiClient.createBankAccountWithApproval(request);

  // The response contains all fields at the top level:
  //
  //   bankAccount.id
  //   bankAccount.status          // "APPROVED"
  //   bankAccount.accountName     // "Treasury Account"
  //   bankAccount.accountNumber   // "123456789"
  //   bankAccount.routingNumber   // "021000021"
  //   bankAccount.bankName        // "Chase"
  //   bankAccount.currency        // "USD"
  //   bankAccount.city            // "New York"
  console.log(
    `Created and approved: ${bankAccount.id} status=${bankAccount.status}`,
  );

  return bankAccount;
};

/**
 * Example: Decline a pending bank account change request.
 */
const declineBankAccount = async (
  apiClient: APIClient,
  bankAccountId: string,
): Promise<void> => {
  await apiClient.approveChangeRequest({
    entityId: bankAccountId,
    action: ApprovalAction.REJECT,
  });
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

        if (!response.hasNext || !response.nextCursor) break;
        cursor = response.nextCursor;
    }

    console.log(`Total bank accounts: ${allAccounts.length}`);
}

export { createAndApproveBankAccount, declineBankAccount, listBankAccounts };
