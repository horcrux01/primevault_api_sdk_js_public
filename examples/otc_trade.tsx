import {
  APIClient,
  Transaction,
  TransactionCategory,
  TransactionSubCategory,
  TransferPartyType,
} from "../src";

/**
 * Example: OTC trade — fetch a quote and execute it.
 *
 * Flow:
 *  1. Call getTradeQuote with category=TRADE to get OTC quotes (GSR, Telegram, etc.)
 *  2. Pick a quote from the response list
 *  3. Create the trade transaction to execute the quote
 */
const getOTCQuote = async (apiClient: APIClient) => {
  const vaultId = "your-vault-id";

  const quoteResponse = await apiClient.getTradeQuote({
    vaultId,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "100",
    category: TransactionCategory.TRADE,
  });

  console.log("Trade request:", quoteResponse.tradeRequestData);
  console.log("Available quotes:", quoteResponse.tradeResponseDataList);
  return quoteResponse;
};

const executeOTCTrade = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "your-vault-id";

  const quoteResponse = await apiClient.getTradeQuote({
    vaultId,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "100",
    category: TransactionCategory.TRADE,
  });

  const selectedQuote = quoteResponse.tradeResponseDataList[0];

  const transaction = await apiClient.createTradeTransaction({
    vaultId,
    tradeRequestData: quoteResponse.tradeRequestData,
    tradeResponseData: selectedQuote,
    externalId: "otc-trade-001",
    memo: "USD to USDT OTC trade",
  });

  console.log("Trade transaction created:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Example: Create a DEPOSIT (asset transfer into the vault).
 */
const createDeposit = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const transaction = await apiClient.createAssetTransfer({
    vaultId: "your-vault-id",
    asset: "USDC",
    amount: "1000",
    subCategory: TransactionSubCategory.DEPOSIT,
    counterparty: {
      type: TransferPartyType.VAULT,
      id: "source-vault-id",
    },
    externalId: "deposit-001",
  });

  console.log("Deposit created:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Example: Create a WITHDRAW (asset transfer out of the vault).
 */
const createWithdraw = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const transaction = await apiClient.createAssetTransfer({
    vaultId: "your-vault-id",
    asset: "USDC",
    amount: "500",
    subCategory: TransactionSubCategory.WITHDRAW,
    counterparty: {
      type: TransferPartyType.EXTERNAL_ADDRESS,
      address: "0x1234567890abcdef1234567890abcdef12345678",
    },
    externalId: "withdraw-001",
  });

  console.log("Withdraw created:", transaction.id, transaction.status);
  return transaction;
};

export { getOTCQuote, executeOTCTrade, createDeposit, createWithdraw };
