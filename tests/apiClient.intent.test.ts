import {
  BankDetails,
  DepositInstructions,
  QuoteResponse,
  Transaction,
  TransactionCategory,
  TransactionIntentRequest,
  TransactionListResponse,
  TransactionStatus,
  TransactionSubCategory,
  TransferPartyData,
  TransferPartyType,
} from "../src";
import { createMockClient, transaction } from "./helpers";

describe("APIClient intent transactions", () => {
  test("quotes preserve supplied intent fields and omit removed JavaScript fields", async () => {
    const { client, post } = createMockClient();
    const source: TransferPartyData = {
      type: TransferPartyType.BANK_ACCOUNT,
      id: "bank-account-id",
      paymentRail: "WIRE",
    };
    const intent: TransactionIntentRequest = {
      input: { asset: "USD", vaultId: "fiat-vault-id" },
      output: { asset: "USDC", amount: "100", vaultId: "crypto-vault-id" },
      source,
      destination: {
        type: TransferPartyType.VAULT,
        id: "crypto-vault-id",
        chain: "ETHEREUM",
      },
    };
    const response: QuoteResponse = {
      quotes: [
        {
          quoteId: "quote-id",
          rate: null,
          fees: null,
          input: { ...intent.input, amount: "101.25" },
          output: intent.output,
        },
      ],
    };
    post.mockResolvedValue(response);

    const request = {
      subOrgId: "removed-sub-org",
      category: "RAMP",
      intent: {
        ...intent,
        routeAccounts: [{ provider: "removed-provider" }],
        source: {
          ...source,
          subOrgId: "removed-party-sub-org",
          provider: "removed-party-provider",
          bank: { accountNumber: "000123456789" },
          bankDetails: { accountNumber: "000123456789" },
        },
      },
    };
    const result = await client.getQuote(request);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/api/external/transactions/v2/quote/", {
      intent,
    });
    expect(result).toBe(response);
  });

  test("a best quote names neither party and returns the parties it priced", async () => {
    const { client, post } = createMockClient();
    const lpVault = { type: TransferPartyType.VAULT, id: "lp-vault-id" };
    const response: QuoteResponse = {
      quotes: [
        {
          quoteId: "quote-id",
          rate: "1.00030009",
          fees: { amount: "0", asset: "USDT" },
          input: { asset: "USDT", amount: "10000" },
          output: { asset: "USD", amount: "10003" },
          source: lpVault,
          destination: lpVault,
          expiresAt: "2026-09-30T10:00:30+00:00",
        },
      ],
    };
    post.mockResolvedValue(response);

    const result = await client.getQuote({
      intent: {
        input: { asset: "USDT", amount: "10000" },
        output: { asset: "USD" },
      },
    });

    expect(post).toHaveBeenCalledWith("/api/external/transactions/v2/quote/", {
      intent: {
        input: { asset: "USDT", amount: "10000" },
        output: { asset: "USD" },
      },
    });
    expect(result).toBe(response);
  });

  test("preserves crypto swap slippage when quoting and executing an intent", async () => {
    const { client, post } = createMockClient();
    const intent: TransactionIntentRequest = {
      input: { asset: "USDC", amount: "100.123456" },
      output: { asset: "USDT" },
      source: {
        type: TransferPartyType.VAULT,
        id: "vault-id",
        chain: "ETHEREUM",
      },
      destination: {
        type: TransferPartyType.VAULT,
        id: "vault-id",
        chain: "POLYGON",
      },
      slippage: "0.50",
    };
    const response: QuoteResponse = {
      quotes: [{ quoteId: "swap-quote-id", ...intent }],
    };
    const created: Transaction = {
      ...transaction,
      category: TransactionCategory.SWAP,
      subCategory: TransactionSubCategory.MARKET_TRADE,
      quoteResponse: response.quotes[0],
    };
    post.mockResolvedValueOnce(response).mockResolvedValueOnce(created);

    const quoted = await client.getQuote({ intent });
    expect(quoted.quotes[0].slippage).toBe("0.50");
    expect(post).toHaveBeenNthCalledWith(
      1,
      "/api/external/transactions/v2/quote/",
      { intent },
    );

    const result = await client.createTransactionFromIntent({
      intent,
      quoteId: quoted.quotes[0].quoteId,
    });
    expect(result).toBe(created);
    expect(result.quoteResponse?.slippage).toBe("0.50");
    expect(post).toHaveBeenNthCalledWith(
      2,
      "/api/external/transactions/intent/create/",
      {
        intent,
        quoteId: "swap-quote-id",
        externalId: undefined,
        memo: undefined,
      },
    );
  });

  test("reads completed swaps without a saved quote ID or slippage", async () => {
    const { client, get } = createMockClient();
    const completed: Transaction = {
      ...transaction,
      category: TransactionCategory.SWAP,
      subCategory: TransactionSubCategory.MARKET_TRADE,
      status: TransactionStatus.COMPLETED,
      quoteResponse: {
        input: { asset: "USDC", amount: "10" },
        output: { asset: "USDT", amount: "9.992028" },
        rate: "0.9992028",
        fees: null,
        slippage: null,
      },
    };
    const page: TransactionListResponse = {
      results: [completed],
      nextCursor: null,
      hasNext: false,
    };
    get.mockResolvedValueOnce(page).mockResolvedValueOnce(completed);

    expect(await client.getTransactions()).toBe(page);
    expect(await client.getTransactionById(completed.id)).toBe(completed);
    expect(get.mock.calls).toEqual([
      ["/api/external/transactions/?limit=20&cursor="],
      [`/api/external/transactions/${completed.id}/`],
    ]);
  });

  test("executes an intent with a whitelisted bank account without a quote ID", async () => {
    const { client, post, get, sign } = createMockClient();
    const intent: TransactionIntentRequest = {
      input: { asset: "USDC", amount: "100.123456" },
      output: { asset: "USD", vaultId: "fiat-vault-id" },
      source: {
        type: TransferPartyType.VAULT,
        id: "crypto-vault-id",
        chain: "ETHEREUM",
      },
      destination: {
        type: TransferPartyType.BANK_ACCOUNT,
        id: "bank-account-id",
        paymentRail: "ACH",
      },
    };
    post.mockResolvedValue(transaction);

    expect(await client.createTransactionFromIntent({ intent })).toBe(
      transaction,
    );
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/api/external/transactions/intent/create/",
      { intent, quoteId: undefined, externalId: undefined, memo: undefined },
    );
    expect(get).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  test("executes a quote and preserves transaction response details", async () => {
    const { client, post, get, sign } = createMockClient();
    const source = {
      type: TransferPartyType.VAULT,
      id: "vault-id",
      chain: "ETHEREUM",
    };
    const destination = {
      type: TransferPartyType.BANK_ACCOUNT,
      id: "bank-account-id",
      paymentRail: "ACH",
    };
    const response: Transaction = {
      ...transaction,
      category: TransactionCategory.RAMP,
      subCategory: TransactionSubCategory.TRADE_WITHDRAW,
      asset: "USDC",
      source: { ...source, name: "USDC Treasury" },
      destination: { ...destination, name: "USD Payroll" },
      depositInstructions: {
        type: TransferPartyType.EXTERNAL_ADDRESS,
        asset: "USDC",
        chain: "ETHEREUM",
        address: "0x123",
      },
      balanceChanges: {
        changes: [
          {
            party: source,
            asset: "USDC",
            amount: "-10000.00",
            chain: "ETHEREUM",
          },
          {
            party: destination,
            asset: "USD",
            amount: "9975.00",
            paymentRail: "ACH",
          },
        ],
      },
      quoteResponse: {
        quoteId: "quote-id",
        rate: "1",
        fees: { amount: "25.00", asset: "USDC" },
        input: { asset: "USDC", amount: "10000.00" },
        output: { asset: "USD", amount: "9975.00", vaultId: "usd-vault-id" },
        source,
        destination,
        expiresAt: "2026-05-25T00:00:30+00:00",
      },
    };
    post.mockResolvedValue(response);

    const result = await client.createTransactionFromIntent({
      quoteId: "quote-id",
      externalId: "trade-001",
      memo: "trade from quote",
    });

    expect(result).toBe(response);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/api/external/transactions/intent/create/",
      {
        intent: null,
        quoteId: "quote-id",
        externalId: "trade-001",
        memo: "trade from quote",
      },
    );
    expect(get).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  test("marks a settlement deposit done by its transaction ID", async () => {
    const { client, post, get, sign } = createMockClient();
    const response: Transaction = {
      ...transaction,
      id: "deposit-id",
      status: TransactionStatus.SUBMITTED,
      category: TransactionCategory.TRANSFER,
      subCategory: TransactionSubCategory.DEPOSIT,
      asset: "USD",
    };
    post.mockResolvedValue(response);

    const result = await client.markDepositDone("deposit-id");

    expect(result).toBe(response);
    expect(post).toHaveBeenCalledWith(
      "/api/external/transactions/mark_deposit_done/",
      { transactionId: "deposit-id" },
    );
    expect(get).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });
});

// Compile-time guards for removed public fields; no runtime fixture assertions.
function checkRemovedCurrencyFields(
  instructions: DepositInstructions,
  bank: BankDetails,
) {
  // @ts-expect-error DepositInstructions uses asset, not currency.
  instructions.currency;
  // @ts-expect-error BankDetails does not expose currency.
  bank.currency;
  // @ts-expect-error Nested deposit bank details do not expose currency.
  instructions.bankDetails?.currency;
}
