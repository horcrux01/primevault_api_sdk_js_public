import { APIClient, Transaction, TransferPartyType } from "../src";
import type { QuoteResponseItem, TransactionIntentRequest } from "../src";

const TRADE_VAULT_ID = "vault_id";

// A trade quote names only the assets. The Trade Vault with the best quote is selected.
const tradeIntent = (): TransactionIntentRequest => ({
  input: { asset: "USD", amount: "100" },
  output: { asset: "USDT" },
});

const getTradeQuote = async (
  apiClient: APIClient,
): Promise<QuoteResponseItem> => {
  const quoteResponse = await apiClient.getQuote({ intent: tradeIntent() });
  return quoteResponse.quotes[0];
};

const createTrade = async (apiClient: APIClient): Promise<Transaction> => {
  const quote = await getTradeQuote(apiClient);
  console.log("Quoted selections:", quote.input, quote.output);
  return await apiClient.createTransactionFromIntent({
    quoteId: quote.quoteId,
    externalId: "trade-001",
    memo: "USD to USDT trade from quote",
  });
};

const createDeposit = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await apiClient.getQuote({
    intent: {
      input: { asset: "USD", amount: "100" },
      output: { asset: "USD" },
      source: { type: TransferPartyType.CONTACT, id: "contact-id" },
      destination: { type: TransferPartyType.VAULT, id: TRADE_VAULT_ID },
    },
  });
  const deposit = await apiClient.createTransactionFromIntent({
    quoteId: quoteResponse.quotes[0].quoteId,
    externalId: "deposit-001",
    memo: "USD deposit from quote",
  });
  console.log("Deposit instructions:", deposit.depositInstructions);
  return deposit;
};

const createWithdraw = async (apiClient: APIClient): Promise<Transaction> => {
  const quoteResponse = await apiClient.getQuote({
    intent: {
      input: { asset: "USD" },
      output: { asset: "USD", amount: "50" },
      source: { type: TransferPartyType.VAULT, id: TRADE_VAULT_ID },
      destination: {
        type: TransferPartyType.BANK_ACCOUNT,
        id: "bank-account-id",
        paymentRail: "WIRE",
      },
    },
  });
  return await apiClient.createTransactionFromIntent({
    quoteId: quoteResponse.quotes[0].quoteId,
    externalId: "withdraw-001",
    memo: "USD withdrawal from quote",
  });
};

export { createDeposit, createTrade, createWithdraw, getTradeQuote };
