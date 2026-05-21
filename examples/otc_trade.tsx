import {
  APIClient,
  Transaction,
  TransactionCategory,
  TransactionSubCategory,
  TransferPartyType,
} from "../src";

/**
 * OTC Trade E2E example — full lifecycle:
 *  1. Get quote (category=TRADE)
 *  2. Execute quote (create trade transaction)
 *  3. Get deposit address
 *  4. Create deposit transfer
 *  5. Create withdraw transfer
 */

const VAULT_ID = "your-vault-id";

/**
 * Step 1: Get OTC trade quote.
 * Returns quotes from all configured OTC sources (GSR, Telegram, etc.)
 */
const getQuote = async (apiClient: APIClient) => {
  const quoteResponse = await apiClient.getTradeQuote({
    vaultId: VAULT_ID,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "100",
    category: TransactionCategory.TRADE,
  });

  console.log("Request:", quoteResponse.tradeRequestData);
  console.log("Quotes:", quoteResponse.tradeResponseDataList);
  return quoteResponse;
};

/**
 * Step 2: Execute quote — pick first quote and create trade transaction.
 */
const executeQuote = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await apiClient.getTradeQuote({
    vaultId: VAULT_ID,
    fromAsset: "USD",
    toAsset: "USDT",
    fromAmount: "100",
    category: TransactionCategory.TRADE,
  });

  const selectedQuote = quoteResponse.tradeResponseDataList[0];

  const transaction = await apiClient.createTradeTransaction({
    vaultId: VAULT_ID,
    tradeRequestData: quoteResponse.tradeRequestData,
    tradeResponseData: selectedQuote,
    externalId: "otc-trade-001",
    memo: "USD to USDT OTC trade",
  });

  console.log("Transaction:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Step 3: Get deposit address for the vault.
 */
const getDepositAddr = async (apiClient: APIClient) => {
  const response = await apiClient.getDepositAddress(VAULT_ID, "USDC");

  console.log("Deposit addresses:", response.addresses);
  return response;
};

/**
 * Step 4: Create deposit transfer (asset coming into the vault).
 */
const createDeposit = async (apiClient: APIClient): Promise<Transaction> => {
  const transaction = await apiClient.createAssetTransfer({
    vaultId: VAULT_ID,
    asset: "USDT",
    amount: "500",
    subCategory: TransactionSubCategory.DEPOSIT,
    counterparty: {
      type: TransferPartyType.EXTERNAL_ADDRESS,
      name: "Circle Treasury",
    },
    externalId: "deposit-001",
    memo: "USDT deposit from Circle",
  });

  console.log("Deposit:", transaction.id, transaction.status);
  return transaction;
};

/**
 * Step 5: Create withdraw transfer (asset leaving the vault).
 */
const createWithdraw = async (apiClient: APIClient): Promise<Transaction> => {
  const transaction = await apiClient.createAssetTransfer({
    vaultId: VAULT_ID,
    asset: "USD",
    amount: "250",
    subCategory: TransactionSubCategory.WITHDRAW,
    counterparty: {
      type: TransferPartyType.BANK_ACCOUNT,
      id: "your-bank-account-id",
    },
    externalId: "withdraw-001",
    memo: "USD withdrawal to bank",
  });

  console.log("Withdraw:", transaction.id, transaction.status);
  return transaction;
};

export { getQuote, executeQuote, getDepositAddr, createDeposit, createWithdraw };
