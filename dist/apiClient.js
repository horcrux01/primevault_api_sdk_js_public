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
const types_1 = require("./types");
function buildBankDetailsData(bank) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (!bank) {
        return null;
    }
    return {
        bankAccountId: (_a = bank.bankAccountId) !== null && _a !== void 0 ? _a : null,
        bankName: (_b = bank.bankName) !== null && _b !== void 0 ? _b : null,
        beneficiaryName: (_c = bank.beneficiaryName) !== null && _c !== void 0 ? _c : null,
        accountName: (_d = bank.accountName) !== null && _d !== void 0 ? _d : null,
        accountNumber: (_e = bank.accountNumber) !== null && _e !== void 0 ? _e : null,
        routingNumber: (_f = bank.routingNumber) !== null && _f !== void 0 ? _f : null,
        paymentRail: (_g = bank.paymentRail) !== null && _g !== void 0 ? _g : null,
        bankAddress: (_h = bank.bankAddress) !== null && _h !== void 0 ? _h : null,
        swiftCode: (_j = bank.swiftCode) !== null && _j !== void 0 ? _j : null,
        swiftBic: (_k = bank.swiftBic) !== null && _k !== void 0 ? _k : null,
        iban: (_l = bank.iban) !== null && _l !== void 0 ? _l : null,
        currency: (_m = bank.currency) !== null && _m !== void 0 ? _m : null,
        country: (_o = bank.country) !== null && _o !== void 0 ? _o : null,
    };
}
function buildTransferPartyData(party) {
    var _a, _b, _c, _d, _e, _f;
    if (!party) {
        return null;
    }
    return {
        type: party.type,
        id: (_a = party.id) !== null && _a !== void 0 ? _a : null,
        name: (_b = party.name) !== null && _b !== void 0 ? _b : null,
        address: (_c = party.address) !== null && _c !== void 0 ? _c : null,
        provider: (_d = party.provider) !== null && _d !== void 0 ? _d : null,
        bankDetails: buildBankDetailsData(party.bankDetails),
        chain: (_e = party.chain) !== null && _e !== void 0 ? _e : null,
        paymentRail: (_f = party.paymentRail) !== null && _f !== void 0 ? _f : null,
    };
}
function buildTransactionIntentData(request) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!request) {
        return null;
    }
    return {
        source: buildTransferPartyData(request.source),
        destination: buildTransferPartyData(request.destination),
        fromAsset: (_a = request.fromAsset) !== null && _a !== void 0 ? _a : null,
        toAsset: (_b = request.toAsset) !== null && _b !== void 0 ? _b : null,
        fromAmount: (_c = request.fromAmount) !== null && _c !== void 0 ? _c : null,
        fromChain: (_d = request.fromChain) !== null && _d !== void 0 ? _d : null,
        fromPaymentRail: (_e = request.fromPaymentRail) !== null && _e !== void 0 ? _e : null,
        toAmount: (_f = request.toAmount) !== null && _f !== void 0 ? _f : null,
        toChain: (_g = request.toChain) !== null && _g !== void 0 ? _g : null,
        toPaymentRail: (_h = request.toPaymentRail) !== null && _h !== void 0 ? _h : null,
    };
}
class APIClient extends baseApiClient_1.BaseAPIClient {
    getAssetsData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get("/api/external/assets/");
        });
    }
    getSupportedChains() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get("/api/external/assets/supported_chains/");
        });
    }
    getTransactions() {
        return __awaiter(this, arguments, void 0, function* (params = {}, limit = 20, cursor = "") {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/transactions/?limit=${limit}&cursor=${cursor !== null && cursor !== void 0 ? cursor : ""}`;
            if (query) {
                url += `&${query}`;
            }
            return (yield this.get(url));
        });
    }
    getTransactionById(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/transactions/${transactionId}/`);
        });
    }
    getChangeApprovalMessage(entityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get("/api/external/change_requests/approvals/approval_message/", { entityId });
        });
    }
    submitChangeApprovalAction(approvalId_1, action_1, signatureHex_1) {
        return __awaiter(this, arguments, void 0, function* (approvalId, action, signatureHex, reason = "ok") {
            const data = {
                action,
                signature: signatureHex,
            };
            if (reason !== null) {
                data.reason = reason;
            }
            return yield this.post(`/api/external/change_requests/approvals/${approvalId}/action/`, data);
        });
    }
    approveChangeRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const approvalMessage = yield this.getChangeApprovalMessage(request.entityId);
            const signatureHex = yield this.signatureService.sign(approvalMessage.message);
            return yield this.submitChangeApprovalAction(approvalMessage.approvalId, request.action, signatureHex, request.reason);
        });
    }
    approvePendingTransactionChangeRequest(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (transaction.status !== types_1.TransactionStatus.PENDING) {
                return transaction;
            }
            yield this.approveChangeRequest({
                entityId: transaction.id,
                action: types_1.ApprovalAction.APPROVE,
            });
            return yield this.getTransactionById(transaction.id);
        });
    }
    estimateFee(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                source: request.source,
                destination: request.destination,
                amount: request.amount,
                asset: request.asset,
                blockChain: request.chain,
                category: "TRANSFER",
            };
            return yield this.post("/api/external/transactions/estimate_fee/", data);
        });
    }
    createTransferTransaction(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                source: request.source,
                destination: request.destination,
                amount: request.amount,
                asset: request.asset,
                blockChain: request.chain,
                category: types_1.TransactionCategory.TRANSFER,
                gasParams: request.gasParams,
                externalId: request.externalId,
                isAutomation: request.isAutomation,
                executeAt: request.executeAt,
                memo: request.memo,
                feePayer: request.feePayer,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    createContractCallTransaction(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                vaultId: request.vaultId,
                blockChain: request.chain,
                amount: request.amount,
                category: types_1.TransactionCategory.CONTRACT_CALL,
                data: request.data,
                externalId: request.externalId,
                gasParams: request.gasParams,
                creationOptions: request.creationOptions,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    replaceTransaction(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post("/api/external/transactions/replace_transaction/", request);
        });
    }
    getQuote(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const intent = buildTransactionIntentData(request.intent);
            if (intent && request.intent.routeAccounts) {
                intent.routeAccounts = request.intent.routeAccounts.map((routeAccount) => ({
                    provider: routeAccount.provider,
                    id: routeAccount.id,
                }));
            }
            return yield this.post("/api/external/transactions/quote/", {
                intent,
            });
        });
    }
    createTransactionFromIntent(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = (yield this.post("/api/external/transactions/intent/create/", {
                intent: buildTransactionIntentData(request.intent),
                quoteId: request.quoteId,
                externalId: request.externalId,
                memo: request.memo,
            }));
            return yield this.approvePendingTransactionChangeRequest(transaction);
        });
    }
    markDepositDone(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post("/api/external/transactions/mark_deposit_done/", {
                transactionId,
            });
        });
    }
    getVaults() {
        return __awaiter(this, arguments, void 0, function* (params = {}, limit = 20, cursor) {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/vaults/?limit=${limit}&cursor=${cursor !== null && cursor !== void 0 ? cursor : ""}`;
            if (query) {
                url += `&${query}`;
            }
            return (yield this.get(url));
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
    getDetailedBalances(vaultId_1) {
        return __awaiter(this, arguments, void 0, function* (vaultId, params = {}) {
            return yield this.get(`/api/external/vaults/${vaultId}/detailed_balances/`, params);
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
        return __awaiter(this, arguments, void 0, function* (params = {}, limit = 20, cursor) {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/contacts/?limit=${limit}&cursor=${cursor !== null && cursor !== void 0 ? cursor : ""}`;
            if (query) {
                url += `&${query}`;
            }
            return (yield this.get(url));
        });
    }
    getContactById(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/contacts/${contactId}/`);
        });
    }
    createContact(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: request.name,
                address: request.address,
                blockChain: request.chain,
                tags: request.tags,
                externalId: request.externalId,
                assetList: request.assetList || [],
            };
            return yield this.post("/api/external/contacts/", data);
        });
    }
    updateContact(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                assetList: request.assetList || [],
            };
            return yield this.put(`/api/external/contacts/${request.id}/`, data);
        });
    }
    delegateResource(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                source: request.source,
                destination: request.destination,
                asset: request.asset,
                blockChain: request.chain,
                amount: request.amount,
                resourceType: request.resourceType,
                externalId: request.externalId,
                memo: request.memo,
                category: types_1.TransactionCategory.DELEGATE_RESOURCE,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    stakeResource(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                source: request.source,
                asset: request.asset,
                blockChain: request.chain,
                amount: request.amount,
                resourceType: request.resourceType,
                category: types_1.TransactionCategory.STAKE,
                externalId: request.externalId,
                memo: request.memo,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    // ── Bank Accounts ──────────────────────────────────────────────────
    getBankAccounts() {
        return __awaiter(this, arguments, void 0, function* (params = {}, limit = 20, cursor) {
            const query = new URLSearchParams(params).toString();
            let url = `/api/external/bank_accounts/?limit=${limit}&cursor=${cursor !== null && cursor !== void 0 ? cursor : ""}`;
            if (query) {
                url += `&${query}`;
            }
            return (yield this.get(url));
        });
    }
    getBankAccountById(bankAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/bank_accounts/${bankAccountId}/`);
        });
    }
    createBankAccount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post("/api/external/bank_accounts/", request);
        });
    }
}
exports.APIClient = APIClient;
