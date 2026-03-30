import { APIClient, Transaction, TransactionCategory, TransferPartyType } from "../src";

/**
 * Example: Create an ON_RAMP transaction (fiat → crypto).
 *
 * Flow:
 *  1. Fetch a ramp quote for the ON_RAMP conversion via getRampQuote.
 *  2. Pass the selected quote's quoteId to create the on-ramp transaction.
 */
const createOnRampTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";

  const destination = {
    type: TransferPartyType.VAULT,
    id: vaultId,
  };

  // Step 1: Request a ramp quote for converting 100 USD → USDC on Polygon on destination vault.
  const rampQuoteRequest = {
    destination,
    fromAsset: "USD",
    toAsset: "USDC",
    fromAmount: "100",
    toChain: "POLYGON",
    category: TransactionCategory.ON_RAMP as const,
  };

  const rampQuoteResponse = await apiClient.getRampQuote(rampQuoteRequest);
  const selectedQuote = rampQuoteResponse.quotes[0];

  // Step 2: Create the on-ramp transaction using the selected quote.
  const onRampTransaction = await apiClient.createOnRampTransaction({
    destination,
    quoteId: selectedQuote.quoteId,
    externalId: "on-ramp-1110eee2e",
    memo: "on ramp test",
  });

  // The transaction response includes bank details for the fiat deposit
  // in the source field:
  //
  //   onRampTransaction.source?.type     // "EXTERNAL_BANK_ACCOUNT"
  //   onRampTransaction.source?.name     // e.g. "PrimeVault Treasury"
  //   onRampTransaction.source?.bank?.bankName           // e.g. "PrimeVault National Bank"
  //   onRampTransaction.source?.bank?.beneficiaryName    // e.g. "PrimeVault Treasury"
  //   onRampTransaction.source?.bank?.accountNumberMasked
  //   onRampTransaction.source?.bank?.routingNumber
  //   onRampTransaction.source?.bank?.swiftBic
  //   onRampTransaction.source?.bank?.paymentRail        // e.g. "US_ACH"
  //   onRampTransaction.source?.bank?.currency           // e.g. "USD"
  //   onRampTransaction.source?.bank?.bankAddress
  //   onRampTransaction.source?.bank?.iban

  return onRampTransaction;
};

/**
 * Example: Create an OFF_RAMP transaction (crypto → fiat).
 *
 * Flow:
 *  1. Fetch a ramp quote for the OFF_RAMP conversion via getRampQuote.
 *  2. Pass the selected quote's quoteId to create the off-ramp transaction.
 */
const createOffRampTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";
  const bankAccountId = "your-bank-account-id";

  const source = {
    type: TransferPartyType.VAULT,
    id: vaultId,
  };

  const destination = {
    type: TransferPartyType.EXTERNAL_BANK_ACCOUNT,
    id: bankAccountId,
  };

  const rampQuoteRequest = {
    source,
    fromAsset: "USDT",
    toAsset: "USD",
    fromAmount: "100",
    fromChain: "ETHEREUM",
    category: TransactionCategory.OFF_RAMP as const,
  };

  const rampQuoteResponse = await apiClient.getRampQuote(rampQuoteRequest);
  const selectedQuote = rampQuoteResponse.quotes[0];

  const offRampTransaction = await apiClient.createOffRampTransaction({
    source,
    destination,
    quoteId: selectedQuote.quoteId,
    externalId: "off-ramp-example-1",
    memo: "off ramp test",
  });

  // The transaction response includes bank details for the fiat delivery
  // in the destination field:
  //
  //   offRampTransaction.destination?.type   // "EXTERNAL_BANK_ACCOUNT"
  //   offRampTransaction.destination?.bank?.bankName
  //   offRampTransaction.destination?.bank?.beneficiaryName
  //   offRampTransaction.destination?.bank?.routingNumber
  //   offRampTransaction.destination?.bank?.currency

  return offRampTransaction;
};

export { createOnRampTransaction, createOffRampTransaction };
