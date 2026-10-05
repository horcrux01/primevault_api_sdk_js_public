import { APIClient, Transaction, TransferPartyType } from "../src";
import type { QuoteResponseItem, TransactionIntentRequest } from "../src";

const VAULT_ID = "vault_id";

const tradeIntent = (): TransactionIntentRequest => ({
  source: {
    type: TransferPartyType.VAULT,
    id: VAULT_ID,
  },
  destination: {
    type: TransferPartyType.VAULT,
    id: VAULT_ID,
  },
  input: { asset: "USDT", amount: "100" },
  output: { asset: "USD" },
});

const getTradeQuote = async (
  apiClient: APIClient,
): Promise<QuoteResponseItem> => {
  const quoteResponse = await apiClient.getQuote({ intent: tradeIntent() });
  return quoteResponse.quotes[0];
};

const createTrade = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await getTradeQuote(apiClient);
  console.log(
    "Quoted selections:",
    quoteResponse.input,
    quoteResponse.output,
  );
  return await apiClient.createTransactionFromIntent({
    quoteId: quoteResponse.quoteId,
    externalId: "trade-001",
    memo: "USDT to USD trade from quote",
  });
};

const createDeposit = async (apiClient: APIClient): Promise<Transaction> => {
  return await apiClient.createTransactionFromIntent({
    intent: {
      input: { asset: "USDT", amount: "500" },
      output: { asset: "USDT" },
      source: {
        type: TransferPartyType.CONTACT,
        id: "contact-id",
        chain: "ETHEREUM",
      },
      destination: { type: TransferPartyType.VAULT, id: VAULT_ID },
    },
    externalId: "deposit-001",
    memo: "USDT deposit from Circle",
  });
};

const createWithdraw = async (apiClient: APIClient): Promise<Transaction> => {
  return await apiClient.createTransactionFromIntent({
    intent: {
      input: { asset: "USD", amount: "250" },
      output: { asset: "USD" },
      source: { type: TransferPartyType.VAULT, id: VAULT_ID },
      destination: {
        type: TransferPartyType.BANK_ACCOUNT,
        id: "bank-account-id",
      },
    },
    externalId: "withdraw-001",
    memo: "USD withdrawal to bank",
  });
};

const markDepositDone = async (
  apiClient: APIClient,
  transactionId: string,
): Promise<Transaction> => {
  return await apiClient.markDepositDone(transactionId);
};

export { createDeposit, createTrade, createWithdraw, getTradeQuote, markDepositDone };
