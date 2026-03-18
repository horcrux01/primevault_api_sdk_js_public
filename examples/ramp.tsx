import { APIClient, Transaction, TransactionCategory } from "../src";

const createRampTransfer = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const tradeQuoteResponse = await apiClient.getTradeQuote({
    vaultId: "393f359c-6e66-4490-bf1f-5a4ec44f49d6",
    fromAsset: "USD",
    toAsset: "USDC",
    fromAmount: "100",
    category: "ON_RAMP",
    paymentMethod: "US_ACH",
    toChain: "POLYGON",
  });

  const tradeRequestData = tradeQuoteResponse.tradeRequestData;
  const tradeRoutes = tradeQuoteResponse.tradeResponseDataList || [];
  const tradeResponseData = tradeRoutes[0];

  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";

  const onRampTransactionResponse = await apiClient.createRampTransaction({
    vaultId,
    category: TransactionCategory.ON_RAMP,
    tradeRequestData,
    tradeResponseData,
    externalId: "on-ramp-ext-8",
    operationMessage: "ON_RAMP test",
    memo: "on ramp test",
    paymentMethod: "US_ACH",
    toBlockChain: "POLYGON",
  });

  return onRampTransactionResponse;
};

export { createRampTransfer };
