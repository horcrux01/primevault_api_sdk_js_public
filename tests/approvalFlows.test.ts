import { APIClient } from "../src/apiClient";
import { ApprovalAction } from "../src/types";

/**
 * Unit tests for the create/update *WithApproval convenience flows.
 *
 * The client is instantiated without running the constructor (so no real
 * credentials or signature service are required); `post`, `get`, `put` and the
 * signature service are mocked.
 */
const buildClient = () => {
  const client = Object.create(APIClient.prototype) as APIClient;
  const post = jest.fn();
  const get = jest.fn();
  const put = jest.fn();
  const sign = jest.fn().mockResolvedValue("0a0b");
  (client as any).post = post;
  (client as any).get = get;
  (client as any).put = put;
  (client as any).signatureService = { sign };
  return { client, post, get, put, sign };
};

const approvalMessage = {
  approvalId: "approval-id",
  message: "approval-message",
};

const actionPath = "/api/external/change_requests/approvals/approval-id/action/";
const approvalMessagePath =
  "/api/external/change_requests/approvals/approval_message/";

describe("createVaultWithApproval", () => {
  test("creates the vault, approves it and re-fetches", async () => {
    const { client, post, get } = buildClient();
    const vaultResponse = {
      id: "vault-id",
      orgId: "org-id",
      vaultName: "Treasury",
      vaultType: "DEFAULT",
      viewers: [],
      walletsGenerated: false,
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
    };
    post
      .mockResolvedValueOnce(vaultResponse)
      .mockResolvedValueOnce({ success: true });
    get
      .mockResolvedValueOnce(approvalMessage)
      .mockResolvedValueOnce({ ...vaultResponse, walletsGenerated: true });

    const vault = await client.createVaultWithApproval({
      vaultName: "Treasury",
      vaultGroupIds: ["group-1", "group-2"],
    });

    expect(vault.id).toBe("vault-id");
    expect(vault.walletsGenerated).toBe(true);
    expect(post).toHaveBeenNthCalledWith(1, "/api/external/vaults/", {
      vaultName: "Treasury",
      vaultGroupIds: ["group-1", "group-2"],
    });
    expect(get).toHaveBeenNthCalledWith(1, approvalMessagePath, {
      entityId: "vault-id",
    });
    expect(post).toHaveBeenNthCalledWith(2, actionPath, {
      action: ApprovalAction.APPROVE,
      signature: "0a0b",
      reason: "ok",
    });
    expect(get).toHaveBeenNthCalledWith(2, "/api/external/vaults/vault-id/");
  });
});

describe("createContactWithApproval", () => {
  test("creates the contact, approves it and re-fetches", async () => {
    const { client, post, get } = buildClient();
    const contactResponse = {
      id: "contact-id",
      orgId: "org-id",
      name: "USDT/USDC Contact",
      blockChain: "ETHEREUM",
      address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
      status: "PENDING",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
      assetList: ["USDT", "USDC"],
    };
    post
      .mockResolvedValueOnce(contactResponse)
      .mockResolvedValueOnce({ success: true });
    get
      .mockResolvedValueOnce(approvalMessage)
      .mockResolvedValueOnce({ ...contactResponse, status: "APPROVED" });

    const contact = await client.createContactWithApproval({
      name: "USDT/USDC Contact",
      address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
      chain: "ETHEREUM",
      assetList: ["USDT", "USDC"],
      contactGroupIds: ["contact-group-1"],
    });

    expect(contact.id).toBe("contact-id");
    expect(contact.status).toBe("APPROVED");
    expect(post).toHaveBeenNthCalledWith(1, "/api/external/contacts/", {
      name: "USDT/USDC Contact",
      address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
      blockChain: "ETHEREUM",
      tags: undefined,
      externalId: undefined,
      assetList: ["USDT", "USDC"],
      contactGroupIds: ["contact-group-1"],
    });
    expect(get).toHaveBeenNthCalledWith(1, approvalMessagePath, {
      entityId: "contact-id",
    });
    expect(post).toHaveBeenNthCalledWith(2, actionPath, {
      action: ApprovalAction.APPROVE,
      signature: "0a0b",
      reason: "ok",
    });
    expect(get).toHaveBeenNthCalledWith(2, "/api/external/contacts/contact-id/");
  });
});

describe("updateContactWithApproval", () => {
  test("updates the contact, approves it and re-fetches", async () => {
    const { client, post, get, put } = buildClient();
    const updateResponse = {
      id: "contact-id",
      name: "USDT/USDC Contact",
      address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
      blockChain: "ETHEREUM",
      assetList: ["USDT"],
    };
    const refetchedContact = {
      id: "contact-id",
      orgId: "org-id",
      name: "USDT/USDC Contact",
      blockChain: "ETHEREUM",
      address: "0xCa1Dc85B6a8F4Ee45C5C66D887d512355b7D0609",
      status: "APPROVED",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
      assetList: ["USDT"],
    };
    put.mockResolvedValueOnce(updateResponse);
    post.mockResolvedValueOnce({ success: true });
    get
      .mockResolvedValueOnce(approvalMessage)
      .mockResolvedValueOnce(refetchedContact);

    const updated = await client.updateContactWithApproval({
      id: "contact-id",
      assetList: ["USDT"],
      contactGroupIds: [],
    });

    expect(updated.id).toBe("contact-id");
    expect(updated.status).toBe("APPROVED");
    expect(updated.assetList).toEqual(["USDT"]);
    expect(put).toHaveBeenNthCalledWith(1, "/api/external/contacts/contact-id/", {
      assetList: ["USDT"],
      contactGroupIds: [],
    });
    expect(get).toHaveBeenNthCalledWith(1, approvalMessagePath, {
      entityId: "contact-id",
    });
    expect(post).toHaveBeenNthCalledWith(1, actionPath, {
      action: ApprovalAction.APPROVE,
      signature: "0a0b",
      reason: "ok",
    });
    expect(get).toHaveBeenNthCalledWith(2, "/api/external/contacts/contact-id/");
  });
});

describe("createBankAccountWithApproval", () => {
  test("creates the bank account, approves it and re-fetches", async () => {
    const { client, post, get } = buildClient();
    const bankAccountResponse = {
      id: "bank-account-id",
      orgId: "org-id",
      orgEntityId: "org-entity-id",
      createdAt: "2026-05-25T00:00:00Z",
      updatedAt: "2026-05-25T00:00:00Z",
      isDeleted: false,
      status: "PENDING",
      accountName: "Treasury Account",
      bankName: "Chase",
    };
    post
      .mockResolvedValueOnce(bankAccountResponse)
      .mockResolvedValueOnce({ success: true });
    get
      .mockResolvedValueOnce(approvalMessage)
      .mockResolvedValueOnce({ ...bankAccountResponse, status: "APPROVED" });

    const request = {
      accountNumber: "123456789",
      accountName: "Treasury Account",
      bankName: "Chase",
    };
    const bankAccount = await client.createBankAccountWithApproval(request);

    expect(bankAccount.id).toBe("bank-account-id");
    expect(bankAccount.status).toBe("APPROVED");
    expect(post).toHaveBeenNthCalledWith(1, "/api/external/bank_accounts/", request);
    expect(get).toHaveBeenNthCalledWith(1, approvalMessagePath, {
      entityId: "bank-account-id",
    });
    expect(post).toHaveBeenNthCalledWith(2, actionPath, {
      action: ApprovalAction.APPROVE,
      signature: "0a0b",
      reason: "ok",
    });
    expect(get).toHaveBeenNthCalledWith(
      2,
      "/api/external/bank_accounts/bank-account-id/",
    );
  });
});
