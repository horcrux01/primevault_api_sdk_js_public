import {
  APIClient,
  Transaction,
  TransactionCategory,
  TransactionSubCategory,
  TransferPartyType,
} from "../src";

/**
 * GSR FIX Trade E2E example — full lifecycle:
 *  1. Get quote (GSR FIX 4.2 QuoteRequest)
 *  2. Execute quote (FIX NewOrderSingle with IOC)
 *  3. Get deposit address
 *  4. Create deposit transfer
 *  5. Create withdraw transfer
 */

const GSR_VAULT_ID = "your-gsr-vault-id";

/**
 * Step 1: Get GSR quote — filter by sourceName "GSR".
 */
const getQuote = async (apiClient: APIClient) => {
  const quoteResponse = await apiClient.getTradeQuote({
    vaultId: GSR_VAULT_ID,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "1000",
    category: TransactionCategory.TRADE,
  });

  const gsrQuotes = quoteResponse.tradeResponseDataList.filter(
    (q) => q.sourceName === "GSR",
  );

  console.log("GSR quotes:", gsrQuotes);
  return quoteResponse;
};

/**
 * Step 2: Execute GSR quote — BUY (USD → USDT).
 */
const executeQuote = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await apiClient.getTradeQuote({
    vaultId: GSR_VAULT_ID,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "1000",
    category: TransactionCategory.TRADE,
  });

  const gsrQuote = quoteResponse.tradeResponseDataList.find(
    (q) => q.sourceName === "GSR",
  );
  if (!gsrQuote) {
    throw new Error("No GSR quote available");
  }

  const transaction = await apiClient.createTradeTransaction({
    vaultId: GSR_VAULT_ID,
    tradeRequestData: quoteResponse.tradeRequestData,
    tradeResponseData: gsrQuote,
    externalId: "gsr-trade-001",
    memo: "GSR FIX trade — USD to USDT",
  });

  console.log("Transaction:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Step 2b: Execute GSR quote — SELL (USDT → USD).
 */
const executeSellQuote = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await apiClient.getTradeQuote({
    vaultId: GSR_VAULT_ID,
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
    vaultId: GSR_VAULT_ID,
    tradeRequestData: quoteResponse.tradeRequestData,
    tradeResponseData: gsrQuote,
    externalId: "gsr-sell-001",
    memo: "GSR FIX trade — USDT to USD",
  });

  console.log("Transaction:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Step 3: Get deposit address for the GSR vault.
 */
const getDepositAddr = async (apiClient: APIClient) => {
  const response = await apiClient.getDepositAddress(GSR_VAULT_ID, "USDC");

  console.log("Deposit addresses:", response.addresses);
  return response;
};

/**
 * Step 4: Create deposit transfer on GSR vault.
 */
const createDeposit = async (apiClient: APIClient): Promise<Transaction> => {
  const transaction = await apiClient.createAssetTransfer({
    vaultId: GSR_VAULT_ID,
    asset: "USDT",
    amount: "500",
    subCategory: TransactionSubCategory.DEPOSIT,
    counterparty: {
      type: TransferPartyType.EXTERNAL_ADDRESS,
      name: "Circle Treasury",
    },
    externalId: "gsr-deposit-001",
    memo: "USDT deposit to GSR vault",
  });

  console.log("Deposit:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Step 5: Create withdraw transfer from GSR vault.
 */
const createWithdraw = async (apiClient: APIClient): Promise<Transaction> => {
  const transaction = await apiClient.createAssetTransfer({
    vaultId: GSR_VAULT_ID,
    asset: "USD",
    amount: "250",
    subCategory: TransactionSubCategory.WITHDRAW,
    counterparty: {
      type: TransferPartyType.BANK_ACCOUNT,
      id: "your-bank-account-id",
    },
    externalId: "gsr-withdraw-001",
    memo: "USD withdrawal from GSR vault",
  });

  console.log("Withdraw:", transaction.id, transaction.status);
  return transaction;
};

export { getQuote, executeQuote, executeSellQuote, getDepositAddr, createDeposit, createWithdraw };
