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
    EXTERNAL_ADDRESS = "EXTERNAL_ADDRESS",
    EXTERNAL_BANK_ACCOUNT = "EXTERNAL_BANK_ACCOUNT",
    BANK_ACCOUNT = "BANK_ACCOUNT"
}
export interface BankDetails {
    bankAccountId?: string;
    bankName?: string;
    beneficiaryName?: string;
    accountName?: string;
    accountNumber?: string;
    accountNumberMasked?: string;
    routingNumber?: string;
    paymentRail?: string;
    bankAddress?: string;
    swiftCode?: string;
    swiftBic?: string;
    iban?: string;
    currency?: string;
    country?: string;
}
export interface TransferPartyData {
    type: TransferPartyType;
    id?: string;
    value?: string;
    name?: string;
    address?: string;
    exchange?: string;
    bank?: BankDetails;
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
        publicKey?: string;
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
    assetList?: string[];
}
export declare enum TransactionType {
    INCOMING = "INCOMING",
    OUTGOING = "OUTGOING"
}
export declare enum TransactionCategory {
    TRANSFER = "TRANSFER",
    SWAP = "SWAP",
    TOKEN_TRANSFER = "TOKEN_TRANSFER",
    TOKEN_APPROVAL = "TOKEN_APPROVAL",
    CONTRACT_CALL = "CONTRACT_CALL",
    STAKE = "STAKE",
    REVOKE_TOKEN_ALLOWANCE = "REVOKE_TOKEN_ALLOWANCE",
    ON_RAMP = "ON_RAMP",
    OFF_RAMP = "OFF_RAMP",
    DELEGATE_RESOURCE = "DELEGATE_RESOURCE"
}
export declare enum TransactionSubCategory {
    INCOMING_TRANSFER = "INCOMING_TRANSFER",
    EXTERNAL_TRANSFER = "EXTERNAL_TRANSFER",
    INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
    LIMIT_TRADE = "LIMIT_TRADE",
    MARKET_TRADE = "MARKET_TRADE",
    APPROVE_TOKEN_ALLOWANCE = "APPROVE_TOKEN_ALLOWANCE",
    CUSTOM_MESSAGE = "CUSTOM_MESSAGE",
    CONTRACT_CALL = "CONTRACT_CALL",
    STAKE = "STAKE",
    UNSTAKE = "UNSTAKE",
    CLAIM = "CLAIM",
    ON_RAMP = "ON_RAMP",
    OFF_RAMP = "OFF_RAMP"
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
    source?: TransferPartyData;
    destination?: TransferPartyData;
    rampRequestData?: RampQuoteRequest;
    rampResponseData?: RampQuoteResponseItem;
}
export interface TransactionCreationGasParams {
    feeTier?: TransactionFeeTier;
}
export interface TransactionCreationOptions {
    skipPreprocessSimulation?: boolean;
}
export interface FeePayer {
    id: string;
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
    feePayer?: FeePayer;
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
export interface AlephiumContractCallData {
    method: string;
    params: Record<string, any>;
}
export type ContractCallData = EVMContractCallData | ICPCanisterCallData | RawSigningData | AlephiumContractCallData;
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
    testNetVault?: boolean;
}
export interface TradeQuoteRequest {
    vaultId: string;
    fromAsset: string;
    fromAmount: string;
    toAsset: string;
    category?: string;
    paymentMethod?: string;
    fromChain?: string;
    toChain?: string;
    slippage?: string;
    expectedToAmount?: string;
    expiryInMinutes?: number;
}
export interface CreateTradeTransactionRequest {
    vaultId: string;
    tradeRequestData: Record<string, any>;
    tradeResponseData: Record<string, any>;
    externalId?: string;
    memo?: string;
}
export declare enum PaymentMethod {
    US_ACH = "US_ACH",
    US_WIRE = "US_WIRE",
    SEPA = "SEPA",
    SWIFT = "SWIFT",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export interface RampQuoteRequest {
    source?: TransferPartyData;
    destination?: TransferPartyData;
    fromAsset: string;
    fromChain?: string;
    fromAmount: string;
    toAsset: string;
    toChain?: string;
    category: TransactionCategory.ON_RAMP | TransactionCategory.OFF_RAMP;
}
export interface RampQuoteResponseItem {
    finalToAmount: string;
    quoteId: string;
    fees: RampExchangeRateFees;
    quoteResponseDict: Record<string, any>;
    sourceName: string;
    rate?: string;
}
export interface RampQuoteResponse {
    quotes: RampQuoteResponseItem[];
}
export interface CreateOnRampTransactionRequest {
    destination: TransferPartyData;
    quoteId: string;
    externalId?: string;
    memo?: string;
}
export interface CreateOffRampTransactionRequest {
    source: TransferPartyData;
    destination: TransferPartyData;
    quoteId: string;
    externalId?: string;
    memo?: string;
}
export interface CreateContactRequest {
    name: string;
    address: string;
    chain: string;
    tags?: string[];
    externalId?: string;
    assetList?: string[];
}
export interface UpdateContactRequest {
    id: string;
    assetList?: string[];
}
export interface UpdateContactResponse {
    id: string;
    name: string;
    address: string;
    blockChain: string;
    tags?: string[];
    externalId?: string;
    assetList?: string[];
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
export interface TradeQuoteFee {
    amount?: string;
    asset?: string;
}
export interface TradeQuoteResponseData {
    finalToAmount: string;
    quoteResponseDict?: string | Record<string, any>;
    handler?: string;
    sourceName?: string;
    handlerCategory?: string;
    unitToAssetAmount?: string;
    approvedFinalToAmount?: string;
    quotesValidTill?: string;
    feeInUSD?: string;
    finalToAmountUSD?: string;
    stepsData?: any[];
    sourceLogoURL?: string;
    estCompletionTimeInSec?: number;
    autoSlippage?: string;
    minimumToAmount?: string;
    fees?: TradeQuoteFee;
    quoteId?: string;
    fromAmount?: string;
    paymentMethod?: string;
}
export interface TradeQuoteRequestData {
    fromAsset: string;
    fromAmount: string;
    toAsset: string;
    slippage?: string;
    blockChain?: string;
    toBlockchain?: string;
    fromAmountUSD?: string;
    destinationAddress?: string;
    chainId?: string;
    fromAssetLogoURL?: string;
    toAssetLogoURL?: string;
    expectedToAmountUSD?: string;
    expiryInMinutes?: number;
}
export interface GetTradeQuoteResponse {
    tradeRequestData: TradeQuoteRequestData;
    tradeResponseDataList: TradeQuoteResponseData[];
}
export interface RampExchangeRatesRequest {
    amount: string;
    currency: string;
    asset: string;
    category: string;
    blockChain: string;
    vaultId: string;
    paymentMethod?: string;
}
export interface RampExchangeRateFees {
    amount: string;
    asset: string;
}
export interface RampExchangeRateQuote {
    quoteId: string;
    convertedAmount: string;
    fees: RampExchangeRateFees;
    source: string;
}
export type RampExchangeRatesResponse = RampExchangeRateQuote[];
export interface BalanceResponse {
    [key: string]: {
        [key: string]: string;
    };
}
export interface DetailedBalance {
    symbol: string;
    balance: string;
    name?: string;
    chain?: string;
    tokenAddress?: string;
}
export type DetailedBalanceResponse = DetailedBalance[];
export declare enum ResourceType {
    TRON_ENERGY = "TRON_ENERGY",
    TRON_BANDWIDTH = "TRON_BANDWIDTH"
}
export interface DelegateResourceRequest {
    source: TransferPartyData;
    destination: TransferPartyData;
    asset: string;
    chain: string;
    amount: string;
    resourceType: ResourceType;
    externalId?: string;
    memo?: string;
}
export interface StakeResourceRequest {
    source: TransferPartyData;
    asset: string;
    chain: string;
    amount: string;
    resourceType?: ResourceType;
    externalId?: string;
    memo?: string;
}
export declare enum BankAccountStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED"
}
export interface BankAccount {
    id: string;
    orgId: string;
    orgEntityId: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    status: BankAccountStatus;
    accountNumber?: string;
    accountName?: string;
    routingNumber?: string;
    clientBankAccountId?: string;
    paymentMethod?: string;
    bankName?: string;
    currency?: string;
    streetLine?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}
export interface BankAccountListResponse {
    results: BankAccount[];
    count: number;
    previous?: string;
    next?: string;
}
export interface CreateBankAccountRequest {
    accountNumber?: string;
    accountName?: string;
    routingNumber?: string;
    clientBankAccountId?: string;
    paymentMethod?: string;
    bankName?: string;
    currency?: string;
    streetLine?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}
export declare enum ApprovalAction {
    APPROVE = "approve",
    DECLINE = "decline"
}
export interface GetApprovalMessageResponse {
    approvalId: string;
    changeRequestId: string;
    entityId: string;
    message: string;
}
export interface ApprovalActionResponse {
    success: boolean;
    status: string;
    id: string;
    entityId: string;
}
//# sourceMappingURL=types.d.ts.map