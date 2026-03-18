import { APIClient, Transaction, TransactionCategory } from "../src";

const createOnRampTransfer = async (apiClient: APIClient): Promise<Transaction> => {
  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";

  const onRampRequestData = {
    vaultId,
    amount: "100",
    currency: "USD",
    asset: "USDC",
    category: TransactionCategory.ON_RAMP,
    blockChain: "POLYGON",
    paymentMethod: "US_ACH",
  };

  const rampQuotes = await apiClient.getRampExchangeRates(onRampRequestData);
  if (!rampQuotes.length) {
    throw new Error("No on-ramp quotes returned for the requested conversion.");
  }

  const selectedQuote = rampQuotes[0];

  const onRampTransactionResponse = await apiClient.createOnRampTransaction({
    vaultId,
    quoteId: selectedQuote.quoteId,
    onRampRequestData,
    onRampResponseData: selectedQuote,
    externalId: "on-ramp-ext-8",
    memo: "on ramp test",
  });

  return onRampTransactionResponse;
};

export { createOnRampTransfer };
