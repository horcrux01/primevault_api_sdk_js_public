import { APIClient, PaymentMethod, Transaction, TransactionCategory, TransferPartyType } from "../src";

/**
 * Example: Create an ON_RAMP transaction (fiat → crypto).
 *
 * Flow:
 *  1. Fetch a ramp quote for the ON_RAMP conversion via getRampQuote.
 *  2. Use the quote request and response data to create the on-ramp transaction.
 */
const createOnRampTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";

  const destination = {
    type: TransferPartyType.VAULT,
    id: vaultId,
  };

  // Step 1: Request a ramp quote for converting 100 USD → USDC on Polygon on destination vault
  // using ACH as the payment method.
  const rampQuoteRequest = {
    destination,
    fromAsset: "USD",
    toAsset: "USDC",
    fromAmount: "100",
    toChain: "POLYGON",
    category: TransactionCategory.ON_RAMP as const,
    paymentMethod: PaymentMethod.US_ACH,
  };

  const rampQuoteResponse = await apiClient.getRampQuote(rampQuoteRequest);

  // Step 2: Create the on-ramp transaction using the quote data.
  const onRampTransaction = await apiClient.createOnRampTransaction({
    destination,
    rampRequestData: rampQuoteRequest,
    rampResponseData: rampQuoteResponse,
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

export { createOnRampTransaction };
