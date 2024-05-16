export interface Asset {
    asset: string;
    symbol: string;
    assetType: string;
    blockChain: string;
    logoURL: number;
    details: any;
}
export declare enum VaultType {
    EXCHANGE = "EXCHANGE",
    DEFAULT = "DEFAULT",
    GAS = "GAS"
}
export interface Vault {
    id: string;
    orgId: string;
    vaultName: string;
    vaultType: VaultType;
    wallets: {
        id: string;
        blockchain: string;
        address: string;
    }[];
    signers: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }[];
    viewers: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }[];
    walletsGenerated: boolean;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
export declare enum ContactStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED"
}
export interface Contact {
    id: string;
    orgId: string;
    name: string;
    blockChain: string;
    address: string;
    status: ContactStatus;
    isSmartContractAddress: boolean;
    tags?: string[];
    createdById: string;
    isSanctioned: boolean;
    externalId?: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
export declare enum TransactionType {
    INCOMING = "INCOMING",
    OUTGOING = "OUTGOING"
}
export declare enum TransactionCategory {
    TRANSFER = "TRANSFER",
    SWAP = "SWAP"
}
export declare enum TransactionSubCategory {
    INCOMING_TRANSFER = "INCOMING_TRANSFER",
    EXTERNAL_TRANSFER = "EXTERNAL_TRANSFER",
    INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
    LIMIT_TRADE = "LIMIT_TRADE",
    MARKET_TRADE = "MARKET_TRADE",
    APPROVE_TOKEN_ALLOWANCE = "APPROVE_TOKEN_ALLOWANCE"
}
export declare enum TransactionStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    "APPROVED" = "APPROVED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DECLINED = "DECLINED",
    SUBMITTED = "SUBMITTED",
    WAITING_CONFIRMATION = "WAITING_CONFIRMATION"
}
export interface Transaction {
    id: string;
    orgId: string;
    vaultId: string;
    asset: string;
    amount: number;
    blockChain: string;
    status: TransactionStatus;
    toAddress: string;
    toAddressName: string;
    txHash: string;
    error: string;
    toVaultId?: string;
    externalId?: string;
    transactionType: TransactionType;
    category: TransactionCategory;
    subCategory: TransactionSubCategory;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    createdById: string;
}
//# sourceMappingURL=types.d.ts.map