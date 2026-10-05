import { APIClient } from "../src/apiClient";
import { BadRequestError } from "../src/baseApiClient";
import {
  Asset,
  ContactStatus,
  DetailedBalance,
  TransactionFeeTier,
  TransferPartyType,
  VaultType,
} from "../src/types";

describe("APIClient live integration", () => {
  const apiKey = process.env.API_KEY!;
  const apiUrl = process.env.API_URL!;
  const privateKey = process.env.ACCESS_PRIVATE_KEY!;
  const apiClient = new APIClient(apiKey, apiUrl, privateKey);

  test("getAssetsData", async () => {
    const assetsData = await apiClient.getAssetsData();
    expect(assetsData).toBeInstanceOf(Array);
    expect(assetsData).toHaveLength(86);
  });

  test("getSupportedChains", async () => {
    const supportedChains = await apiClient.getSupportedChains();
    expect(supportedChains.map((chain: any) => chain.value).sort()).toEqual([
      "APTOS",
      "ARBITRUM",
      "ETHEREUM",
      "ICP",
      "MOONBEAM",
      "NEAR",
      "OPTIMISM",
      "POLYGON",
      "RADIX",
      "SOLANA",
    ]);
  });

  test("getVaults", async () => {
    const vaults = (await apiClient.getVaults({ vaultName: "core-vault-1" }))
      .results;
    expect(vaults).toHaveLength(1);
    expect(vaults[0].vaultName).toBe("core-vault-1");
    expect(vaults[0].vaultType).toBe(VaultType.DEFAULT);

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
    expect(vault.vaultName).toBe("core-vault-1");
    expect(vault.vaultType).toBe(VaultType.DEFAULT);
  });

  test("getBalances", async () => {
    let vaults = (await apiClient.getVaults({ vaultName: "core-vault-1" }))
      .results;
    const balances = await apiClient.getBalances(vaults[0].id);
    expect(balances).toStrictEqual({
      ETH: { ETHEREUM: "1" },
      USDC: { ETHEREUM: "1342" },
    });

    // non-zero balances
    vaults = (await apiClient.getVaults({ vaultName: "Ethereum Vault" }))
      .results;
    const balances2 = await apiClient.getBalances(vaults[0].id);
    expect(Object.keys(balances2)).toHaveLength(5);
    expect(balances2["ETH"]).toStrictEqual({
      ARBITRUM: "0",
      ETHEREUM: "0.00950008",
      OPTIMISM: "0",
    });

    expect(balances2["MATIC"]).toStrictEqual({ POLYGON: "0.00767327" });
  });

  test("getDetailedBalances", async () => {
    // Test with vault having non-zero balances
    const vaults = (await apiClient.getVaults({ vaultName: "Ethereum Vault" }))
      .results;
    const vaultId = vaults[0].id;
    const detailedBalances = await apiClient.getDetailedBalances(vaultId);

    const balancesByKey: Record<string, DetailedBalance> = {};
    for (const balance of detailedBalances) {
      const key = `${balance.chain}:${balance.symbol}`;
      balancesByKey[key] = balance;
    }

    expect(balancesByKey["ETHEREUM:ETH"]).toMatchObject({
      chain: "ETHEREUM",
      symbol: "ETH",
      name: "Ethereum",
      balance: "0.00950008",
    });
    expect(balancesByKey["POLYGON:MATIC"]).toMatchObject({
      chain: "POLYGON",
      symbol: "MATIC",
      name: "Matic",
      balance: "0.00767327",
    });
  });

  test("getContacts", async () => {
    const contacts = (await apiClient.getContacts({ name: "Lynn Bell" }))
      .results;
    expect(contacts).toHaveLength(1);
    expect(contacts[0]).toMatchObject({
      name: "Lynn Bell",
      blockChain: "SOLANA",
      address: "CEzN7mqP9xoxn2HdyW6fjEJ73t7qaX9Rp2zyS6hb3iEu",
      status: ContactStatus.APPROVED,
    });
  });

  test("createVault", async () => {
    const data = {
      vaultName: "Ethereum Vault 11",
      templateId: "2c693b68-c0da-49a4-a924-fbbfa36f2b24",
    };
    try {
      await apiClient.createVault(data);
    } catch (e: any) {
      // vault already exists
      expect(e).toBeInstanceOf(BadRequestError);
      expect(e.status).toBe(400);
    }
  });

  test("createTransferTransaction", async () => {
    // find the asset and chain
    const assets = await apiClient.getAssetsData();
    const ethereumAsset = assets.find(
      (asset: Asset) =>
        asset.blockChain === "ETHEREUM" && asset.symbol === "ETH",
    )!;

    const sourceVaults = (
      await apiClient.getVaults({
        vaultName: "core-vault-1",
      })
    ).results; // source
    const destinationContacts = (
      await apiClient.getContacts({
        name: "Lynn Bell",
      })
    ).results; // destination

    const source = { type: TransferPartyType.VAULT, id: sourceVaults[0].id };
    const destination = {
      type: TransferPartyType.CONTACT,
      id: destinationContacts[0].id,
    };
    try {
      await apiClient.createTransferTransaction({
        source,
        destination,
        amount: "0.0001",
        asset: ethereumAsset.symbol,
        chain: ethereumAsset.blockChain,
        externalId: "externalId-1",
        memo: "memo",
        gasParams: { feeTier: TransactionFeeTier.HIGH },
      });
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(e.status).toBe(400);
    }
  }, 10000);

  test("getTransactionsById", async () => {
    const transaction = await apiClient.getTransactionById(
      "f1cb568d-215e-426f-998a-4ba5be8288d4",
    );
    expect(transaction).toMatchObject({
      id: "f1cb568d-215e-426f-998a-4ba5be8288d4",
      status: "PENDING",
      blockChain: "ETHEREUM",
      externalId: null,
      toAddressName: "Compound",
      sourceAddress: "0x1feDDa0D98c5B4FDEbde9342d3db6Eff284B0d18",
      memo: null,
      fees: { amount: "0.00055509", asset: "ETH" },
    });
  });

  test("createContractCallTransaction", async () => {
    const vaults = (
      await apiClient.getVaults({
        vaultName: "core-vault-1",
      })
    ).results;
    const vaultId = vaults[0].id;
    try {
      await apiClient.createContractCallTransaction({
        vaultId: vaultId,
        chain: "ETHEREUM",
        externalId: "externalId-1",
        gasParams: { feeTier: TransactionFeeTier.MEDIUM },
        data: {
          callData: "0x",
          toAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
      });
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(e.status).toBe(400);
    }
  });
});
