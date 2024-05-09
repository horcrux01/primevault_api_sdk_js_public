import { BaseAPIClient } from './baseApiClient';
export declare class APIClient extends BaseAPIClient {
    getAssetsData(): Promise<any>;
    getTransactions(page?: number, limit?: number): Promise<any>;
    getTransactionById(transactionId: string): Promise<any>;
    estimateFee(sourceId: string, destinationId: string, amount: string, asset: string, chain: string): Promise<any>;
    createTransferTransaction(sourceId: string, destinationId: string, amount: string, asset: string, chain: string, gasParams?: Record<string, any>, externalId?: string, isAutomation?: boolean, executeAt?: string): Promise<any>;
    getTradeQuote(vaultId: string, fromAsset: string, toAsset: string, fromAmount: string, fromChain: string, toChain: string, slippage: string): Promise<any>;
    createTradeTransaction(vaultId: string, tradeRequestData: Record<string, any>, tradeResponseData: Record<string, any>, externalId?: string): Promise<any>;
    getVaults(page?: number, limit?: number, reverse?: boolean): Promise<any>;
    getVaultById(vaultId: string): Promise<any>;
    createVault(data: Record<string, any>): Promise<any>;
    getBalances(vaultId: string): Promise<any>;
    updateBalances(vaultId: string): Promise<any>;
    getOperationMessageToSign(operationId: string): Promise<any>;
    updateUserAction(operationId: string, isApproved: boolean, signatureHex: string): Promise<any>;
    getContacts(page?: number, limit?: number): Promise<any>;
    getContactById(contactId: string): Promise<any>;
    createContact(name: string, address: string, chain: string, tags?: string[], externalId?: string): Promise<any>;
}
//# sourceMappingURL=apiClient.d.ts.map