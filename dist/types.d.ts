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
export interface DepositInstructions {
    type?: TransferPartyType | string;
    currency?: string;
    paymentRail?: string;
    bankDetails?: BankDetails;
    asset?: string;
    address?: string;
    chain?: string;
}
export interface TransferPartyData {
    type: TransferPartyType | string;
    id?: string;
    name?: string;
    address?: string;
    provider?: string;
    bankDetails?: BankDetails;
    chain?: string;
    paymentRail?: string;
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
export declare enum TransactionOperationType {
    DEPOSIT = "DEPOSIT",
    TRADE = "TRADE",
    TRANSFER = "TRANSFER",
    WITHDRAW = "WITHDRAW"
}
export interface EVMOutput {
    returnData?: string;
}
export interface ICPOutput {
    certificate?: string;
    contentMap?: string;
}
export type TransactionOutput = EVMOutput | ICPOutput;
export interface TransactionSourceData {
    type?: TransferPartyType | string;
    id?: string;
    name?: string;
    address?: string;
    provider?: string;
    bankDetails?: BankDetails;
    chain?: string;
    paymentRail?: string;
}
export interface TransactionOperationBalanceChange {
    party: TransferPartyData | null;
    asset: string;
    amount: string;
    chain?: string;
    paymentRail?: string;
}
export interface TransactionOperationBalanceChanges {
    changes: TransactionOperationBalanceChange[];
}
export interface TransactionOperation {
    source: TransferPartyData | null;
    destination: TransferPartyData | null;
    balanceChanges: TransactionOperationBalanceChanges | null;
    sequence: number;
    type: TransactionOperationType | string;
    provider?: string;
}
export interface Fees {
    amount: string;
    asset: string;
}
export interface QuoteResponseItem {
    quoteId: string;
    rate?: string;
    fees?: Fees;
    finalFromAmount?: string;
    finalToAmount?: string;
    sourceName?: string;
}
export interface QuoteResponse {
    quotes: QuoteResponseItem[];
}
export interface RouteAccountData {
    provider: string;
    id: string;
}
export interface TransactionIntentRequest {
    source?: TransferPartyData;
    destination?: TransferPartyData;
    routeAccounts?: RouteAccountData[];
    fromAsset?: string;
    fromAmount?: string;
    fromChain?: string;
    fromPaymentRail?: string;
    toAsset?: string;
    toAmount?: string;
    toChain?: string;
    toPaymentRail?: string;
}
export interface GetQuoteRequest {
    intent: TransactionIntentRequest;
}
export interface TransactionExecuteIntentRequest {
    intent?: TransactionIntentRequest | null;
    quoteId?: string | null;
    externalId?: string;
    memo?: string;
}
export interface Transaction {
    id: string;
    orgId: string;
    vaultId: string;
    amount: string;
    status: TransactionStatus | string;
    transactionType: TransactionType | string;
    category: TransactionCategory | string;
    subCategory: TransactionSubCategory | string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    blockChain?: string;
    toAddress?: string;
    asset?: string;
    toAddressName?: string;
    txHash?: string;
    error?: string;
    toVaultId?: string;
    externalId?: string;
    createdById?: string;
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
    dAppId?: string;
    operationId?: string;
    source?: TransactionSourceData;
    destination?: TransactionSourceData;
    intent?: TransactionIntentRequest;
    quoteResponse?: QuoteResponseItem;
    depositInstructions?: DepositInstructions;
    operations?: TransactionOperation[];
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
    templateId?: string;
    chains?: string[];
    testNetVault?: boolean;
}
export declare enum PaymentMethod {
    US_ACH = "US_ACH",
    US_WIRE = "US_WIRE",
    SEPA = "SEPA",
    SWIFT = "SWIFT",
    BANK_TRANSFER = "BANK_TRANSFER"
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
    balanceInUSD?: string;
    price?: string;
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
export interface TransactionListResponse {
    results: Transaction[];
    nextCursor?: string | null;
    hasNext?: boolean;
}
export interface VaultListResponse {
    results: Vault[];
    nextCursor?: string | null;
    hasNext?: boolean;
}
export interface ContactListResponse {
    results: Contact[];
    nextCursor?: string | null;
    hasNext?: boolean;
}
export interface BankAccountListResponse {
    results: BankAccount[];
    nextCursor?: string | null;
    hasNext?: boolean;
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
    REJECT = "reject",
    DECLINE = "reject"
}
export interface GetApprovalRequest {
    entityId: string;
    action: ApprovalAction | string;
    reason?: string | null;
}
export interface GetApprovalMessageResponse {
    approvalId: string;
    message: string;
    changeRequestId?: string;
    entityId?: string;
}
export interface ApprovalActionResponse {
    success: boolean;
    status?: string;
    id?: string;
    entityId?: string;
}
export interface WebhookEvent {
    event: "TRANSACTION_STATUS_CHANGED" | "TRANSACTION_OPERATION_STATUS_CHANGED";
    version: "2.0.0";
    eventId: string;
    data: {
        transaction?: Transaction;
        transactionOperation?: TransactionOperation;
    };
}
//# sourceMappingURL=types.d.ts.map