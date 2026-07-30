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

export enum TransferPartyType {
  CONTACT = "CONTACT",
  VAULT = "VAULT",
  EXTERNAL_ADDRESS = "EXTERNAL_ADDRESS",
  EXTERNAL_BANK_ACCOUNT = "EXTERNAL_BANK_ACCOUNT",
  BANK_ACCOUNT = "BANK_ACCOUNT",
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
  country?: string;
}

export interface DepositInstructions {
  type?: TransferPartyType | string;
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

export enum VaultType {
  EXCHANGE = "EXCHANGE",
  DEFAULT = "DEFAULT",
  GAS = "GAS",
}

export interface Vault {
  id: string;
  orgId: string;
  subOrgId?: string;
  vaultName: string;
  vaultType: VaultType;
  wallets: {
    id: string;
    blockchain: string;
    address?: string;
    publicKey?: string;
  }[];
  signers?: {
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

export enum ContactStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export interface Contact {
  id: string;
  orgId: string;
  subOrgId?: string;
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

export enum TransactionType {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING",
}

export enum TransactionCategory {
  TRANSFER = "TRANSFER",
  SWAP = "SWAP",
  TOKEN_TRANSFER = "TOKEN_TRANSFER",
  TOKEN_APPROVAL = "TOKEN_APPROVAL",
  CONTRACT_CALL = "CONTRACT_CALL",
  STAKE = "STAKE",
  REVOKE_TOKEN_ALLOWANCE = "REVOKE_TOKEN_ALLOWANCE",
  ON_RAMP = "ON_RAMP",
  OFF_RAMP = "OFF_RAMP",
  DELEGATE_RESOURCE = "DELEGATE_RESOURCE",
}

export enum TransactionSubCategory {
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
  OFF_RAMP = "OFF_RAMP",
}

export enum TransactionStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  DECLINED = "DECLINED",
  SUBMITTED = "SUBMITTED",
  SIGNED = "SIGNED",
  WAITING_CONFIRMATION = "WAITING_CONFIRMATION",
}

export enum TransactionFeeTier {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum TransactionOperationType {
  DEPOSIT = "DEPOSIT",
  TRADE = "TRADE",
  TRANSFER = "TRANSFER",
  WITHDRAW = "WITHDRAW",
}

export enum TransactionOperationStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
  CANCELLED = "CANCELLED",
  REVERSED = "REVERSED",
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
  status: TransactionOperationStatus | string;
  provider?: string;
}

export interface Fees {
  amount: string;
  asset: string;
  amountInFiat?: string;
}

export interface QuoteResponseItem {
  quoteId: string;
  subOrgId?: string;
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
  subOrgId?: string;
}

export interface TransactionExecuteIntentRequest {
  intent?: TransactionIntentRequest | null;
  quoteId?: string | null;
  externalId?: string;
  memo?: string;
  subOrgId?: string;
}

export interface Transaction {
  id: string;
  orgId: string;
  vaultId: string;
  status: TransactionStatus | string;
  transactionType: TransactionType | string;
  category: TransactionCategory | string;
  subCategory: TransactionSubCategory | string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  txHash?: string;
  error?: string;
  externalId?: string; // set by the external system
  createdById?: string;
  fees?: Fees;
  memo?: string;
  txnSignature?: string; // Hex encoded signature of the transaction
  txnSignatureData?: Record<string, any>; // Signature data
  output?: TransactionOutput;
  amountInUSD?: string;
  nonce?: number;
  dAppId?: string;
  source?: TransactionSourceData;
  destination?: TransactionSourceData;
  intent?: TransactionIntentRequest;
  quoteResponse?: QuoteResponseItem;
  depositInstructions?: DepositInstructions;
  operations?: TransactionOperation[];
  balanceChanges?: TransactionOperationBalanceChanges | null;
  blockChain?: string;  
  toAddress?: string; // deprecated, use destination.address instead
  asset?: string;  
  toAddressName?: string;  // deprecated, use destination.name instead
  toVaultId?: string;  // deprecated, use destination.id instead
  amount: string;
  sourceAddress?: string; // deprecated, use source.address instead
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

export type ContractCallData =
  | EVMContractCallData
  | ICPCanisterCallData
  | RawSigningData
  | AlephiumContractCallData;

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
  vaultGroupIds?: string[];
}

export enum PaymentMethod {
  US_ACH = "US_ACH",
  US_WIRE = "US_WIRE",
  SEPA = "SEPA",
  SWIFT = "SWIFT",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface CreateContactRequest {
  name: string;
  address: string;
  chain: string;
  tags?: string[];
  externalId?: string;
  assetList?: string[];
  contactGroupIds?: string[];
}

export interface UpdateContactRequest {
  id: string;
  assetList?: string[];
  contactGroupIds?: string[];
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

/*
 asset: {chain: balance}
 Example:
    {
    "ETH": {
        "ETHEREUM": "1.00000000"
    },
    "USDC": {
        "POLYGON": "1.00000000"
        "ETHEREUM": "1.00000000"
        "ARBITRUM": "1.00000000"
    }
*/
export interface BalanceResponse {
  [key: string]: { [key: string]: string };
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

export enum ResourceType {
  TRON_ENERGY = "TRON_ENERGY",
  TRON_BANDWIDTH = "TRON_BANDWIDTH",
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

// ── Bank Accounts ──────────────────────────────────────────────────────

export enum BankAccountStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
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
  streetLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// ── Change-request approvals ───────────────────────────────────────────

export enum ApprovalAction {
  APPROVE = "approve",
  REJECT = "reject",
  DECLINE = "reject",
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

// ── Webhooks ───────────────────────────────────────────────────────────

export interface WebhookEvent {
  event:
    | "TRANSACTION_STATUS_CHANGED"
    | "TRANSACTION_OPERATION_STATUS_CHANGED";
  version: "2.0.0";
  eventId: string;
  data: {
    transaction?: Transaction;
    transactionOperation?: TransactionOperation;
  };
}
