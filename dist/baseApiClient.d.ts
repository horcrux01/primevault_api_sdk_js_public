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
//# sourceMappingURL=baseApiClient.d.ts.map