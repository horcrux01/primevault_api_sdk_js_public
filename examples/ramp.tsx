import { APIClient, Transaction, TransactionCategory } from "../src";

/**
 * Example: Create an ON_RAMP transaction (fiat → crypto).
 *
 * Flow:
 *  1. Fetch a trade quote for the ON_RAMP conversion via getTradeQuote.
 *  2. Extract the trade request/response data returned by the quote API.
 *  3. Submit a ramp transaction using the quote data via createRampTransaction.
 */
const createRampTransfer = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  // Step 1: Request a trade quote for converting 100 USD → USDC on Polygon
  // using ACH as the payment method. The category "ON_RAMP" tells the API
  // this is a fiat-to-crypto conversion.
  const tradeQuoteResponse = await apiClient.getTradeQuote({
    vaultId: "393f359c-6e66-4490-bf1f-5a4ec44f49d6",
    fromAsset: "USD",
    toAsset: "USDC",
    fromAmount: "100",
    category: "ON_RAMP",
    paymentMethod: "US_ACH",
    toChain: "POLYGON",
  });

  // Step 2: Extract the normalized request data and pick the first
  // available route from the list of quotes returned by the API.
  const tradeRequestData = tradeQuoteResponse.tradeRequestData;
  const tradeRoutes = tradeQuoteResponse.tradeResponseDataList || [];
  const tradeResponseData = tradeRoutes[0];

  const vaultId = "393f359c-6e66-4490-bf1f-5a4ec44f49d6";

  // Step 3: Create the ramp transaction by passing the quote data back
  // to the API along with payment and destination chain details.
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
