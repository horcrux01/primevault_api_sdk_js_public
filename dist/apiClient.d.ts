import { BaseAPIClient } from "./baseApiClient";
import { Asset, BalanceResponse, Contact, CreateContactRequest, CreateContractCallTransactionRequest, CreateTradeTransactionRequest, CreateTransferTransactionRequest, CreateVaultRequest, EstimatedFeeResponse, EstimateFeeRequest, GetTradeQuoteResponse, TradeQuoteRequest, Transaction, Vault } from "./types";
export declare class APIClient extends BaseAPIClient {
    getAssetsData(): Promise<Asset[]>;
    getTransactions(params?: Record<string, string>, page?: number, limit?: number): Promise<Transaction[]>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    estimateFee(request: EstimateFeeRequest): Promise<EstimatedFeeResponse>;
    createTransferTransaction(request: CreateTransferTransactionRequest): Promise<Transaction>;
    createContractCallTransaction(request: CreateContractCallTransactionRequest): Promise<Transaction>;
    getTradeQuote(request: TradeQuoteRequest): Promise<GetTradeQuoteResponse>;
    createTradeTransaction(request: CreateTradeTransactionRequest): Promise<Transaction>;
    getVaults(params?: Record<string, string>, page?: number, limit?: number, reverse?: boolean): Promise<Vault[]>;
    getVaultById(vaultId: string): Promise<Vault>;
    createVault(data: CreateVaultRequest): Promise<Vault>;
    getBalances(vaultId: string): Promise<BalanceResponse>;
    updateBalances(vaultId: string): Promise<BalanceResponse>;
    getOperationMessageToSign(operationId: string): Promise<any>;
    updateUserAction(operationId: string, isApproved: boolean, signatureHex: string): Promise<any>;
    getContacts(params?: Record<string, string>, page?: number, limit?: number): Promise<Contact[]>;
    getContactById(contactId: string): Promise<Contact>;
    createContact(request: CreateContactRequest): Promise<Contact>;
}
//# sourceMappingURL=apiClient.d.ts.map