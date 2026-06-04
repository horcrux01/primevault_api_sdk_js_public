jest.mock("uuid", () => ({
  v4: () => "test-jti",
}));

import { APIClient } from "../src/apiClient";
import {
  ApprovalAction,
  DepositInstructions,
  QuoteResponse,
  Transaction,
  TransactionOperationType,
  TransactionStatus,
  TransferPartyType,
} from "../src/types";

const makeClient = (): APIClient =>
  Object.create(APIClient.prototype) as APIClient;

describe("APIClient intent transactions", () => {
  test("getQuote posts the backend intent payload and returns generic quotes", async () => {
    const apiClient = makeClient();
    const response: QuoteResponse = {
      quotes: [
        {
          quoteId: "quote-1",
          finalFromAmount: "101.25",
          fees: {
            amount: "1.25",
            asset: "USDC",
          },
          sourceName: "provider",
        },
      ],
    };
    const postSpy = jest.spyOn(apiClient, "post").mockResolvedValue(response);

    const quoteResponse = await apiClient.getQuote({
      intent: {
        source: {
          type: TransferPartyType.VAULT,
          id: "vault-1",
        },
        destination: {
          type: TransferPartyType.BANK_ACCOUNT,
          id: "bank-account-1",
        },
        routeAccounts: [
          {
            provider: "provider-key",
            id: "provider-linked-vault-id",
          },
        ],
        fromAsset: "USDC",
        fromAmount: "100",
        fromChain: "ETHEREUM",
        fromPaymentRail: "BLOCKCHAIN",
        toAsset: "USD",
        toAmount: "99",
        toPaymentRail: "ACH",
      },
    });

    expect(postSpy).toHaveBeenCalledWith("/api/external/transactions/quote/", {
      intent: {
        source: {
          type: TransferPartyType.VAULT,
          id: "vault-1",
          name: null,
          address: null,
          provider: null,
          bankDetails: null,
          chain: null,
          paymentRail: null,
        },
        destination: {
          type: TransferPartyType.BANK_ACCOUNT,
          id: "bank-account-1",
          name: null,
          address: null,
          provider: null,
          bankDetails: null,
          chain: null,
          paymentRail: null,
        },
        routeAccounts: [
          {
            provider: "provider-key",
            id: "provider-linked-vault-id",
          },
        ],
        fromAsset: "USDC",
        toAsset: "USD",
        fromAmount: "100",
        fromChain: "ETHEREUM",
        fromPaymentRail: "BLOCKCHAIN",
        toAmount: "99",
        toChain: null,
        toPaymentRail: "ACH",
      },
    });
    expect(quoteResponse.quotes[0].quoteId).toBe("quote-1");
    expect(quoteResponse.quotes[0].finalFromAmount).toBe("101.25");
  });

  test("createTransactionFromIntent serializes quote-only execution", async () => {
    const apiClient = makeClient();
    const transaction = {
      id: "transaction-id",
      orgId: "org-id",
      vaultId: "vault-id",
      amount: "1",
      status: TransactionStatus.APPROVED,
      transactionType: "OUTGOING",
      category: "SWAP",
      subCategory: "MARKET_TRADE",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
    } satisfies Transaction;
    const postSpy = jest
      .spyOn(apiClient, "post")
      .mockResolvedValue(transaction);
    const getSpy = jest.spyOn(apiClient, "get");

    const response = await apiClient.createTransactionFromIntent({
      quoteId: "quote-id",
      externalId: "trade-001",
      memo: "trade from quote",
    });

    expect(response.id).toBe("transaction-id");
    expect(postSpy).toHaveBeenCalledWith(
      "/api/external/transactions/intent/create/",
      {
        intent: null,
        quoteId: "quote-id",
        externalId: "trade-001",
        memo: "trade from quote",
      },
    );
    expect(getSpy).not.toHaveBeenCalled();
  });

  test("createTransactionFromIntent approves and refetches pending transactions", async () => {
    const apiClient = makeClient();
    const pendingTransaction = {
      id: "transaction-id",
      orgId: "org-id",
      vaultId: "vault-id",
      amount: "1",
      status: TransactionStatus.PENDING,
      transactionType: "OUTGOING",
      category: "TRANSFER",
      subCategory: "EXTERNAL_TRANSFER",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
    } satisfies Transaction;
    const approvedTransaction = {
      ...pendingTransaction,
      status: TransactionStatus.APPROVED,
    } satisfies Transaction;
    const postSpy = jest
      .spyOn(apiClient, "post")
      .mockResolvedValueOnce(pendingTransaction)
      .mockResolvedValueOnce({ success: true });
    const getSpy = jest
      .spyOn(apiClient, "get")
      .mockResolvedValueOnce({
        message: "approval-message",
        approvalId: "approval-id",
      })
      .mockResolvedValueOnce(approvedTransaction);
    (apiClient as any).signatureService = {
      sign: jest.fn().mockResolvedValue("0a0b"),
    };

    const transaction = await apiClient.createTransactionFromIntent({
      intent: {
        routeAccounts: [
          {
            provider: "provider-key",
            id: "provider-linked-vault-id",
          },
        ],
      },
      quoteId: "quote-id",
      externalId: "external-id",
      memo: "memo",
    });

    expect(transaction.status).toBe(TransactionStatus.APPROVED);
    expect(postSpy).toHaveBeenNthCalledWith(
      1,
      "/api/external/transactions/intent/create/",
      {
        intent: {
          source: null,
          destination: null,
          fromAsset: null,
          toAsset: null,
          fromAmount: null,
          fromChain: null,
          fromPaymentRail: null,
          toAmount: null,
          toChain: null,
          toPaymentRail: null,
        },
        quoteId: "quote-id",
        externalId: "external-id",
        memo: "memo",
      },
    );
    expect(
      (postSpy.mock.calls[0][1] as any).intent.routeAccounts,
    ).toBeUndefined();
    expect(getSpy).toHaveBeenNthCalledWith(
      1,
      "/api/external/change_requests/approvals/approval_message/",
      { entityId: "transaction-id" },
    );
    expect(postSpy).toHaveBeenNthCalledWith(
      2,
      "/api/external/change_requests/approvals/approval-id/action/",
      {
        action: ApprovalAction.APPROVE,
        signature: "0a0b",
        reason: "ok",
      },
    );
    expect(getSpy).toHaveBeenNthCalledWith(
      2,
      "/api/external/transactions/transaction-id/",
    );
  });

  test("approval helpers support the explicit message then sign and submit flow", async () => {
    const apiClient = makeClient();
    const getSpy = jest.spyOn(apiClient, "get").mockResolvedValue({
      message: "message-to-sign",
      approvalId: "approval-id",
    });
    const postSpy = jest.spyOn(apiClient, "post").mockResolvedValue({
      success: true,
    });
    (apiClient as any).signatureService = {
      sign: jest.fn().mockResolvedValue("deadbeef"),
    };

    const response = await apiClient.approveChangeRequest({
      entityId: "entity-id",
      action: ApprovalAction.REJECT,
      reason: "not valid",
    });

    expect(response.success).toBe(true);
    expect(getSpy).toHaveBeenCalledWith(
      "/api/external/change_requests/approvals/approval_message/",
      { entityId: "entity-id" },
    );
    expect(postSpy).toHaveBeenCalledWith(
      "/api/external/change_requests/approvals/approval-id/action/",
      {
        action: ApprovalAction.REJECT,
        signature: "deadbeef",
        reason: "not valid",
      },
    );
  });

  test("change approvals use the same flow for contact, bank, and transaction entities", async () => {
    const apiClient = makeClient();
    const getSpy = jest
      .spyOn(apiClient, "get")
      .mockImplementation(
        async (_path: string, params?: Record<string, string>) => ({
          message: `message-for-${params?.entityId}`,
          approvalId: `approval-for-${params?.entityId}`,
        }),
      );
    const postSpy = jest.spyOn(apiClient, "post").mockResolvedValue({
      success: true,
    });
    (apiClient as any).signatureService = {
      sign: jest.fn(async (message: string) => `signature:${message}`),
    };

    for (const entityId of [
      "contact-id",
      "bank-account-id",
      "transaction-id",
    ]) {
      await apiClient.approveChangeRequest({
        entityId,
        action: ApprovalAction.APPROVE,
      });
    }

    for (const entityId of [
      "contact-id",
      "bank-account-id",
      "transaction-id",
    ]) {
      expect(getSpy).toHaveBeenCalledWith(
        "/api/external/change_requests/approvals/approval_message/",
        { entityId },
      );
      expect(postSpy).toHaveBeenCalledWith(
        `/api/external/change_requests/approvals/approval-for-${entityId}/action/`,
        {
          action: ApprovalAction.APPROVE,
          signature: `signature:message-for-${entityId}`,
          reason: "ok",
        },
      );
    }
  });

  test("transaction response type carries operation details", () => {
    const transaction = {
      id: "transaction-id",
      orgId: "org-id",
      vaultId: "vault-id",
      amount: "100",
      status: TransactionStatus.APPROVED,
      transactionType: "OUTGOING",
      category: "OFF_RAMP",
      subCategory: "WITHDRAW",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
      operations: [
        {
          source: {
            type: TransferPartyType.VAULT,
            id: "vault-id",
            chain: "ETHEREUM",
            paymentRail: "BLOCKCHAIN",
            provider: "Example Provider",
          },
          destination: {
            type: TransferPartyType.EXTERNAL_BANK_ACCOUNT,
            paymentRail: "WIRE",
          },
          balanceChanges: {
            changes: [
              {
                party: {
                  type: TransferPartyType.VAULT,
                  id: "vault-id",
                  chain: "ETHEREUM",
                  paymentRail: "BLOCKCHAIN",
                },
                asset: "USDC",
                amount: "-100",
                chain: "ETHEREUM",
                paymentRail: "BLOCKCHAIN",
              },
            ],
          },
          sequence: 1,
          type: TransactionOperationType.WITHDRAW,
          provider: "Example Provider",
        },
      ],
    } satisfies Transaction;

    const operation = transaction.operations?.[0];
    expect(operation?.type).toBe(TransactionOperationType.WITHDRAW);
    expect(operation?.source?.chain).toBe("ETHEREUM");
    expect(operation?.source?.paymentRail).toBe("BLOCKCHAIN");
    expect(operation?.destination?.paymentRail).toBe("WIRE");
    expect(operation?.balanceChanges?.changes[0].asset).toBe("USDC");
    expect(operation?.balanceChanges?.changes[0].amount).toBe("-100");
  });

  test("deposit instructions type uses chain", () => {
    const depositInstructions = {
      type: TransferPartyType.EXTERNAL_ADDRESS,
      asset: "USDC",
      address: "0x123",
      chain: "ETHEREUM",
    } satisfies DepositInstructions;

    expect(depositInstructions.chain).toBe("ETHEREUM");
  });

});
