import { APIClient } from "../src/apiClient";
import { Asset, ContactStatus, TransferPartyType, VaultType } from "../src/types";
import { Chain } from "../src/constants";

describe("APIClient", () => {
  const apiKey = process.env.API_KEY!;
  const apiUrl = process.env.API_URL!;
  const privateKey = process.env.ACCESS_PRIVATE_KEY!;
  const apiClient = new APIClient(apiKey, apiUrl, privateKey);

  test("getAssetsData", async () => {
    const assetsData = await apiClient.getAssetsData();
    expect(assetsData).toBeDefined();
    expect(assetsData).toBeInstanceOf(Array);
    expect(assetsData.length).toBe(68);
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
    expect(Object.keys(balances2).length).toBe(5);
    expect(balances2["ETH"]).toBeDefined();
    expect(balances2["ETH"]).toBeInstanceOf(Object);
    expect(Object.keys(balances2["ETH"]).length).toBe(3);
    expect(balances2["ETH"]).toStrictEqual({
      ETHEREUM: 0.00950008,
      OPTIMISM: 0,
      ARBITRUM: 0,
    });

    expect(balances2["MATIC"]).toBeDefined();
    expect(balances2["MATIC"]).toBeInstanceOf(Object);
    expect(Object.keys(balances2["MATIC"]).length).toBe(1);
    expect(balances2["MATIC"]).toStrictEqual({ POLYGON: 0.00767327 });
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
      });
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
    expect(transaction.sourceAddress).toBe("0x1feDDa0D98c5B4FDEbde9342d3db6Eff284B0d18");
    expect(transaction.memo).toBeNull();
    expect(transaction.gasParams).toBeDefined();
    expect(transaction.gasParams).toBeInstanceOf(Object);
    expect(transaction.gasParams?.expectedGasFeeInToken).toBe("0.00055509");
    expect(transaction.gasParams?.gasFeeToken).toBe("ETH");
  });

  test("createContractCallTransaction", async () => {
    const vaults = await apiClient.getVaults({
      vaultName: "core-vault-1",
    });
    const vaultId = vaults[0].id;
    try {
      await apiClient.createContractCallTransaction({
        vaultId: vaultId,
        chain: Chain.ETHEREUM,
        messageHex: "0x",
        toAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        externalId: "externalId-1",
      });
    } catch (e: any) {
      expect(e).toBeDefined();
      expect(e.message).toBe("400 Bad Request: Bad Request");
    }
  });

  test("getTradeQuote", async () => {
    const sourceVaults = await apiClient.getVaults({
      vaultName: "core-vault-1",
    });
    const vaultId = sourceVaults[0].id;
    const tradeQuoteResponse = await apiClient.getTradeQuote({
      vaultId,
      fromAsset: "ETH",
      fromAmount: "0.0001",
      fromChain: "ETHEREUM",
      toAsset: "USDC",
      toChain: "ETHEREUM",
      slippage: "0.05",
    });
    expect(tradeQuoteResponse).toBeDefined();
    expect(tradeQuoteResponse).toBeInstanceOf(Object);
    expect(tradeQuoteResponse.tradeRequestData).toBeDefined();
    expect(tradeQuoteResponse.tradeRequestData).toBeInstanceOf(Object);
    expect(tradeQuoteResponse.tradeRequestData.fromAsset).toBe("ETH");
    expect(tradeQuoteResponse.tradeRequestData.fromAmount).toBe("0.0001");
    expect(tradeQuoteResponse.tradeRequestData.blockChain).toBe("ETHEREUM");
    expect(tradeQuoteResponse.tradeRequestData.toAsset).toBe("USDC");
    expect(tradeQuoteResponse.tradeRequestData.toBlockchain).toBe("ETHEREUM");

    expect(tradeQuoteResponse.tradeResponseDataList).toBeDefined();
    expect(tradeQuoteResponse.tradeResponseDataList).toBeInstanceOf(Array);
    expect(tradeQuoteResponse.tradeResponseDataList.length).toBe(1);
    expect(tradeQuoteResponse.tradeResponseDataList[0]).toBeDefined();
    expect(tradeQuoteResponse.tradeResponseDataList[0]).toBeInstanceOf(Object);
    expect(
      tradeQuoteResponse.tradeResponseDataList[0].finalToAmount,
    ).toBeDefined();
    expect(
      tradeQuoteResponse.tradeResponseDataList[0].finalToAmountUSD,
    ).toBeDefined();
    expect(
      tradeQuoteResponse.tradeResponseDataList[0].sourceName,
    ).toBeDefined();
  });

  test("createTradeTransaction", async () => {
    const sourceVaults = await apiClient.getVaults({
      vaultName: "core-vault-1",
    });
    const vaultId = sourceVaults[0].id;
    const tradeQuoteResponse = await apiClient.getTradeQuote({
      vaultId,
      fromAsset: "ETH",
      fromAmount: "0.0001",
      fromChain: "ETHEREUM",
      toAsset: "USDC",
      toChain: "ETHEREUM",
      slippage: "0.05",
    });
    try {
      await apiClient.createTradeTransaction({
        vaultId,
        tradeRequestData: tradeQuoteResponse.tradeRequestData,
        tradeResponseData: tradeQuoteResponse.tradeResponseDataList[0],
        externalId: "externalId-1",
      });
    } catch (e: any) {
      expect(e).toBeDefined();
      expect(e.message).toBe("400 Bad Request: Bad Request");
    }
  });
});
