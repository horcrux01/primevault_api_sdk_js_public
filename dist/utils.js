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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase64 = exports.sortObjectKeys = exports.generateAwsKmsKeyPair = exports.generatePublicPrivateKeyPair = exports.uInt8ArrayToHex = void 0;
const base64url_1 = __importDefault(require("base64url"));
const client_kms_1 = require("@aws-sdk/client-kms");
const config_1 = require("./config");
const crypto = require("crypto");
function uInt8ArrayToHex(uInt8Array) {
    return Buffer.from(uInt8Array).toString("hex");
}
exports.uInt8ArrayToHex = uInt8ArrayToHex;
function generatePublicPrivateKeyPair() {
    return __awaiter(this, void 0, void 0, function* () {
        const { publicKey, privateKey } = yield crypto.generateKeyPairSync("ec", {
            namedCurve: "prime256v1",
            publicKeyEncoding: {
                type: "spki",
                format: "der",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "der",
            },
        });
        return {
            publicKeyHex: publicKey.toString("hex"),
            privateKeyHex: privateKey.toString("hex"),
        };
    });
}
exports.generatePublicPrivateKeyPair = generatePublicPrivateKeyPair;
function generateAwsKmsKeyPair(aliasName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const kmsClient = new client_kms_1.KMS({
            region: config_1.Config.getAwsRegion(),
        });
        const input = {
            Description: "Key for Signing PrimeVault requests",
            CustomerMasterKeySpec: "ECC_NIST_P256",
            KeyUsage: "SIGN_VERIFY",
            Origin: "AWS_KMS",
        };
        const command = new client_kms_1.CreateKeyCommand(input);
        const response = yield kmsClient.send(command);
        const keyId = (_a = response.KeyMetadata) === null || _a === void 0 ? void 0 : _a.KeyId;
        const aliasInput = {
            AliasName: `alias/${aliasName || "PrimeVaultSigningKey"}`, // update this to your desired alias
            TargetKeyId: keyId,
        };
        const aliasCommand = new client_kms_1.CreateAliasCommand(aliasInput);
        yield kmsClient.send(aliasCommand);
        const publicKeyInput = {
            KeyId: keyId,
        };
        const publicKeyCommand = new client_kms_1.GetPublicKeyCommand(publicKeyInput);
        const publicKeyResponse = yield kmsClient.send(publicKeyCommand);
        return { publicKeyHex: uInt8ArrayToHex(publicKeyResponse.PublicKey), keyId };
    });
}
exports.generateAwsKmsKeyPair = generateAwsKmsKeyPair;
function sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }
    else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
            result[key] = sortObjectKeys(obj[key]);
            return result;
        }, {});
    }
    return obj;
}
exports.sortObjectKeys = sortObjectKeys;
function encodeBase64(data) {
    return base64url_1.default.encode(data);
}
exports.encodeBase64 = encodeBase64;
