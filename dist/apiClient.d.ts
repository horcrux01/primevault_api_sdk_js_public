import { BaseAPIClient } from "./baseApiClient";
import { Asset, Contact, Transaction, Vault } from "./types";
export declare class APIClient extends BaseAPIClient {
    getAssetsData(): Promise<Asset[]>;
    getTransactions(params?: Record<string, string>, page?: number, limit?: number): Promise<Transaction[]>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    estimateFee(sourceId: string, destinationId: string, amount: string, asset: string, chain: string): Promise<any>;
    createTransferTransaction(sourceId: string, destinationId: string, amount: string, asset: string, chain: string, gasParams?: Record<string, any>, externalId?: string, isAutomation?: boolean, executeAt?: string): Promise<Transaction>;
    createContractCallTransaction(vaultId: string, blockChain: string, messageHex: string, toAddress?: string, amount?: string, externalId?: string): Promise<Transaction>;
    getTradeQuote(vaultId: string, fromAsset: string, toAsset: string, fromAmount: string, fromChain: string, toChain: string, slippage: string): Promise<any>;
    createTradeTransaction(vaultId: string, tradeRequestData: Record<string, any>, tradeResponseData: Record<string, any>, externalId?: string): Promise<any>;
    getVaults(params?: Record<string, string>, page?: number, limit?: number, reverse?: boolean): Promise<Vault[]>;
    getVaultById(vaultId: string): Promise<Vault>;
    createVault(data: Record<string, any>): Promise<Vault>;
    getBalances(vaultId: string): Promise<any>;
    updateBalances(vaultId: string): Promise<any>;
    getOperationMessageToSign(operationId: string): Promise<any>;
    updateUserAction(operationId: string, isApproved: boolean, signatureHex: string): Promise<any>;
    getContacts(params?: Record<string, string>, page?: number, limit?: number): Promise<Contact[]>;
    getContactById(contactId: string): Promise<Contact>;
    createContact(name: string, address: string, chain: string, tags?: string[], externalId?: string): Promise<any>;
}
//# sourceMappingURL=apiClient.d.ts.map