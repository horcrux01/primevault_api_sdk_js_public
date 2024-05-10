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
exports.getSignatureService = exports.KMSSignatureService = exports.PrivateKeySignatureService = void 0;
const config_1 = require("./config");
const constants_1 = require("./constants");
const client_kms_1 = require("@aws-sdk/client-kms");
const utils_1 = require("./utils");
const crypto = require('crypto');
class BaseSignatureService {
}
class PrivateKeySignatureService extends BaseSignatureService {
    constructor(privateKeyHex) {
        super();
        const privateKeyDer = Buffer.from(privateKeyHex, 'hex');
        // Create a private key object from DER format
        this.privateKey = crypto.createPrivateKey({
            key: privateKeyDer,
            format: 'der',
            type: 'pkcs8'
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sign = crypto.createSign('SHA256');
            sign.update(data);
            sign.end();
            return sign.sign(this.privateKey, 'hex');
        });
    }
}
exports.PrivateKeySignatureService = PrivateKeySignatureService;
class KMSSignatureService extends BaseSignatureService {
    constructor(keyId) {
        super();
        this.keyId = keyId;
        this.kmsClient = new client_kms_1.KMS({
            region: config_1.Config.getAwsRegion()
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = {
                KeyId: this.keyId,
                Message: Buffer.from(data),
                MessageType: client_kms_1.MessageType.RAW,
                SigningAlgorithm: config_1.Config.getKmsSigningAlgorithm(),
            };
            const command = new client_kms_1.SignCommand(input);
            const response = yield this.kmsClient.send(command);
            return (0, utils_1.uInt8ArrayToHex)(response.Signature);
        });
    }
}
exports.KMSSignatureService = KMSSignatureService;
function getSignatureService(privateKeyHex, keyId) {
    const signatureService = config_1.Config.getSignatureService();
    if (signatureService === constants_1.SignatureServiceEnum.PRIVATE_KEY) {
        if (!privateKeyHex)
            throw new Error('Private key is required for PRIVATE_KEY signature service.');
        return new PrivateKeySignatureService(privateKeyHex);
    }
    else if (signatureService === constants_1.SignatureServiceEnum.AWS_KMS) {
        if (!keyId)
            throw new Error('Key ID is required for AWS_KMS signature service.');
        return new KMSSignatureService(keyId);
    }
    else {
        throw new Error(`Invalid signature service: ${signatureService}`);
    }
}
exports.getSignatureService = getSignatureService;
