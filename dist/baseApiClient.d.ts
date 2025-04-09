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
declare class BaseAPIException extends Error {
    responseText?: any;
    constructor(message: string, responseText?: any);
}
export declare class BadRequestError extends BaseAPIException {
}
export declare class UnauthorizedError extends BaseAPIException {
}
export declare class ForbiddenError extends BaseAPIException {
}
export declare class NotFoundError extends BaseAPIException {
}
export declare class InternalServerError extends BaseAPIException {
}
export declare class ServiceUnavailableError extends BaseAPIException {
}
export declare class TooManyRequestsError extends BaseAPIException {
}
export {};
//# sourceMappingURL=baseApiClient.d.ts.map