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
exports.APIClient = void 0;
const baseApiClient_1 = require("./baseApiClient");
class APIClient extends baseApiClient_1.BaseAPIClient {
    getAssetsData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get("/api/external/assets/");
        });
    }
    getTransactions() {
        return __awaiter(this, arguments, void 0, function* (params = {}, page = 1, limit = 20) {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/transactions/?limit=${limit}&page=${page}`;
            if (query) {
                url += `&${query}`;
            }
            const transactionsResponse = yield this.get(url);
            return transactionsResponse.results;
        });
    }
    getTransactionById(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/transactions/${transactionId}/`);
        });
    }
    estimateFee(sourceId, destinationId, amount, asset, chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                sourceId,
                destinationId,
                amount,
                asset,
                blockChain: chain,
                category: "TRANSFER",
            };
            return yield this.post("/api/external/transactions/estimate_fee/", data);
        });
    }
    createTransferTransaction(sourceId_1, destinationId_1, amount_1, asset_1, chain_1) {
        return __awaiter(this, arguments, void 0, function* (sourceId, destinationId, amount, asset, chain, gasParams = {}, externalId, isAutomation = false, executeAt) {
            const data = {
                sourceId,
                destinationId,
                amount: String(amount),
                asset,
                blockChain: chain,
                category: "TRANSFER",
                gasParams,
                externalId,
                isAutomation,
                executeAt,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    getTradeQuote(vaultId, fromAsset, toAsset, fromAmount, fromChain, toChain, slippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                vaultId,
                fromAsset,
                toAsset,
                fromAmount,
                blockChain: fromChain,
                toBlockchain: toChain,
                slippage,
            };
            return yield this.get("/api/external/transactions/trade_quote/", params);
        });
    }
    createTradeTransaction(vaultId, tradeRequestData, tradeResponseData, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                vaultId,
                tradeRequestData,
                tradeResponseData,
                category: "SWAP",
                blockChain: tradeRequestData["blockChain"],
                externalId,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    getVaults() {
        return __awaiter(this, arguments, void 0, function* (params = {}, page = 1, limit = 20, reverse = false) {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/vaults/?limit=${limit}&page=${page}&reverse=${reverse}`;
            if (query) {
                url += `&${query}`;
            }
            const vaultsResponse = yield this.get(url);
            return vaultsResponse.results;
        });
    }
    getVaultById(vaultId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/vaults/${vaultId}/`);
        });
    }
    createVault(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post("/api/external/vaults/", data);
        });
    }
    getBalances(vaultId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/vaults/${vaultId}/balances/`);
        });
    }
    updateBalances(vaultId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post(`/api/external/vaults/${vaultId}/update_balances/`);
        });
    }
    getOperationMessageToSign(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/operations/${operationId}/operation_message_to_sign/`);
        });
    }
    updateUserAction(operationId, isApproved, signatureHex) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                isApproved,
                signatureHex,
                operationId,
            };
            return yield this.post(`/api/external/operations/${operationId}/update_user_action/`, data);
        });
    }
    getContacts() {
        return __awaiter(this, arguments, void 0, function* (params = {}, page = 1, limit = 20) {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/contacts/?limit=${limit}&page=${page}`;
            if (query) {
                url += `&${query}`;
            }
            const contactsResponse = yield this.get(url);
            return contactsResponse.results;
        });
    }
    getContactById(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/contacts/${contactId}/`);
        });
    }
    createContact(name, address, chain, tags, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name,
                address,
                blockChain: chain,
                tags,
                externalId,
            };
            return yield this.post("/api/external/contacts/", data);
        });
    }
}
exports.APIClient = APIClient;
