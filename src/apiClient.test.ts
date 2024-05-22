import { APIClient } from "./apiClient";
import { Asset, ContactStatus, VaultType } from "./types";
import { Chain } from "./constants";

describe("APIClient", () => {
  const apiKey = process.env.API_KEY!;
  const apiUrl = process.env.API_URL!;
  const privateKey = process.env.ACCESS_PRIVATE_KEY!;
  const apiClient = new APIClient(apiKey, apiUrl, privateKey);

  test("getAssetsData", async () => {
    const assetsData = await apiClient.getAssetsData();
    expect(assetsData).toBeDefined();
    expect(assetsData).toBeInstanceOf(Array);
    expect(assetsData.length).toBe(64);
  });

  test("getVaults", async () => {
    const vaults = await apiClient.getVaults({ vaultName: "core-vault-1" });
    expect(vaults).toBeDefined();
    expect(vaults).toBeInstanceOf(Array);
    expect(vaults.length).toBe(1);
    expect(vaults[0].vaultName).toBe("core-vault-1");
    expect(vaults[0].vaultType).toBe(VaultType.DEFAULT);
    expect(vaults[0].wallets).toBeDefined();
    expect(vaults[0].wallets.length).toBe(8);
    expect(vaults[0].signers).toBeDefined();
    expect(vaults[0].signers.length).toBe(8);
    expect(vaults[0].viewers.length).toBe(0);

    const blockchains = vaults[0].wallets
      .map((wallet: any) => wallet.blockchain)
      .sort();
    expect(blockchains).toEqual(
      [
        "ETHEREUM",
        "POLYGON",
        "SOLANA",
        "NEAR",
        "APTOS",
        "ARBITRUM",
        "OPTIMISM",
        "MOONBEAM",
      ].sort(),
    );

    const vault = await apiClient.getVaultById(vaults[0].id);
    expect(vault).toBeDefined();
    expect(vault).toBeInstanceOf(Object);
    expect(vault.vaultName).toBe("core-vault-1");
    expect(vault.vaultType).toBe(VaultType.DEFAULT);
  });

  test("getBalances", async () => {
    let vaults = await apiClient.getVaults({ vaultName: "core-vault-1" });
    // all balances are 0
    const balances = await apiClient.getBalances(vaults[0].id);
    expect(balances).toBeDefined();
    expect(balances).toBeInstanceOf(Object);
    expect(balances).toStrictEqual({});

    // non-zero balances
    vaults = await apiClient.getVaults({ vaultName: "Ethereum Vault" });
    const balances2 = await apiClient.getBalances(vaults[0].id);
    expect(balances2).toBeDefined();
    expect(balances2).toBeInstanceOf(Object);
    expect(Object.keys(balances2).length).toBe(3);
    expect(balances2["ETH"]).toBeDefined();
    expect(balances2["ETH"]).toBeInstanceOf(Object);
    expect(Object.keys(balances2["ETH"]).length).toBe(2);
    expect(balances2["ETH"]).toStrictEqual({ ETHEREUM: 1, OPTIMISM: 2 });

    expect(balances2["MATIC"]).toBeDefined();
    expect(balances2["MATIC"]).toBeInstanceOf(Object);
    expect(Object.keys(balances2["MATIC"]).length).toBe(1);
    expect(balances2["MATIC"]).toStrictEqual({ POLYGON: 30.2322 });
  });

  test("getContacts", async () => {
    const contacts = await apiClient.getContacts({ name: "Lynn Bell" });
    expect(contacts).toBeDefined();
    expect(contacts).toBeInstanceOf(Array);
    expect(contacts.length).toBe(1);
    expect(contacts[0].name).toBe("Lynn Bell");
    expect(contacts[0].blockChain).toBe("SOLANA");
    expect(contacts[0].address).toBe(
      "CEzN7mqP9xoxn2HdyW6fjEJ73t7qaX9Rp2zyS6hb3iEu",
    );
    expect(contacts[0].status).toBe(ContactStatus.APPROVED);
  });

  test("createVault", async () => {
    const data = {
      vaultName: "Ethereum Vault",
      defaultTransferSpendLimit: {
        action: {
          actionType: "NEEDS_MORE_APPROVALS",
          additionalApprovalCount: 1,
        },
        spendLimit: "100",
        resetFrequency: "86400",
      },
      defaultTradeSpendLimit: {
        action: { actionType: "BLOCK_OPERATION" },
        spendLimit: "100",
        resetFrequency: "86400",
      },
    };
    try {
      await apiClient.createVault(data);
    } catch (e: any) {
      // vault already exists
      expect(e).toBeDefined();
      expect(e.message).toBe("400 Bad Request: Bad Request");
    }
  });

  test("createTransferTransaction", async () => {
    // find the asset and chain
    const assets = await apiClient.getAssetsData();
    const ethereumAsset = assets.find(
      (asset: Asset) =>
        asset.blockChain === "ETHEREUM" && asset.symbol === "ETH",
    )!;

    const sourceVaults = await apiClient.getVaults({
      vaultName: "core-vault-1",
    }); // source
    const destinationContacts = await apiClient.getContacts({
      name: "Lynn Bell",
    }); // destination

    const sourceId = sourceVaults[0].id;
    const destinationId = destinationContacts[0].id;
    try {
      await apiClient.createTransferTransaction(
        sourceId,
        destinationId,
        "0.0001",
        ethereumAsset.symbol,
        ethereumAsset?.blockChain,
        {},
        "externalId-1",
      );
    } catch (e: any) {
      expect(e).toBeDefined();
      expect(e.message).toBe("400 Bad Request: Bad Request");
    }
  });

  test("getTransactionsById", async () => {
    const transaction = await apiClient.getTransactionById(
      "f1cb568d-215e-426f-998a-4ba5be8288d4",
    );
    expect(transaction).toBeDefined();
    expect(transaction).toBeInstanceOf(Object);
    expect(transaction.id).toBe("f1cb568d-215e-426f-998a-4ba5be8288d4");
    expect(transaction.status).toBe("PENDING");
    expect(transaction.blockChain).toBe("ETHEREUM");
    expect(transaction.externalId).toBeNull();
    expect(transaction.toAddressName).toBe("Compound");
  });

  test("createContractCallTransaction", async () => {
    const vaults = await apiClient.getVaults({
      vaultName: "core-vault-1",
    });
    const vaultId = vaults[0].id;
    try {
      await apiClient.createContractCallTransaction(
        vaultId,
        Chain.ETHEREUM,
        "0x",
        "0x",
        "externalId-1",
      );
    } catch (e: any) {
      expect(e).toBeDefined();
      expect(e.message).toBe("400 Bad Request: Bad Request");
    }
  });
});
