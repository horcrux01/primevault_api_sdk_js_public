/// <reference types="node" />
export declare function uInt8ArrayToHex(uInt8Array: Uint8Array): string;
export declare function generatePublicPrivateKeyPair(): Promise<{
    publicKeyHex: any;
    privateKeyHex: any;
}>;
export declare function generateAwsKmsKeyPair(aliasName?: string): Promise<{
    publicKeyHex: string;
    keyId: string | undefined;
}>;
export declare function sortObjectKeys(obj: object): object;
export declare function encodeBase64(data: string | Buffer): string;
//# sourceMappingURL=utils.d.ts.map