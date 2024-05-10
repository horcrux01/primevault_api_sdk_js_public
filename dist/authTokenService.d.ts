export declare class AuthTokenService {
    private apiKey;
    private signatureService;
    constructor(apiKey: string, privateKeyHex?: string, keyId?: string);
    generateAuthToken(urlPath: string, body?: Record<string, any>): Promise<string>;
    private encodeRequest;
}
//# sourceMappingURL=authTokenService.d.ts.map