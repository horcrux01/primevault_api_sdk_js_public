"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = exports.SignatureServiceEnum = void 0;
var SignatureServiceEnum;
(function (SignatureServiceEnum) {
    SignatureServiceEnum["AWS_KMS"] = "AWS_KMS";
    SignatureServiceEnum["PRIVATE_KEY"] = "PRIVATE_KEY";
})(SignatureServiceEnum || (exports.SignatureServiceEnum = SignatureServiceEnum = {}));
var Chain;
(function (Chain) {
    Chain["ETHEREUM"] = "ETHEREUM";
    Chain["POLYGON"] = "POLYGON";
    Chain["SOLANA"] = "SOLANA";
    Chain["NEAR"] = "NEAR";
    Chain["APTOS"] = "APTOS";
    Chain["ARBITRUM"] = "ARBITRUM";
    Chain["OPTIMISM"] = "OPTIMISM";
})(Chain || (exports.Chain = Chain = {}));
