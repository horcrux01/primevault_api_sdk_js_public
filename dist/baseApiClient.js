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
exports.BaseAPIClient = void 0;
const axios_1 = __importDefault(require("axios"));
const authTokenService_1 = require("./authTokenService");
const signatureService_1 = require("./signatureService");
const utils_1 = require("./utils");
class BaseAPIClient {
    constructor(apiKey, apiUrl, privateKeyHex, keyId) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Api-Key': this.apiKey
        };
        this.authTokenService = new authTokenService_1.AuthTokenService(apiKey, privateKeyHex, keyId);
        this.signatureService = (0, signatureService_1.getSignatureService)(privateKeyHex, keyId);
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._makeRequest('GET', { urlPath: path, params });
        });
    }
    post(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._makeRequest('POST', { urlPath: path, data });
        });
    }
    _makeRequest(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { urlPath, params, data } = options;
            const full_url = `${this.apiUrl}${urlPath || ''}`;
            const api_token = yield this.authTokenService.generateAuthToken(urlPath || '', data);
            this.headers['Authorization'] = `Bearer ${api_token}`;
            if (data) {
                const dataSignature = yield this.signatureService.sign(JSON.stringify((0, utils_1.sortObjectKeys)(data)));
                data['dataSignatureHex'] = dataSignature.toString('hex');
            }
            const axiosConfig = {
                headers: this.headers,
                params: params || {},
                data: data || {}
            };
            try {
                const response = yield axios_1.default.request(Object.assign({ method, url: full_url }, axiosConfig));
                return response.data;
            }
            catch (error) {
                const response = error.response || {};
                const { status, data: responseText } = response;
                switch (status) {
                    case 400:
                        throw new BadRequestError(`400 Bad Request: ${response.statusText}`, responseText);
                    case 401:
                        throw new UnauthorizedError(`401 Unauthorized: ${response.statusText}`, responseText);
                    case 403:
                        throw new ForbiddenError(`403 Forbidden: ${response.statusText}`, responseText);
                    case 404:
                        throw new NotFoundError(`404 Not Found: ${response.statusText}`, responseText);
                    case 429:
                        throw new TooManyRequestsError(`429 Too Many Requests: ${response.statusText}`, responseText);
                    case 500:
                        throw new InternalServerError(`500 Internal Server Error: ${response.statusText}`, responseText);
                    default:
                        throw new Error(`HTTP Error: ${response.statusText}`);
                }
            }
        });
    }
}
exports.BaseAPIClient = BaseAPIClient;
class BaseAPIException extends Error {
    constructor(message, responseText) {
        super(message);
        this.responseText = responseText;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class BadRequestError extends BaseAPIException {
}
class UnauthorizedError extends BaseAPIException {
}
class ForbiddenError extends BaseAPIException {
}
class NotFoundError extends BaseAPIException {
}
class InternalServerError extends BaseAPIException {
}
class ServiceUnavailableError extends BaseAPIException {
}
class TooManyRequestsError extends BaseAPIException {
}
