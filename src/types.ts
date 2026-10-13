export interface Asset {
  name: string;
  symbol: string;
  blockChain: string;
  details?: any;
}

export interface ChainData {
  value: string;
  label: string;
}

export enum TransferPartyType {
  CONTACT = "CONTACT",
  VAULT = "VAULT",
  EXTERNAL_ADDRESS = "EXTERNAL_ADDRESS",
  EXTERNAL_BANK_ACCOUNT = "EXTERNAL_BANK_ACCOUNT",
  BANK_ACCOUNT = "BANK_ACCOUNT",
}

export interface DepositInstructionBeneficiary {
  name?: string;
  // Bank account beneficiary address fields; a provider may give only some.
  address?: Partial<BankAccountBeneficiaryAddress>;
}

export interface BankDetails {
  accountName?: string;
  bankAccountInfo?: BankAccountInfo;
  beneficiary?: DepositInstructionBeneficiary;
}

export interface DepositInstructions {
  type?: TransferPartyType | string;
  paymentRail?: string;
  bankDetails?: BankDetails;
  asset?: string;
  address?: string;
  chain?: string;
  memo?: string;
}

export interface TransferPartyData {
  type: TransferPartyType | string;
  id?: string;
  name?: string;
  address?: string;
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
  asset?: string | null;
  wallets: {
    id: string;
    blockchain: string;
    address?: string;
    publicKey?: string;
  }[];
  walletsGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export enum SubOrgControlMode {
  MANAGED = "MANAGED",
  INDEPENDENT = "INDEPENDENT",
}

export interface SubOrg {
  id: string;
  orgId: string;
  name: string;
  controlMode: SubOrgControlMode | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  version: number | null;
}

export interface CreateSubOrgRequest {
  name: string;
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
  assetList?: string[];
}

export enum TransactionType {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING",
}

export enum TransactionCategory {
  TRANSFER = "TRANSFER",
  TRADE = "TRADE",
  SWAP = "SWAP",
  TOKEN_TRANSFER = "TOKEN_TRANSFER",
  TOKEN_APPROVAL = "TOKEN_APPROVAL",
  CONTRACT_CALL = "CONTRACT_CALL",
  STAKE = "STAKE",
  REVOKE_TOKEN_ALLOWANCE = "REVOKE_TOKEN_ALLOWANCE",
  RAMP = "RAMP",
  FX = "FX",
  ON_RAMP = "ON_RAMP",
  OFF_RAMP = "OFF_RAMP",
  DELEGATE_RESOURCE = "DELEGATE_RESOURCE",
}

export enum TransactionSubCategory {
  INCOMING_TRANSFER = "INCOMING_TRANSFER",
  EXTERNAL_TRANSFER = "EXTERNAL_TRANSFER",
  INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
  MARKET_TRADE = "MARKET_TRADE",
  APPROVE_TOKEN_ALLOWANCE = "APPROVE_TOKEN_ALLOWANCE",
  CUSTOM_MESSAGE = "CUSTOM_MESSAGE",
  CONTRACT_CALL = "CONTRACT_CALL",
  STAKE = "STAKE",
  UNSTAKE = "UNSTAKE",
  CLAIM = "CLAIM",
  DEPOSIT = "DEPOSIT",
  TRADE = "TRADE",
  WITHDRAW = "WITHDRAW",
  DEPOSIT_TRADE = "DEPOSIT_TRADE",
  TRADE_WITHDRAW = "TRADE_WITHDRAW",
  DEPOSIT_TRADE_WITHDRAW = "DEPOSIT_TRADE_WITHDRAW",
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
  subOrgId?: string;
  name?: string;
  address?: string;
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
  rate?: string | null;
  fees?: Fees | null;
  input?: IntentAsset;
  output?: IntentAsset;
  source?: TransferPartyData;
  destination?: TransferPartyData;
  slippage?: string | null;
  expiresAt?: string;
}

export interface QuoteResponse {
  quotes: QuoteResponseItem[];
}

export interface IntentAsset {
  asset: string;
  amount?: string | null;
  vaultId?: string;
}

export interface TransactionIntentRequest {
  // Quote requests supply exactly one of input.amount or output.amount.
  input: IntentAsset;
  output: IntentAsset;
  source?: TransferPartyData;
  destination?: TransferPartyData;
  // Crypto swaps require a percentage string, such as "1" for 1%.
  slippage?: string;
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
  // Historical swaps can have quote details without a saved quoteId.
  quoteResponse?: Partial<QuoteResponseItem>;
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
  subOrgId?: string;
  templateId?: string;
  chains?: string[];
  testNetVault?: boolean;
  vaultGroupIds?: string[];
}

export type GetVaultDepositInstructionsRequest = {
  asset: string;
} & (
  | { chain: string; paymentRail?: never }
  | { chain?: never; paymentRail: string }
);

export enum PaymentRail {
  ACH = "ACH",
  WIRE = "WIRE",
  SEPA = "SEPA",
  SWIFT = "SWIFT",
  FPS = "FPS",
  NIP = "NIP",
  PIX = "PIX",
  UAEFTS = "UAEFTS",
}

export interface CreateContactRequest {
  name: string;
  subOrgId?: string;
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

export interface BankAccountBeneficiaryAddress {
  streetLine1: string;
  streetLine2?: string | null;
  city: string;
  // state is required for US and CA addresses.
  state?: string | null;
  zip: string;
  // Two-letter ISO country code, such as GB.
  country: string;
}

export interface BusinessBeneficiaryIdentification {
  type: "COMPANY_REGISTRATION" | "LEI" | "TAX_ID";
  value: string;
  issuingCountry?: string | null;
}

export interface IndividualBeneficiaryIdentification {
  type: "PASSPORT" | "NATIONAL_ID" | "TAX_ID";
  value: string;
  issuingCountry?: string | null;
}

interface BankAccountBeneficiaryDetails {
  name?: string | null;
  address: BankAccountBeneficiaryAddress;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface BusinessBankAccountBeneficiary
  extends BankAccountBeneficiaryDetails {
  entityType: "BUSINESS";
  business: {
    legalName: string;
    registrationCountry?: string | null;
  };
  identifications?: BusinessBeneficiaryIdentification[];
}

export interface IndividualBankAccountBeneficiary
  extends BankAccountBeneficiaryDetails {
  entityType: "INDIVIDUAL";
  individual: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    // YYYY-MM-DD
    dateOfBirth?: string | null;
    // Two-letter ISO country code, such as GB.
    nationality?: string | null;
    gender?: string | null;
    occupation?: string | null;
  };
  identifications?: IndividualBeneficiaryIdentification[];
}

export type BankAccountBeneficiary =
  | BusinessBankAccountBeneficiary
  | IndividualBankAccountBeneficiary;

export interface BankAccountInfo {
  // Two-letter ISO code, such as GB; required for FPS, SEPA and SWIFT.
  country?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  pixKey?: string | null;
  pixKeyType?: string | null;
  iban?: string | null;
  bic?: string | null;
  accountType?: "CHECKING" | "SAVINGS" | null;
}

export interface BankAccount {
  id: string;
  orgId: string;
  subOrgId?: string;
  orgEntityId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  status: BankAccountStatus;
  // The PrimeVault display name; payout providers get the beneficiary's name.
  accountName: string | null;
  bankAccountInfo?: BankAccountInfo | null;
  paymentRails: string[];
  beneficiary?: BankAccountBeneficiary | null;
  currency: string | null;
  externalId: string | null;
  tags?: string[];
}

export interface TransactionListResponse {
  results: Transaction[];
  nextCursor?: string | null;
  hasNext?: boolean;
}

export interface ActivityEventMetaData {
  platform?: string | null;
  sourceIp?: string | null;
  userAgent?: string | null;
}

export interface ActivityEvent {
  id: string;
  action: string;
  outcome?: string | null;
  activityLabel?: string | null;
  createdAt?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  entityName?: string | null;
  actorId?: string | null;
  metaData?: ActivityEventMetaData | null;
  schemaVersion?: string | null;
}

export interface ActivityEventListResponse {
  results: ActivityEvent[];
  nextCursor?: string | null;
  hasNext?: boolean;
}

export interface VaultListResponse {
  results: Vault[];
  nextCursor?: string | null;
  hasNext?: boolean;
}

export interface VaultDepositInstructionsResponse {
  results: DepositInstructions[];
}

export interface SubOrgListResponse {
  results: SubOrg[];
  nextCursor: string | null;
  hasNext: boolean;
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
  subOrgId?: string;
  // The PrimeVault display name; payout providers get the beneficiary's name.
  accountName: string;
  // Which other bankAccountInfo fields are required depends on paymentRails.
  bankAccountInfo: BankAccountInfo;
  paymentRails: string[];
  beneficiary?: BankAccountBeneficiary;
  // Three-letter uppercase ISO 4217 code, such as GBP.
  currency: string;
  externalId?: string;
  tags?: string[];
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
