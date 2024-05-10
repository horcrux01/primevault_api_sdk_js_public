declare abstract class BaseSignatureService {
    abstract sign(data: string): Promise<string | undefined>;
}
export declare class PrivateKeySignatureService extends BaseSignatureService {
    private privateKey;
    constructor(privateKeyHex: string);
    sign(data: string): Promise<string | undefined>;
}
export declare class KMSSignatureService extends BaseSignatureService {
    private kmsClient;
    private keyId;
    constructor(keyId: string);
    sign(data: string): Promise<string | undefined>;
}
export declare function getSignatureService(privateKeyHex?: string, keyId?: string): BaseSignatureService;
export {};
//# sourceMappingURL=signatureService.d.ts.map