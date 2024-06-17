"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiClient_1 = require("./apiClient");
const types_1 = require("./types");
const constants_1 = require("./constants");
describe("APIClient", () => {
    const apiKey = process.env.API_KEY;
    const apiUrl = process.env.API_URL;
    const privateKey = process.env.ACCESS_PRIVATE_KEY;
    const apiClient = new apiClient_1.APIClient(apiKey, apiUrl, privateKey);
    test("getAssetsData", () => __awaiter(void 0, void 0, void 0, function* () {
        const assetsData = yield apiClient.getAssetsData();
        expect(assetsData).toBeDefined();
        expect(assetsData).toBeInstanceOf(Array);
        expect(assetsData.length).toBe(67);
    }));
    test("getVaults", () => __awaiter(void 0, void 0, void 0, function* () {
        const vaults = yield apiClient.getVaults({ vaultName: "core-vault-1" });
        expect(vaults).toBeDefined();
        expect(vaults).toBeInstanceOf(Array);
        expect(vaults.length).toBe(1);
        expect(vaults[0].vaultName).toBe("core-vault-1");
        expect(vaults[0].vaultType).toBe(types_1.VaultType.DEFAULT);
        expect(vaults[0].wallets).toBeDefined();
        expect(vaults[0].wallets.length).toBe(8);
        expect(vaults[0].signers).toBeDefined();
        expect(vaults[0].signers.length).toBe(8);
        expect(vaults[0].viewers.length).toBe(0);
        const blockchains = vaults[0].wallets
            .map((wallet) => wallet.blockchain)
            .sort();
        expect(blockchains).toEqual([
            "ETHEREUM",
            "POLYGON",
            "SOLANA",
            "NEAR",
            "APTOS",
            "ARBITRUM",
            "OPTIMISM",
            "MOONBEAM",
        ].sort());
        const vault = yield apiClient.getVaultById(vaults[0].id);
        expect(vault).toBeDefined();
        expect(vault).toBeInstanceOf(Object);
        expect(vault.vaultName).toBe("core-vault-1");
        expect(vault.vaultType).toBe(types_1.VaultType.DEFAULT);
    }));
    test("getBalances", () => __awaiter(void 0, void 0, void 0, function* () {
        let vaults = yield apiClient.getVaults({ vaultName: "core-vault-1" });
        // all balances are 0
        const balances = yield apiClient.getBalances(vaults[0].id);
        expect(balances).toBeDefined();
        expect(balances).toBeInstanceOf(Object);
        expect(balances).toStrictEqual({});
        // non-zero balances
        vaults = yield apiClient.getVaults({ vaultName: "Ethereum Vault" });
        const balances2 = yield apiClient.getBalances(vaults[0].id);
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
    }));
    test("getContacts", () => __awaiter(void 0, void 0, void 0, function* () {
        const contacts = yield apiClient.getContacts({ name: "Lynn Bell" });
        expect(contacts).toBeDefined();
        expect(contacts).toBeInstanceOf(Array);
        expect(contacts.length).toBe(1);
        expect(contacts[0].name).toBe("Lynn Bell");
        expect(contacts[0].blockChain).toBe("SOLANA");
        expect(contacts[0].address).toBe("CEzN7mqP9xoxn2HdyW6fjEJ73t7qaX9Rp2zyS6hb3iEu");
        expect(contacts[0].status).toBe(types_1.ContactStatus.APPROVED);
    }));
    test("createVault", () => __awaiter(void 0, void 0, void 0, function* () {
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
            yield apiClient.createVault(data);
        }
        catch (e) {
            // vault already exists
            expect(e).toBeDefined();
            expect(e.message).toBe("400 Bad Request: Bad Request");
        }
    }));
    test("createTransferTransaction", () => __awaiter(void 0, void 0, void 0, function* () {
        // find the asset and chain
        const assets = yield apiClient.getAssetsData();
        const ethereumAsset = assets.find((asset) => asset.blockChain === "ETHEREUM" && asset.symbol === "ETH");
        const sourceVaults = yield apiClient.getVaults({
            vaultName: "core-vault-1",
        }); // source
        const destinationContacts = yield apiClient.getContacts({
            name: "Lynn Bell",
        }); // destination
        const sourceId = sourceVaults[0].id;
        const destinationId = destinationContacts[0].id;
        try {
            yield apiClient.createTransferTransaction({
                sourceId: sourceId,
                destinationId: destinationId,
                amount: "0.0001",
                asset: ethereumAsset.symbol,
                chain: ethereumAsset.blockChain,
                externalId: "externalId-1",
            });
        }
        catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toBe("400 Bad Request: Bad Request");
        }
    }));
    test("getTransactionsById", () => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = yield apiClient.getTransactionById("f1cb568d-215e-426f-998a-4ba5be8288d4");
        expect(transaction).toBeDefined();
        expect(transaction).toBeInstanceOf(Object);
        expect(transaction.id).toBe("f1cb568d-215e-426f-998a-4ba5be8288d4");
        expect(transaction.status).toBe("PENDING");
        expect(transaction.blockChain).toBe("ETHEREUM");
        expect(transaction.externalId).toBeNull();
        expect(transaction.toAddressName).toBe("Compound");
    }));
    test("createContractCallTransaction", () => __awaiter(void 0, void 0, void 0, function* () {
        const vaults = yield apiClient.getVaults({
            vaultName: "core-vault-1",
        });
        const vaultId = vaults[0].id;
        try {
            yield apiClient.createContractCallTransaction({
                vaultId: vaultId,
                chain: constants_1.Chain.ETHEREUM,
                messageHex: "0x",
                toAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                externalId: "externalId-1",
            });
        }
        catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toBe("400 Bad Request: Bad Request");
        }
    }));
});
