export declare class BaseAPIClient {
    private apiKey;
    private apiUrl;
    private headers;
    private authTokenService;
    private signatureService;
    constructor(apiKey: string, apiUrl: string, privateKeyHex?: string, keyId?: string);
    get(path: string, params?: Record<string, any>): Promise<any>;
    post(path: string, data?: Record<string, any>): Promise<any>;
    private _makeRequest;
}
export declare class BaseAPIException extends Error {
    message: string;
    errorCode?: string;
    status?: number;
    responseText?: any;
    constructor(message: string, code?: string, status?: number, responseText?: any);
}
export declare class NetworkError extends BaseAPIException {
}
export declare class BadRequestError extends BaseAPIException {
}
export declare class UnauthorizedError extends BaseAPIException {
}
export declare class ForbiddenError extends BaseAPIException {
}
export declare class NotFoundError extends BaseAPIException {
}
export declare class RequestTimeoutError extends BaseAPIException {
}
export declare class ConflictError extends BaseAPIException {
}
export declare class ValidationError extends BaseAPIException {
}
export declare class TooManyRequestsError extends BaseAPIException {
}
export declare class InternalServerError extends BaseAPIException {
}
export declare class BadGatewayError extends BaseAPIException {
}
export declare class ServiceUnavailableError extends BaseAPIException {
}
export declare class GatewayTimeoutError extends BaseAPIException {
}
export declare class UnknownError extends BaseAPIException {
}
//# sourceMappingURL=baseApiClient.d.ts.map