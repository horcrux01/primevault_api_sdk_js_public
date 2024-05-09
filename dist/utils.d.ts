export declare function generatePublicPrivateKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
}>;
export declare function generateAwsKmsKeyPair(): Promise<{
    publicKey: string;
    keyId: string | undefined;
}>;
export declare function sortObjectKeys(obj: object): object;
export declare function encodeBase64(data: string): string;
//# sourceMappingURL=utils.d.ts.map