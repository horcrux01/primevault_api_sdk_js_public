export declare class AuthTokenService {
    private apiKey;
    private signatureService;
    constructor(apiKey: string, privateKey?: string, keyId?: string);
    generateAuthToken(urlPath: string, body?: Record<string, any>): Promise<string>;
    private encodeRequest;
}
//# sourceMappingURL=authTokenService.d.ts.map