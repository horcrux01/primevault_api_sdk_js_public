import { BaseAPIClient } from "./baseApiClient";
import { ApprovalAction, ApprovalActionResponse, Asset, BalanceResponse, BankAccount, BankAccountListResponse, ChainData, Contact, CreateBankAccountRequest, CreateContactRequest, CreateContractCallTransactionRequest, CreateTradeTransactionRequest, CreateTransferTransactionRequest, CreateVaultRequest, EstimatedFeeResponse, EstimateFeeRequest, GetTradeQuoteResponse, RampQuoteRequest, RampQuoteResponse, ReplaceTransactionRequest, TradeQuoteRequest, Transaction, Vault, DetailedBalanceResponse, CreateOnRampTransactionRequest, CreateOffRampTransactionRequest, DelegateResourceRequest, StakeResourceRequest } from "./types";
export declare class APIClient extends BaseAPIClient {
    getAssetsData(): Promise<Asset[]>;
    getSupportedChains(): Promise<ChainData[]>;
    getTransactions(params?: Record<string, string>, page?: number, limit?: number): Promise<Transaction[]>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    estimateFee(request: EstimateFeeRequest): Promise<EstimatedFeeResponse>;
    createTransferTransaction(request: CreateTransferTransactionRequest): Promise<Transaction>;
    createContractCallTransaction(request: CreateContractCallTransactionRequest): Promise<Transaction>;
    replaceTransaction(request: ReplaceTransactionRequest): Promise<any>;
    getTradeQuote(request: TradeQuoteRequest): Promise<GetTradeQuoteResponse>;
    getRampQuote(request: RampQuoteRequest): Promise<RampQuoteResponse>;
    createTradeTransaction(request: CreateTradeTransactionRequest): Promise<Transaction>;
    createOnRampTransaction(request: CreateOnRampTransactionRequest): Promise<Transaction>;
    createOffRampTransaction(request: CreateOffRampTransactionRequest): Promise<Transaction>;
    getVaults(params?: Record<string, string>, page?: number, limit?: number, reverse?: boolean): Promise<Vault[]>;
    getVaultById(vaultId: string): Promise<Vault>;
    createVault(data: CreateVaultRequest): Promise<Vault>;
    getBalances(vaultId: string): Promise<BalanceResponse>;
    getDetailedBalances(vaultId: string): Promise<DetailedBalanceResponse>;
    updateBalances(vaultId: string): Promise<BalanceResponse>;
    getOperationMessageToSign(operationId: string): Promise<any>;
    updateUserAction(operationId: string, isApproved: boolean, signatureHex: string): Promise<any>;
    getContacts(params?: Record<string, string>, page?: number, limit?: number): Promise<Contact[]>;
    getContactById(contactId: string): Promise<Contact>;
    createContact(request: CreateContactRequest): Promise<Contact>;
    delegateResource(request: DelegateResourceRequest): Promise<Transaction>;
    stakeResource(request: StakeResourceRequest): Promise<Transaction>;
    getBankAccounts(params?: Record<string, string>, page?: number, limit?: number): Promise<BankAccountListResponse>;
    getBankAccountById(bankAccountId: string): Promise<BankAccount>;
    createBankAccount(request: CreateBankAccountRequest): Promise<BankAccount>;
    approveBankAccount(entityId: string, action?: ApprovalAction): Promise<ApprovalActionResponse>;
}
//# sourceMappingURL=apiClient.d.ts.map