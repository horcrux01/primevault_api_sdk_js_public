import { APIClient, Transaction, TransactionCategory } from "../src";

const createOnRampTransfer = async (apiClient: APIClient): Promise<Transaction> => {
  const createTradeQuoteRequest = {
    vaultId: "393f359c-6e66-4490-bf1f-5a4ec44f49d6",
    fromAsset: "USD",
    toAsset: "USDC",
    fromAmount: "100",
    category: TransactionCategory.ON_RAMP,
    paymentMethod: "US_ACH",
    toChain: "POLYGON",
  };

  const tradeResponse = await apiClient.getTradeQuote(createTradeQuoteRequest);
  const tradeRequestData = tradeResponse.tradeRequestData;
  const tradeRoutes = tradeResponse.tradeResponseDataList || [];
  const tradeResponseData = tradeRoutes[0];
  if (!tradeResponseData) {
    throw new Error("No on-ramp trade routes returned for the requested conversion.");
  }
  if (!tradeResponseData.quoteId) {
    throw new Error("Missing quoteId in on-ramp trade response.");
  }

  const onRampTransactionResponse = await apiClient.createOnRampTransaction({
    vaultId: createTradeQuoteRequest.vaultId,
    quoteId: tradeResponseData.quoteId,
    onRampRequestData: tradeRequestData,
    onRampResponseData: tradeResponseData,
    externalId: "on-ramp-ext-8",
    memo: "on ramp test",
  });

  return onRampTransactionResponse;
};

export { createOnRampTransfer };
