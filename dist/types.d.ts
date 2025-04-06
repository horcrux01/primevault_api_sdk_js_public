export interface Asset {
    name: string;
    symbol: string;
    blockChain: string;
    logoURL?: number;
    details?: any;
}
export interface ChainData {
    value: string;
    label: string;
    logo: string;
}
export declare enum TransferPartyType {
    CONTACT = "CONTACT",
    VAULT = "VAULT",
    EXTERNAL_ADDRESS = "EXTERNAL_ADDRESS"
}
export interface TransferPartyData {
    type: TransferPartyType;
    id?: string;
    value?: string;
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
        address?: string;
    }[];
    signers: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }[];
    viewers: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
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
    operationId?: string;
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
    APPROVED = "APPROVED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DECLINED = "DECLINED",
    SUBMITTED = "SUBMITTED",
    SIGNED = "SIGNED",
    WAITING_CONFIRMATION = "WAITING_CONFIRMATION"
}
export declare enum TransactionFeeTier {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export interface EVMOutput {
    returnData?: string;
}
export interface ICPOutput {
    certificate?: string;
    contentMap?: string;
}
export type TransactionOutput = EVMOutput | ICPOutput;
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
    gasParams?: {
        finalGasFeeInUSD?: string;
        finalGasFeeInToken?: string;
        gasFeeToken?: string;
        expectedGasFeeInToken?: string;
    };
    memo?: string;
    sourceAddress?: string;
    txnSignature?: string;
    txnSignatureData?: Record<string, any>;
    output?: TransactionOutput;
    amountInUSD?: string;
    nonce?: number;
}
export interface TransactionCreationGasParams {
    feeTier?: TransactionFeeTier;
}
export interface TransactionCreationOptions {
    skipPreprocessSimulation?: boolean;
}
export interface CreateTransferTransactionRequest {
    source: TransferPartyData;
    destination: TransferPartyData;
    amount: string;
    asset: string;
    chain: string;
    gasParams?: TransactionCreationGasParams;
    externalId?: string;
    isAutomation?: boolean;
    executeAt?: string;
    memo?: string;
}
export interface EVMContractCallData {
    callData: string;
    toAddress?: string;
}
export interface ICPCanisterCallData {
    canisterId: string;
    method: string;
    arg: string;
}
export interface RawSigningData {
    messageHex: string;
}
export type ContractCallData = EVMContractCallData | ICPCanisterCallData | RawSigningData;
export interface CreateContractCallTransactionRequest {
    vaultId: string;
    chain: string;
    amount?: string;
    data?: ContractCallData;
    externalId?: string;
    gasParams?: TransactionCreationGasParams;
    creationOptions?: TransactionCreationOptions;
}
export interface ReplaceTransactionRequest {
    transactionId: string;
}
export interface EstimateFeeRequest {
    source: TransferPartyData;
    destination: TransferPartyData;
    amount: string;
    asset: string;
    chain: string;
}
export interface CreateVaultRequest {
    vaultName: string;
    templateId: string;
    chains?: string[];
}
export interface TradeQuoteRequest {
    vaultId: string;
    fromAsset: string;
    fromAmount: string;
    fromChain: string;
    toAsset: string;
    toChain: string;
    slippage: string;
}
export interface CreateTradeTransactionRequest {
    vaultId: string;
    tradeRequestData: Record<string, any>;
    tradeResponseData: Record<string, any>;
    externalId?: string;
    memo?: string;
}
export interface CreateContactRequest {
    name: string;
    address: string;
    chain: string;
    tags?: string[];
    externalId?: string;
}
export interface FeeData {
    expectedFeeInAsset: string;
    asset: string;
    expectedFeeInUSD: string;
    baseFee?: string;
    priorityFee?: string;
}
export interface EstimatedFeeResponse {
    high: FeeData;
    medium: FeeData;
    low: FeeData;
}
export interface TradeQuoteResponseData {
    finalToAmount: string;
    finalToAmountUSD: string;
    sourceName: string;
    feeInUSD: string;
    autoSlippage: string;
    unitToAssetAmount?: string;
    quotesValidTill?: string;
    estCompletionTimeInSec?: string;
}
export interface TradeQuoteRequestData {
    fromAsset: string;
    fromAmount: string;
    blockChain: string;
    toAsset: string;
    toBlockchain: string;
    slippage: string;
    fromAmountUSD?: string;
    destinationAddress?: string;
}
export interface GetTradeQuoteResponse {
    tradeRequestData: TradeQuoteRequestData;
    tradeResponseDataList: TradeQuoteResponseData[];
}
export interface BalanceResponse {
    [key: string]: {
        [key: string]: string;
    };
}
//# sourceMappingURL=types.d.ts.map