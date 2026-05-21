import { APIClient, Transaction, TransactionCategory } from "../src";

/**
 * Example: GSR FIX trade — fetch a quote from GSR and execute it.
 *
 * GSR quotes are returned alongside other OTC quotes when category=TRADE.
 * The sourceName field identifies "GSR" quotes. Execution sends a FIX 4.2
 * NewOrderSingle to GSR's LumeFX venue with IOC time-in-force.
 */

/**
 * Fetch GSR quotes for a USD → USDT trade.
 * The response includes quotes from all configured sources (GSR, Telegram OTC, etc.)
 */
const getGSRQuote = async (apiClient: APIClient) => {
  const vaultId = "your-gsr-vault-id";

  const quoteResponse = await apiClient.getTradeQuote({
    vaultId,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "1000",
    category: TransactionCategory.TRADE,
  });

  const gsrQuotes = quoteResponse.tradeResponseDataList.filter(
    (q) => q.sourceName === "GSR",
  );

  console.log("GSR quotes:", gsrQuotes);
  console.log("All quotes:", quoteResponse.tradeResponseDataList);
  return quoteResponse;
};

/**
 * Execute a GSR trade: fetch quote, select the GSR source, create transaction.
 */
const executeGSRTrade = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "your-gsr-vault-id";

  const quoteResponse = await apiClient.getTradeQuote({
    vaultId,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "1000",
    category: TransactionCategory.TRADE,
  });

  const gsrQuote = quoteResponse.tradeResponseDataList.find(
    (q) => q.sourceName === "GSR",
  );
  if (!gsrQuote) {
    throw new Error("No GSR quote available for this pair");
  }

  console.log("Selected GSR quote:", {
    quoteId: gsrQuote.quoteId,
    finalToAmount: gsrQuote.finalToAmount,
    rate: gsrQuote.quoteResponseDict,
  });

  const transaction = await apiClient.createTradeTransaction({
    vaultId,
    tradeRequestData: quoteResponse.tradeRequestData,
    tradeResponseData: gsrQuote,
    externalId: "gsr-trade-001",
    memo: "GSR FIX trade — USD to USDT",
  });

  console.log("GSR trade transaction:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Sell-side GSR trade: USDT → USD.
 */
const executeGSRSellTrade = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "your-gsr-vault-id";

  const quoteResponse = await apiClient.getTradeQuote({
    vaultId,
    fromAsset: "USDT",
    toAsset: "USD",
    fromAmount: "500",
    category: TransactionCategory.TRADE,
  });

  const gsrQuote = quoteResponse.tradeResponseDataList.find(
    (q) => q.sourceName === "GSR",
  );
  if (!gsrQuote) {
    throw new Error("No GSR quote available for USDT/USD");
  }

  const transaction = await apiClient.createTradeTransaction({
    vaultId,
    tradeRequestData: quoteResponse.tradeRequestData,
    tradeResponseData: gsrQuote,
    externalId: "gsr-sell-001",
    memo: "GSR FIX trade — USDT to USD",
  });

  console.log("GSR sell trade:", transaction.id, transaction.status);
  return transaction;
};

export { getGSRQuote, executeGSRTrade, executeGSRSellTrade };
