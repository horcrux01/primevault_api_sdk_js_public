import { APIClient, PaymentMethod, Transaction, TransactionCategory, TransferPartyType } from "../src";

/**
 * Example: Create an OFF_RAMP transaction (crypto → fiat).
 *
 * Flow:
 *  1. Fetch a ramp quote for the OFF_RAMP conversion via getRampQuote.
 *     - source is the vault holding the crypto.
 *     - category is OFF_RAMP.
 *     - fromAsset is the crypto (e.g. USDT), toAsset is fiat (e.g. USD).
 *  2. Use the quote to create the off-ramp transaction.
 *     - source is the vault (crypto leaves here).
 *     - destination is the bank account (fiat arrives here).
 */
const createOffRampTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";
  const bankAccountId = "your-approved-bank-account-id";

  const source = {
    type: TransferPartyType.VAULT,
    id: vaultId,
  };

  const destination = {
    type: TransferPartyType.EXTERNAL_BANK_ACCOUNT,
    id: bankAccountId,
  };

  // Step 1: Get off-ramp quote
  const rampQuoteRequest = {
    source,
    fromAsset: "USDT",
    toAsset: "USD",
    fromAmount: "100",
    fromChain: "ETHEREUM",
    category: TransactionCategory.OFF_RAMP as const,
    paymentMethod: PaymentMethod.US_ACH,
  };

  const rampQuoteResponse = await apiClient.getRampQuote(rampQuoteRequest);

  // Step 2: Create the off-ramp transaction
  const offRampTransaction = await apiClient.createOffRampTransaction({
    source,
    destination,
    rampRequestData: rampQuoteRequest,
    rampResponseData: rampQuoteResponse,
    externalId: "off-ramp-example-1",
    memo: "off ramp example",
  });

  // The transaction response includes bank details for the fiat delivery
  // in the destination field:
  //
  //   offRampTransaction.destination?.type   // "EXTERNAL_BANK_ACCOUNT"
  //   offRampTransaction.destination?.bank?.bankName
  //   offRampTransaction.destination?.bank?.beneficiaryName
  //   offRampTransaction.destination?.bank?.routingNumber
  //   offRampTransaction.destination?.bank?.paymentRail
  //   offRampTransaction.destination?.bank?.currency

  return offRampTransaction;
};

export { createOffRampTransaction };
