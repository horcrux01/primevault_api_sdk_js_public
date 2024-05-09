export declare class Config {
    private static _config;
    static set(key: string, value: any): void;
    static get<T>(key: string): T | undefined;
    static clear(): void;
    static getSignatureService(): {};
    static getExpiresIn(): number;
    static getAwsRegion(): string;
    static getKmsSigningAlgorithm(): string;
}
//# sourceMappingURL=config.d.ts.map