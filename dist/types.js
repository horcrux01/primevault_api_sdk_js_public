"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionSubCategory = exports.TransactionCategory = exports.TransactionType = exports.ContactStatus = exports.VaultType = void 0;
var VaultType;
(function (VaultType) {
    VaultType["EXCHANGE"] = "EXCHANGE";
    VaultType["DEFAULT"] = "DEFAULT";
    VaultType["GAS"] = "GAS";
})(VaultType || (exports.VaultType = VaultType = {}));
var ContactStatus;
(function (ContactStatus) {
    ContactStatus["PENDING"] = "PENDING";
    ContactStatus["APPROVED"] = "APPROVED";
    ContactStatus["DECLINED"] = "DECLINED";
})(ContactStatus || (exports.ContactStatus = ContactStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOMING"] = "INCOMING";
    TransactionType["OUTGOING"] = "OUTGOING";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["TRANSFER"] = "TRANSFER";
    TransactionCategory["SWAP"] = "SWAP";
})(TransactionCategory || (exports.TransactionCategory = TransactionCategory = {}));
var TransactionSubCategory;
(function (TransactionSubCategory) {
    TransactionSubCategory["INCOMING_TRANSFER"] = "INCOMING_TRANSFER";
    TransactionSubCategory["EXTERNAL_TRANSFER"] = "EXTERNAL_TRANSFER";
    TransactionSubCategory["INTERNAL_TRANSFER"] = "INTERNAL_TRANSFER";
    TransactionSubCategory["LIMIT_TRADE"] = "LIMIT_TRADE";
    TransactionSubCategory["MARKET_TRADE"] = "MARKET_TRADE";
    TransactionSubCategory["APPROVE_TOKEN_ALLOWANCE"] = "APPROVE_TOKEN_ALLOWANCE";
})(TransactionSubCategory || (exports.TransactionSubCategory = TransactionSubCategory = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["DRAFT"] = "DRAFT";
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["APPROVED"] = "APPROVED";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["DECLINED"] = "DECLINED";
    TransactionStatus["SUBMITTED"] = "SUBMITTED";
    TransactionStatus["WAITING_CONFIRMATION"] = "WAITING_CONFIRMATION";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
