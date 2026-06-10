export declare class AuthTokenService {
    private apiKey;
    private signatureService;
    constructor(apiKey: string, privateKeyHex?: string, keyId?: string);
    /**
     * Generates a signed JWT used as the Bearer token for API requests.
     *
     * @param urlPath - URL path of the request the token is issued for (e.g. "/api/external/transactions/"); must match the path actually called.
     * @param body - Request body for POST/PUT requests; it is hashed into the token, so pass the exact payload being sent. Omit for GET requests.
     */
    generateAuthToken(urlPath: string, body?: Record<string, any>): Promise<string>;
    private encodeRequest;
}
//# sourceMappingURL=authTokenService.d.ts.map