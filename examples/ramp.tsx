import { APIClient, Transaction, TransactionCategory } from "../src";

const createOnRampTransfer = async (apiClient: APIClient): Promise<Transaction> => {
  // Replace these sample values with your own vault and quote preferences.
  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";
  const amount = "100";
  const currency = "USD";
  const asset = "USDC";
  const blockChain = "POLYGON";
  const paymentMethod = "US_ACH";

  const onRampRequestData = {
    vaultId,
    amount,
    currency,
    asset,
    category: TransactionCategory.ON_RAMP,
    blockChain,
    paymentMethod,
  };

  const onRampQuotes = await apiClient.getRampExchangeRates(onRampRequestData);
  if (!onRampQuotes.length) {
    throw new Error("No on-ramp quotes returned for the requested conversion.");
  }

  const selectedQuote = onRampQuotes[0];

  const onRampTransactionResponse = await apiClient.createOnRampTransaction({
    vaultId,
    quoteId: selectedQuote.quoteId,
    onRampRequestData,
    onRampResponseData: selectedQuote,
    externalId: "on-ramp-ext-8",
    memo: "ON_RAMP test",
  });

  return onRampTransactionResponse;
};

export { createOnRampTransfer };
