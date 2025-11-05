"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFeeTier = exports.TransactionStatus = exports.TransactionSubCategory = exports.TransactionCategory = exports.TransactionType = exports.ContactStatus = exports.VaultType = exports.TransferPartyType = void 0;
var TransferPartyType;
(function (TransferPartyType) {
    TransferPartyType["CONTACT"] = "CONTACT";
    TransferPartyType["VAULT"] = "VAULT";
    TransferPartyType["EXTERNAL_ADDRESS"] = "EXTERNAL_ADDRESS";
})(TransferPartyType || (exports.TransferPartyType = TransferPartyType = {}));
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
    TransactionCategory["TOKEN_TRANSFER"] = "TOKEN_TRANSFER";
    TransactionCategory["TOKEN_APPROVAL"] = "TOKEN_APPROVAL";
    TransactionCategory["CONTRACT_CALL"] = "CONTRACT_CALL";
    TransactionCategory["STAKE"] = "STAKE";
    TransactionCategory["REVOKE_TOKEN_ALLOWANCE"] = "REVOKE_TOKEN_ALLOWANCE";
    TransactionCategory["ON_RAMP"] = "ON_RAMP";
    TransactionCategory["OFF_RAMP"] = "OFF_RAMP";
})(TransactionCategory || (exports.TransactionCategory = TransactionCategory = {}));
var TransactionSubCategory;
(function (TransactionSubCategory) {
    TransactionSubCategory["INCOMING_TRANSFER"] = "INCOMING_TRANSFER";
    TransactionSubCategory["EXTERNAL_TRANSFER"] = "EXTERNAL_TRANSFER";
    TransactionSubCategory["INTERNAL_TRANSFER"] = "INTERNAL_TRANSFER";
    TransactionSubCategory["LIMIT_TRADE"] = "LIMIT_TRADE";
    TransactionSubCategory["MARKET_TRADE"] = "MARKET_TRADE";
    TransactionSubCategory["APPROVE_TOKEN_ALLOWANCE"] = "APPROVE_TOKEN_ALLOWANCE";
    TransactionSubCategory["CUSTOM_MESSAGE"] = "CUSTOM_MESSAGE";
    TransactionSubCategory["CONTRACT_CALL"] = "CONTRACT_CALL";
    TransactionSubCategory["STAKE"] = "STAKE";
    TransactionSubCategory["UNSTAKE"] = "UNSTAKE";
    TransactionSubCategory["CLAIM"] = "CLAIM";
    TransactionSubCategory["ON_RAMP"] = "ON_RAMP";
    TransactionSubCategory["OFF_RAMP"] = "OFF_RAMP";
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
    TransactionStatus["SIGNED"] = "SIGNED";
    TransactionStatus["WAITING_CONFIRMATION"] = "WAITING_CONFIRMATION";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionFeeTier;
(function (TransactionFeeTier) {
    TransactionFeeTier["HIGH"] = "HIGH";
    TransactionFeeTier["MEDIUM"] = "MEDIUM";
    TransactionFeeTier["LOW"] = "LOW";
})(TransactionFeeTier || (exports.TransactionFeeTier = TransactionFeeTier = {}));
