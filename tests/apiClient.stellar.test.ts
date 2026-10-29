jest.mock("uuid", () => ({
  v4: () => "test-jti",
}));

import { APIClient } from "../src/apiClient";
import { TransactionCategory, TransactionSubCategory } from "../src/types";

describe("APIClient Stellar", () => {
  test("createContractCallTransaction sends the activation data and fee payer", async () => {
    const apiClient = Object.create(APIClient.prototype) as APIClient;
    const postSpy = jest.spyOn(apiClient, "post").mockResolvedValue({
      id: "txn-1",
      subCategory: TransactionSubCategory.ACTIVATION,
    });

    const transaction = await apiClient.createContractCallTransaction({
      vaultId: "vault-1",
      chain: "STELLAR",
      externalId: "external-1",
      data: { activateAsset: "USDC" },
      feePayer: { id: "fee-payer-vault-1" },
    });

    expect(postSpy).toHaveBeenCalledWith("/api/external/transactions/", {
      vaultId: "vault-1",
      blockChain: "STELLAR",
      amount: undefined,
      category: TransactionCategory.CONTRACT_CALL,
      data: { activateAsset: "USDC" },
      externalId: "external-1",
      gasParams: undefined,
      creationOptions: undefined,
      feePayer: { id: "fee-payer-vault-1" },
    });
    expect(transaction.subCategory).toBe(TransactionSubCategory.ACTIVATION);
  });
});
