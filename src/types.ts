import exp from "node:constants";

export interface Asset {
  asset: string;
  symbol: string;
  assetType: string;
  blockChain: string;
  logoURL: number;
  details: any;
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
}

export enum TransactionType {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING",
}

export enum TransactionCategory {
  TRANSFER = "TRANSFER",
  SWAP = "SWAP",
}

export enum TransactionSubCategory {
  INCOMING_TRANSFER = "INCOMING_TRANSFER",
  EXTERNAL_TRANSFER = "EXTERNAL_TRANSFER",
  INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
  LIMIT_TRADE = "LIMIT_TRADE",
  MARKET_TRADE = "MARKET_TRADE",
  APPROVE_TOKEN_ALLOWANCE = "APPROVE_TOKEN_ALLOWANCE",
}

export enum TransactionStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  "APPROVED" = "APPROVED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  DECLINED = "DECLINED",
  SUBMITTED = "SUBMITTED",
  WAITING_CONFIRMATION = "WAITING_CONFIRMATION",
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
  toVaultId?: string; // if the transaction is a transfer from one vault to another
  externalId?: string; // set by the external system
  transactionType: TransactionType;
  category: TransactionCategory;
  subCategory: TransactionSubCategory;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  createdById: string;
}

export interface CreateTransferTransactionRequest {
  sourceId: string;
  destinationId: string;
  amount: string;
  asset: string;
  chain: string;
  gasParams?: Record<string, any>;
  externalId?: string;
  isAutomation?: boolean;
  executeAt?: string;
}

export interface CreateContractCallTransactionRequest {
  vaultId: string;
  chain: string;
  messageHex: string;
  toAddress?: string;
  amount?: string;
  externalId?: string;
}

export interface EstimateFeeRequest {
  sourceId: string;
  destinationId: string;
  amount: string;
  asset: string;
  chain: string;
}

export interface CreateVaultRequest {
  vaultName: string;
  defaultTransferSpendLimit: Record<string, any>;
  defaultTradeSpendLimit: Record<string, any>;
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
  blockChain: string; // fromChain
  toAsset: string;
  toBlockchain: string; // toChain
  slippage: string;
  fromAmountUSD?: string;
  destinationAddress?: string;
}

export interface GetTradeQuoteResponse {
  tradeRequestData: TradeQuoteRequestData;
  tradeResponseDataList: TradeQuoteResponseData[];
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
