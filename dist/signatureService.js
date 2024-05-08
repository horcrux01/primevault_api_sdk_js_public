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
const crypto = require('crypto');
class BaseSignatureService {
}
class PrivateKeySignatureService extends BaseSignatureService {
    constructor(privateKey) {
        super();
        this.privateKey = privateKey;
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sign = crypto.createSign('SHA256');
            sign.update(data);
            sign.end();
            const signature = sign.sign(this.privateKey, 'hex');
            return Buffer.from(signature, 'hex');
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
            console.log('Signing data:', data);
            try {
                const input = {
                    KeyId: this.keyId,
                    Message: Buffer.from(data),
                    MessageType: client_kms_1.MessageType.RAW,
                    SigningAlgorithm: config_1.Config.getKmsSigningAlgorithm(),
                };
                const command = new client_kms_1.SignCommand(input);
                const response = yield this.kmsClient.send(command);
                return response.Signature;
            }
            catch (error) {
                console.error(`An error occurred while signing: ${error}`);
                return undefined;
            }
        });
    }
}
exports.KMSSignatureService = KMSSignatureService;
function getSignatureService(privateKey, keyId) {
    const signatureService = config_1.Config.getSignatureService();
    console.log('Signature service:', signatureService);
    if (signatureService === constants_1.SignatureServiceEnum.PRIVATE_KEY) {
        if (!privateKey)
            throw new Error('Private key is required for PRIVATE_KEY signature service.');
        return new PrivateKeySignatureService(privateKey);
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
