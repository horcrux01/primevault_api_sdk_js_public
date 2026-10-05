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
// accountNumberMasked and swiftBic only appear in deposit instructions; the
// backend BankDetails request contract has no such fields.
function buildBankDetailsData(bank) {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (bank.bankAccountId === undefined ? {} : { bankAccountId: bank.bankAccountId })), (bank.bankName === undefined ? {} : { bankName: bank.bankName })), (bank.bankCode === undefined ? {} : { bankCode: bank.bankCode })), (bank.beneficiaryName === undefined
        ? {}
        : { beneficiaryName: bank.beneficiaryName })), (bank.accountName === undefined ? {} : { accountName: bank.accountName })), (bank.accountNumber === undefined ? {} : { accountNumber: bank.accountNumber })), (bank.routingNumber === undefined ? {} : { routingNumber: bank.routingNumber })), (bank.paymentRail === undefined ? {} : { paymentRail: bank.paymentRail })), (bank.bankAddress === undefined ? {} : { bankAddress: bank.bankAddress })), (bank.beneficiaryAddress === undefined
        ? {}
        : { beneficiaryAddress: bank.beneficiaryAddress })), (bank.swiftCode === undefined ? {} : { swiftCode: bank.swiftCode })), (bank.iban === undefined ? {} : { iban: bank.iban })), (bank.country === undefined ? {} : { country: bank.country }));
}
function buildTransferPartyData(party) {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: party.type }, (party.id === undefined ? {} : { id: party.id })), (party.name === undefined ? {} : { name: party.name })), (party.address === undefined ? {} : { address: party.address })), (party.provider === undefined ? {} : { provider: party.provider })), (party.bankDetails === undefined
        ? {}
        : { bankDetails: buildBankDetailsData(party.bankDetails) })), (party.chain === undefined ? {} : { chain: party.chain })), (party.paymentRail === undefined ? {} : { paymentRail: party.paymentRail }));
}
function buildIntentAssetData(asset) {
    return Object.assign(Object.assign({ asset: asset.asset }, (asset.amount === undefined ? {} : { amount: asset.amount })), (asset.vaultId === undefined ? {} : { vaultId: asset.vaultId }));
}
function buildTransactionIntentData(request) {
    if (!request) {
        return null;
    }
    return Object.assign(Object.assign({ input: buildIntentAssetData(request.input), output: buildIntentAssetData(request.output) }, (request.source === undefined
        ? {}
        : { source: buildTransferPartyData(request.source) })), (request.destination === undefined
        ? {}
        : { destination: buildTransferPartyData(request.destination) }));
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
    getActivityEvents() {
        return __awaiter(this, arguments, void 0, function* (params = {}, limit = 20, cursor = "") {
            const query = new URLSearchParams(Object.assign({ limit: String(limit), cursor: cursor !== null && cursor !== void 0 ? cursor : "" }, params));
            return (yield this.get(`/api/external/activity/events/?${query.toString()}`));
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
                memo: request.memo,
                feePayer: request.feePayer,
            };
            return yield this.post("/api/external/transactions/", data);
        });
    }
    /**
     * Create a transfer transaction and approve it in one call.
     *
     * The transaction is only signed for approval when it lands in PENDING, so
     * orgs whose policy approves on create get the created transaction back
     * untouched.
     */
    createTransactionWithApproval(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.createTransferTransaction(request);
            return yield this.approvePendingTransactionChangeRequest(transaction);
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
            return yield this.post("/api/external/transactions/v2/quote/", {
                intent: buildTransactionIntentData(request.intent),
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
    getVaultDepositInstructions(vaultId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/api/external/vaults/${vaultId}/deposit_instructions/`, request);
        });
    }
    createVault(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post("/api/external/vaults/", data);
        });
    }
    createVaultApproval(vault) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.approveChangeRequest({
                entityId: vault.id,
                action: types_1.ApprovalAction.APPROVE,
            });
            return yield this.getVaultById(vault.id);
        });
    }
    createVaultWithApproval(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const vault = yield this.createVault(request);
            return yield this.createVaultApproval(vault);
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
    getSubOrgs() {
        return __awaiter(this, arguments, void 0, function* (params = {}, limit = 20, cursor) {
            const query = new URLSearchParams(Object.assign({ limit: String(limit), cursor: cursor !== null && cursor !== void 0 ? cursor : "" }, params));
            return (yield this.get(`/api/external/sub_orgs/?${query}`));
        });
    }
    createSubOrg(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post("/api/external/sub_orgs/", request);
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
                subOrgId: request.subOrgId,
                address: request.address,
                blockChain: request.chain,
                tags: request.tags,
                externalId: request.externalId,
                assetList: request.assetList || [],
                contactGroupIds: request.contactGroupIds,
            };
            return yield this.post("/api/external/contacts/", data);
        });
    }
    createContactApproval(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.approveChangeRequest({
                entityId: contact.id,
                action: types_1.ApprovalAction.APPROVE,
            });
            return yield this.getContactById(contact.id);
        });
    }
    createContactWithApproval(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield this.createContact(request);
            return yield this.createContactApproval(contact);
        });
    }
    updateContact(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                assetList: request.assetList || [],
                contactGroupIds: request.contactGroupIds,
            };
            return yield this.put(`/api/external/contacts/${request.id}/`, data);
        });
    }
    updateContactWithApproval(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.updateContact(request);
            return yield this.createContactApproval(updated);
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
    createBankAccountApproval(bankAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.approveChangeRequest({
                entityId: bankAccount.id,
                action: types_1.ApprovalAction.APPROVE,
            });
            return yield this.getBankAccountById(bankAccount.id);
        });
    }
    createBankAccountWithApproval(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccount = yield this.createBankAccount(request);
            return yield this.createBankAccountApproval(bankAccount);
        });
    }
}
exports.APIClient = APIClient;
