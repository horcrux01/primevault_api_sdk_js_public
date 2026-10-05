import {
  APIClient,
  Transaction,
  TransactionStatus,
  Vault,
  VaultType,
} from "../src";

// Skip credential setup and mock only the HTTP and signing boundaries.
export const createMockClient = () => {
  const get = jest.fn();
  const post = jest.fn();
  const put = jest.fn();
  const sign = jest.fn().mockResolvedValue("0a0b");
  const client = Object.assign(Object.create(APIClient.prototype), {
    get,
    post,
    put,
    signatureService: { sign },
  }) as APIClient;
  return { client, get, post, put, sign };
};

export const vault: Vault = {
  id: "vault-id",
  orgId: "org-id",
  subOrgId: "sub-org-id",
  vaultName: "Treasury",
  vaultType: VaultType.DEFAULT,
  wallets: [],
  walletsGenerated: true,
  createdAt: "2026-09-25T00:00:00Z",
  updatedAt: "2026-09-25T00:00:00Z",
  isDeleted: false,
};

export const transaction: Transaction = {
  id: "transaction-id",
  orgId: "org-id",
  vaultId: vault.id,
  amount: "100",
  status: TransactionStatus.APPROVED,
  transactionType: "OUTGOING",
  category: "TRANSFER",
  subCategory: "EXTERNAL_TRANSFER",
  createdAt: "2026-05-25T00:00:00Z",
  updatedAt: "2026-05-25T00:00:00Z",
  isDeleted: false,
};
