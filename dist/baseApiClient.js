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
exports.UnknownError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.InternalServerError = exports.TooManyRequestsError = exports.ValidationError = exports.ConflictError = exports.RequestTimeoutError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.NetworkError = exports.BaseAPIException = exports.BaseAPIClient = void 0;
const axios_1 = __importDefault(require("axios"));
const authTokenService_1 = require("./authTokenService");
const signatureService_1 = require("./signatureService");
const utils_1 = require("./utils");
class BaseAPIClient {
    constructor(apiKey, apiUrl, privateKeyHex, keyId) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Api-Key": this.apiKey,
        };
        this.authTokenService = new authTokenService_1.AuthTokenService(apiKey, privateKeyHex, keyId);
        this.signatureService = (0, signatureService_1.getSignatureService)(privateKeyHex, keyId);
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._makeRequest("GET", { urlPath: path, params });
        });
    }
    post(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._makeRequest("POST", { urlPath: path, data });
        });
    }
    _makeRequest(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { urlPath, params, data } = options;
            const full_url = `${this.apiUrl}${urlPath || ""}`;
            const api_token = yield this.authTokenService.generateAuthToken(urlPath || "", data);
            const requestHeaders = Object.assign(Object.assign({}, this.headers), { Authorization: `Bearer ${api_token}` });
            let requestData = data;
            if (data) {
                requestData = Object.assign({}, data);
                const dataSignature = yield this.signatureService.sign(JSON.stringify((0, utils_1.sortObjectKeys)(data)));
                requestData["dataSignatureHex"] = dataSignature.toString("hex");
            }
            const axiosConfig = {
                headers: requestHeaders,
            };
            if (requestData && Object.keys(requestData).length > 0) {
                axiosConfig.data = requestData;
            }
            if (params && Object.keys(params).length > 0) {
                axiosConfig.params = params;
            }
            try {
                const response = yield axios_1.default.request(Object.assign({ method, url: full_url }, axiosConfig));
                return response.data;
            }
            catch (error) {
                if (!error.response) {
                    throw new NetworkError(error.message || "Network request failed");
                }
                const { status, data: responseData } = error.response;
                const errorMessage = (typeof responseData === "object" && (responseData === null || responseData === void 0 ? void 0 : responseData.message)) ||
                    (typeof responseData === "string" && responseData) ||
                    "Unknown error";
                const errorCode = typeof responseData === "object" ? responseData === null || responseData === void 0 ? void 0 : responseData.code : undefined;
                switch (status) {
                    case 400:
                        throw new BadRequestError(errorMessage, errorCode, status, responseData);
                    case 401:
                        throw new UnauthorizedError(errorMessage, errorCode, status, responseData);
                    case 403:
                        throw new ForbiddenError(errorMessage, errorCode, status, responseData);
                    case 404:
                        throw new NotFoundError(errorMessage, errorCode, status, responseData);
                    case 408:
                        throw new RequestTimeoutError(errorMessage, errorCode, status, responseData);
                    case 409:
                        throw new ConflictError(errorMessage, errorCode, status, responseData);
                    case 422:
                        throw new ValidationError(errorMessage, errorCode, status, responseData);
                    case 429:
                        throw new TooManyRequestsError(errorMessage, errorCode, status, responseData);
                    case 500:
                        throw new InternalServerError(errorMessage, errorCode, status, responseData);
                    case 502:
                        throw new BadGatewayError(errorMessage, errorCode, status, responseData);
                    case 503:
                        throw new ServiceUnavailableError(errorMessage, errorCode, status, responseData);
                    case 504:
                        throw new GatewayTimeoutError(errorMessage, errorCode, status, responseData);
                    default:
                        throw new UnknownError(errorMessage, errorCode, status, responseData);
                }
            }
        });
    }
}
exports.BaseAPIClient = BaseAPIClient;
class BaseAPIException extends Error {
    constructor(message, code, status, responseText) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = code;
        this.message = message;
        this.status = status;
        this.responseText = responseText;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseAPIException = BaseAPIException;
class NetworkError extends BaseAPIException {
}
exports.NetworkError = NetworkError;
class BadRequestError extends BaseAPIException {
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends BaseAPIException {
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends BaseAPIException {
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends BaseAPIException {
}
exports.NotFoundError = NotFoundError;
class RequestTimeoutError extends BaseAPIException {
}
exports.RequestTimeoutError = RequestTimeoutError;
class ConflictError extends BaseAPIException {
}
exports.ConflictError = ConflictError;
class ValidationError extends BaseAPIException {
}
exports.ValidationError = ValidationError;
class TooManyRequestsError extends BaseAPIException {
}
exports.TooManyRequestsError = TooManyRequestsError;
class InternalServerError extends BaseAPIException {
}
exports.InternalServerError = InternalServerError;
class BadGatewayError extends BaseAPIException {
}
exports.BadGatewayError = BadGatewayError;
class ServiceUnavailableError extends BaseAPIException {
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends BaseAPIException {
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class UnknownError extends BaseAPIException {
}
exports.UnknownError = UnknownError;
