"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const constants_1 = require("./constants");
class Config {
    static set(key, value) {
        Config._config[key] = value;
    }
    static get(key) {
        return Config._config[key];
    }
    static clear() {
        Config._config = {};
    }
    static getSignatureService() {
        return Config.get('SIGNATURE_SERVICE') || constants_1.SignatureServiceEnum.PRIVATE_KEY;
    }
    static getExpiresIn() {
        return Config.get('EXPIRES_IN') || 300;
    }
    static getAwsRegion() {
        return Config.get('AWS_REGION') || 'eu-north-1';
    }
    static getKmsSigningAlgorithm() {
        return Config.get('KMS_SIGNING_ALGORITHM') || 'ECDSA_SHA_256';
    }
}
exports.Config = Config;
Config._config = {};
