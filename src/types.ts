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

export enum VaultType {
  EXCHANGE = "EXCHANGE",
  DEFAULT = "DEFAULT",
  GAS = "GAS",
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

export enum ContactStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
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
  toVaultId?: string;                // if the transaction is a transfer from one vault to another
  externalId?: string;               // set by the external system
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
  txnSignature?: string;                  // Hex encoded signature of the transaction
  txnSignatureData?: Record<string, any>; // Signature data
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
  data?: ContractCallData
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

export enum PaymentMethod {
  US_ACH = "US_ACH",
  US_WIRE = "US_WIRE",
  SEPA = "SEPA",
  SWIFT = "SWIFT",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface RampQuoteRequest {
  source?: TransferPartyData;         // Source of the ramp. In case of on-ramp, this is the fiat source and in case of off-ramp, this is the source of the crypto currency.
  destination?: TransferPartyData;    // Destination of the ramp. In case of on-ramp, this is the crypto destination and in case of off-ramp, this is the fiat destination.
  fromAsset: string;                  // Asset to be converted from.
  fromChain?: string;                 // Chain of the asset to be converted from.
  fromAmount: string;                 // Amount to be converted from.
  toAsset: string;                    // Asset to be converted to.
  toChain?: string;                   // Chain of the asset to be converted to.
  category: TransactionCategory.ON_RAMP | TransactionCategory.OFF_RAMP; // Category of the ramp.
  paymentMethod?: PaymentMethod;      // Payment method to be used for the ramp.
}

export interface RampQuoteResponseItem {
  finalToAmount: string;              // Final amount to be received after conversion.
  quoteId: string;                    // Unique identifier for the quote.
  fees: RampExchangeRateFees;         // Fees charged for the ramp transaction.
  quoteResponseDict: Record<string, any>; // Raw quote response data from the ramp provider.
  sourceName: string;                 // Name of the ramp provider source.
}

export interface RampQuoteResponse {
  quotes: RampQuoteResponseItem[];    // List of available ramp quotes.
}

export interface CreateOnRampTransactionRequest {
  destination: TransferPartyData;     // Destination vault for the on-ramp crypto delivery.
  rampRequestData: RampQuoteRequest;  // The ramp quote request data used to generate the quote.
  rampResponseData: RampQuoteResponseItem; // The selected ramp quote from the list.
  externalId?: string;                // Optional external identifier set by the calling system.
  memo?: string;                      // Optional memo for the transaction.
}

export interface CreateOffRampTransactionRequest {
  source: TransferPartyData;          // Source vault for the off-ramp crypto withdrawal.
  destination: TransferPartyData;     // Destination for the off-ramp fiat delivery.
  rampRequestData: RampQuoteRequest;  // The ramp quote request data used to generate the quote.
  rampResponseData: RampQuoteResponseItem; // The selected ramp quote from the list.
  externalId?: string;                // Optional external identifier set by the calling system.
  memo?: string;                      // Optional memo for the transaction.
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

export type DetailedBalanceResponse  = DetailedBalance[];

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

// ── Change-request approvals ───────────────────────────────────────────

export enum ApprovalAction {
  APPROVE = "approve",
  DECLINE = "decline",
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
