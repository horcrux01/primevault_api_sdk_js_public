/// <reference types="node" />
declare abstract class BaseSignatureService {
    abstract sign(data: string): Promise<Buffer | undefined>;
}
export declare class PrivateKeySignatureService extends BaseSignatureService {
    private privateKey;
    constructor(privateKey: string);
    sign(data: string): Promise<Buffer | undefined>;
}
export declare class KMSSignatureService extends BaseSignatureService {
    private kmsClient;
    private keyId;
    constructor(keyId: string);
    sign(data: string): Promise<Buffer | undefined>;
}
export declare function getSignatureService(privateKey?: string, keyId?: string): BaseSignatureService;
export {};
//# sourceMappingURL=signatureService.d.ts.map