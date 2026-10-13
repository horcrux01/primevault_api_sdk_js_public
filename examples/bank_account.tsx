import { APIClient, ApprovalAction, PaymentRail } from "../src";
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
    accountName: "Treasury Account",
    bankAccountInfo: {
      accountNumber: "123456789",
      routingNumber: "021000021",
      bankName: "Chase",
      country: "US",
      accountType: "CHECKING",
    },
    paymentRails: [PaymentRail.ACH],
    currency: "USD",
    externalId: "treasury-usd-001",
    beneficiary: {
      entityType: "BUSINESS",
      business: { legalName: "Acme Treasury LLC", registrationCountry: "US" },
      address: {
        streetLine1: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "US",
      },
      identifications: [{ type: "TAX_ID", value: "12-3456789" }],
    },
    tags: ["treasury", "payroll"],
  };

  const bankAccount = await apiClient.createBankAccountWithApproval(request);

  // The bank details and the beneficiary come back nested:
  //
  //   bankAccount.id
  //   bankAccount.status                           // "APPROVED"
  //   bankAccount.accountName                      // "Treasury Account"
  //   bankAccount.bankAccountInfo?.accountNumber   // "123456789"
  //   bankAccount.bankAccountInfo?.routingNumber   // "021000021"
  //   bankAccount.bankAccountInfo?.bankName        // "Chase"
  //   bankAccount.paymentRails                     // ["ACH"]
  //   bankAccount.currency                         // "USD"
  //   bankAccount.externalId                       // "treasury-usd-001"
  //   bankAccount.beneficiary?.address.city        // "New York"
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

const findBankAccountByExternalId = async (
  apiClient: APIClient,
  externalId: string,
): Promise<BankAccount | undefined> => {
  const response = await apiClient.getBankAccounts({ externalId });
  return response.results[0];
};

export {
  createAndApproveBankAccount,
  declineBankAccount,
  findBankAccountByExternalId,
  listBankAccounts,
};
