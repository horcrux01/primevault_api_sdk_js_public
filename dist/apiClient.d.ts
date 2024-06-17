import { BaseAPIClient } from "./baseApiClient";
import { Asset, Contact, CreateContractCallTransactionRequest, CreateTransactionRequest, CreateVaultRequest, EstimateFeeRequest, Transaction, Vault } from "./types";
export declare class APIClient extends BaseAPIClient {
    getAssetsData(): Promise<Asset[]>;
    getTransactions(params?: Record<string, string>, page?: number, limit?: number): Promise<Transaction[]>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    estimateFee(request: EstimateFeeRequest): Promise<any>;
    createTransferTransaction(request: CreateTransactionRequest): Promise<Transaction>;
    createContractCallTransaction(request: CreateContractCallTransactionRequest): Promise<Transaction>;
    getTradeQuote(vaultId: string, fromAsset: string, toAsset: string, fromAmount: string, fromChain: string, toChain: string, slippage: string): Promise<any>;
    createTradeTransaction(vaultId: string, tradeRequestData: Record<string, any>, tradeResponseData: Record<string, any>, externalId?: string): Promise<any>;
    getVaults(params?: Record<string, string>, page?: number, limit?: number, reverse?: boolean): Promise<Vault[]>;
    getVaultById(vaultId: string): Promise<Vault>;
    createVault(data: CreateVaultRequest): Promise<Vault>;
    getBalances(vaultId: string): Promise<any>;
    updateBalances(vaultId: string): Promise<any>;
    getOperationMessageToSign(operationId: string): Promise<any>;
    updateUserAction(operationId: string, isApproved: boolean, signatureHex: string): Promise<any>;
    getContacts(params?: Record<string, string>, page?: number, limit?: number): Promise<Contact[]>;
    getContactById(contactId: string): Promise<Contact>;
    createContact(name: string, address: string, chain: string, tags?: string[], externalId?: string): Promise<any>;
}
//# sourceMappingURL=apiClient.d.ts.map