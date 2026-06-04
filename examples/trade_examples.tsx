import { APIClient, Transaction, TransferPartyType } from "../src";
import type {
  QuoteResponseItem,
  TransactionIntentRequest,
  TransferPartyData,
} from "../src";

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
  fromAsset: "USDT",
  fromAmount: "100",
  toAsset: "USD",
});

const getTradeQuote = async (
  apiClient: APIClient,
): Promise<QuoteResponseItem> => {
  const quoteResponse = await apiClient.getQuote({ intent: tradeIntent() });
  return quoteResponse.quotes[0];
};

const createTrade = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await getTradeQuote(apiClient);
  return await apiClient.createTransactionFromIntent({
    quoteId: quoteResponse.quoteId,
    externalId: "trade-001",
    memo: "USDT to USD trade from quote",
  });
};

const createDeposit = async (apiClient: APIClient): Promise<Transaction> => {
  const source: TransferPartyData = {
    type: TransferPartyType.CONTACT,
    id: "contact-id",
  };
  const destination: TransferPartyData = {
    type: TransferPartyType.VAULT,
    id: VAULT_ID,
  };

  return await apiClient.createTransactionFromIntent({
    intent: {
      source,
      destination,
      fromAsset: "USDT",
      fromAmount: "500",
      fromChain: "ETHEREUM",
    },
    quoteId: null,
    externalId: "deposit-001",
    memo: "USDT deposit from Circle",
  });
};

const createWithdraw = async (apiClient: APIClient): Promise<Transaction> => {
  const source: TransferPartyData = {
    type: TransferPartyType.VAULT,
    id: VAULT_ID,
  };
  const destination: TransferPartyData = {
    type: TransferPartyType.BANK_ACCOUNT,
    id: "bank-account-id",
  };

  return await apiClient.createTransactionFromIntent({
    intent: {
      source,
      destination,
      fromAsset: "USD",
      fromAmount: "250",
    },
    quoteId: null,
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

export {
  createDeposit,
  createTrade,
  createWithdraw,
  getTradeQuote,
  markDepositDone,
};
