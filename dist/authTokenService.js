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
exports.AuthTokenService = void 0;
const config_1 = require("./config");
const signatureService_1 = require("./signatureService");
const utils_1 = require("./utils");
const node_crypto_1 = require("node:crypto");
const uuid_1 = require("uuid");
class AuthTokenService {
    constructor(apiKey, privateKeyHex, keyId) {
        this.apiKey = apiKey;
        this.signatureService = (0, signatureService_1.getSignatureService)(privateKeyHex, keyId);
    }
    generateAuthToken(urlPath, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Math.floor(Date.now() / 1000);
            const expiresIn = config_1.Config.getExpiresIn();
            body = body || {};
            const bodyJson = JSON.stringify((0, utils_1.sortObjectKeys)(body));
            const hash = (0, node_crypto_1.createHash)("sha256");
            hash.update(bodyJson);
            const bodyHash = hash.digest("hex");
            const payload = {
                iat: timestamp,
                exp: timestamp + expiresIn,
                urlPath: urlPath,
                userId: this.apiKey,
                body: bodyHash,
                jti: (0, uuid_1.v4)(),
            };
            const headers = {
                alg: "ES256",
                typ: "JWT",
            };
            const encodedRequest = this.encodeRequest(headers, payload);
            const signatureHexString = yield this.signatureService.sign(encodedRequest);
            const encodedSignature = (0, utils_1.encodeBase64)(Buffer.from(signatureHexString, "hex"));
            return `${encodedRequest}.${encodedSignature}`;
        });
    }
    encodeRequest(headers, payload) {
        const jsonHeader = JSON.stringify((0, utils_1.sortObjectKeys)(headers), null, 0);
        const jsonPayload = JSON.stringify((0, utils_1.sortObjectKeys)(payload), null, 0);
        const encodedHeader = (0, utils_1.encodeBase64)(jsonHeader);
        const encodedPayload = (0, utils_1.encodeBase64)(jsonPayload);
        return `${encodedHeader}.${encodedPayload}`;
    }
}
exports.AuthTokenService = AuthTokenService;
