import {
  ApprovalAction,
  BankAccount,
  BankAccountStatus,
  CreateBankAccountRequest,
  CreateTransferTransactionRequest,
  TransactionCategory,
  TransactionStatus,
  TransferPartyType,
} from "../src";
import { createMockClient, transaction, vault } from "./helpers";

const approvalMessage = {
  approvalId: "approval-id",
  message: "approval-message",
};
const approvalMessagePath =
  "/api/external/change_requests/approvals/approval_message/";
const actionPath =
  "/api/external/change_requests/approvals/approval-id/action/";

const arrangeApproval = <T extends { id: string }>(
  created: T,
  refetched: object,
  method: "post" | "put" = "post",
) => {
  const mocks = createMockClient();
  mocks[method].mockResolvedValueOnce(created);
  mocks.post.mockResolvedValueOnce({ success: true });
  mocks.get
    .mockResolvedValueOnce(approvalMessage)
    .mockResolvedValueOnce(refetched);
  return mocks;
};

const expectApproval = (
  mocks: ReturnType<typeof createMockClient>,
  entityId: string,
  detailPath: string,
  method: "post" | "put" = "post",
) => {
  expect(mocks.get.mock.calls).toEqual([
    [approvalMessagePath, { entityId }],
    [detailPath],
  ]);
  expect(mocks.sign).toHaveBeenCalledTimes(1);
  expect(mocks.sign).toHaveBeenCalledWith(approvalMessage.message);
  expect(mocks.post).toHaveBeenCalledTimes(method === "post" ? 2 : 1);
  expect(mocks.post).toHaveBeenLastCalledWith(actionPath, {
    action: ApprovalAction.APPROVE,
    signature: "0a0b",
    reason: "ok",
  });
};

const transferRequest: CreateTransferTransactionRequest & {
  isAutomation: boolean;
  executeAt: string;
} = {
  source: { type: TransferPartyType.VAULT, id: vault.id },
  destination: { type: TransferPartyType.CONTACT, id: "contact-id" },
  amount: transaction.amount,
  asset: "USDC",
  chain: "ETHEREUM",
  externalId: "external-id",
  memo: "transfer",
  isAutomation: true,
  executeAt: "2026-08-04T00:00:00Z",
};

describe("approval flows", () => {
  test("creates, approves and refetches a vault", async () => {
    const mocks = arrangeApproval({ ...vault, walletsGenerated: false }, vault);
    const request = {
      vaultName: vault.vaultName,
      subOrgId: vault.subOrgId,
      vaultGroupIds: ["group-1", "group-2"],
    };

    expect(await mocks.client.createVaultWithApproval(request)).toBe(vault);
    expect(mocks.post).toHaveBeenNthCalledWith(
      1,
      "/api/external/vaults/",
      request,
    );
    expectApproval(mocks, vault.id, "/api/external/vaults/vault-id/");
  });

  test("creates, approves and refetches a contact", async () => {
    const request = {
      name: "USDT/USDC Contact",
      subOrgId: "sub-org-id",
      address: "0x123",
      chain: "ETHEREUM",
      assetList: ["USDT", "USDC"],
      contactGroupIds: ["contact-group-1"],
    };
    const refetched = { id: "contact-id", status: "APPROVED" };
    const mocks = arrangeApproval(
      { ...refetched, status: "PENDING" },
      refetched,
    );

    expect(await mocks.client.createContactWithApproval(request)).toBe(
      refetched,
    );
    expect(mocks.post).toHaveBeenNthCalledWith(1, "/api/external/contacts/", {
      name: request.name,
      subOrgId: request.subOrgId,
      address: request.address,
      blockChain: "ETHEREUM",
      tags: undefined,
      externalId: undefined,
      assetList: request.assetList,
      contactGroupIds: request.contactGroupIds,
    });
    expectApproval(mocks, "contact-id", "/api/external/contacts/contact-id/");
  });

  test("updates, approves and refetches a contact", async () => {
    const request = {
      id: "contact-id",
      assetList: ["USDT"],
      contactGroupIds: [],
    };
    const refetched = {
      id: request.id,
      status: "APPROVED",
      assetList: request.assetList,
    };
    const mocks = arrangeApproval(request, refetched, "put");

    expect(await mocks.client.updateContactWithApproval(request)).toBe(
      refetched,
    );
    expect(mocks.put).toHaveBeenCalledTimes(1);
    expect(mocks.put).toHaveBeenCalledWith(
      "/api/external/contacts/contact-id/",
      {
        assetList: request.assetList,
        contactGroupIds: [],
      },
    );
    expectApproval(
      mocks,
      request.id,
      "/api/external/contacts/contact-id/",
      "put",
    );
  });

  test("preserves bank account tags through creation, approval and listing", async () => {
    const request: CreateBankAccountRequest = {
      subOrgId: "sub-org-id",
      accountNumber: "123456789",
      accountName: "Treasury Account",
      bankName: "Chase",
      tags: ["treasury", "payroll", "treasury"],
    };
    const refetched: BankAccount = {
      ...request,
      id: "bank-account-id",
      orgId: "org-id",
      orgEntityId: "org-entity-id",
      createdById: "user-id",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
      status: BankAccountStatus.APPROVED,
    };
    const mocks = arrangeApproval(
      { ...refetched, status: BankAccountStatus.PENDING },
      refetched,
    );

    expect(await mocks.client.createBankAccountWithApproval(request)).toBe(
      refetched,
    );
    expect(mocks.post).toHaveBeenNthCalledWith(
      1,
      "/api/external/bank_accounts/",
      request,
    );
    expectApproval(
      mocks,
      refetched.id,
      "/api/external/bank_accounts/bank-account-id/",
    );

    const page = { results: [refetched], nextCursor: null, hasNext: false };
    mocks.get.mockResolvedValueOnce(page);
    expect(await mocks.client.getBankAccounts()).toBe(page);
    expect(mocks.get).toHaveBeenLastCalledWith(
      "/api/external/bank_accounts/?limit=20&cursor=",
    );
  });

  test("serializes a transfer without automation fields, approves and refetches it", async () => {
    const mocks = arrangeApproval(
      { ...transaction, status: TransactionStatus.PENDING },
      transaction,
    );

    expect(
      await mocks.client.createTransactionWithApproval(transferRequest),
    ).toBe(transaction);
    expect(mocks.post).toHaveBeenNthCalledWith(
      1,
      "/api/external/transactions/",
      {
        source: transferRequest.source,
        destination: transferRequest.destination,
        amount: transferRequest.amount,
        asset: "USDC",
        blockChain: "ETHEREUM",
        category: TransactionCategory.TRANSFER,
        gasParams: undefined,
        externalId: transferRequest.externalId,
        memo: transferRequest.memo,
        feePayer: undefined,
      },
    );
    expectApproval(
      mocks,
      transaction.id,
      "/api/external/transactions/transaction-id/",
    );
  });

  test("approves and refetches a pending intent transaction", async () => {
    const mocks = arrangeApproval(
      { ...transaction, status: TransactionStatus.PENDING },
      transaction,
    );

    expect(
      await mocks.client.createTransactionFromIntent({ quoteId: "quote-id" }),
    ).toBe(transaction);
    expect(mocks.post).toHaveBeenNthCalledWith(
      1,
      "/api/external/transactions/intent/create/",
      {
        intent: null,
        quoteId: "quote-id",
        externalId: undefined,
        memo: undefined,
      },
    );
    expectApproval(
      mocks,
      transaction.id,
      "/api/external/transactions/transaction-id/",
    );
  });

  test("skips approval when a transfer is already approved", async () => {
    const { client, post, get, sign } = createMockClient();
    post.mockResolvedValue(transaction);

    expect(await client.createTransactionWithApproval(transferRequest)).toBe(
      transaction,
    );
    expect(post).toHaveBeenCalledTimes(1);
    expect(get).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  test("signs a generic change rejection with the supplied reason", async () => {
    const { client, get, post, sign } = createMockClient();
    get.mockResolvedValue(approvalMessage);
    const response = { success: true };
    post.mockResolvedValue(response);

    expect(
      await client.approveChangeRequest({
        entityId: "entity-id",
        action: ApprovalAction.REJECT,
        reason: "not valid",
      }),
    ).toBe(response);
    expect(get).toHaveBeenCalledWith(approvalMessagePath, {
      entityId: "entity-id",
    });
    expect(sign).toHaveBeenCalledWith(approvalMessage.message);
    expect(post).toHaveBeenCalledWith(actionPath, {
      action: ApprovalAction.REJECT,
      signature: "0a0b",
      reason: "not valid",
    });
  });
});
