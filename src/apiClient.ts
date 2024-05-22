import { BaseAPIClient } from "./baseApiClient";
import { Asset, Contact, Transaction, Vault } from "./types";

export class APIClient extends BaseAPIClient {
  async getAssetsData(): Promise<Asset[]> {
    return await this.get("/api/external/assets/");
  }

  async getTransactions(
    params: Record<string, string> = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<Transaction[]> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/transactions/?limit=${limit}&page=${page}`;
    if (query) {
      url += `&${query}`;
    }
    const transactionsResponse = await this.get(url);
    return transactionsResponse.results;
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    return await this.get(`/api/external/transactions/${transactionId}/`);
  }

  async estimateFee(
    sourceId: string,
    destinationId: string,
    amount: string,
    asset: string,
    chain: string,
  ) {
    const data = {
      sourceId,
      destinationId,
      amount,
      asset,
      blockChain: chain,
      category: "TRANSFER",
    };
    return await this.post("/api/external/transactions/estimate_fee/", data);
  }

  async createTransferTransaction(
    sourceId: string,
    destinationId: string,
    amount: string,
    asset: string,
    chain: string,
    gasParams: Record<string, any> = {},
    externalId?: string,
    isAutomation: boolean = false,
    executeAt?: string,
  ): Promise<Transaction> {
    const data = {
      sourceId,
      destinationId,
      amount: String(amount),
      asset,
      blockChain: chain,
      category: "TRANSFER",
      gasParams,
      externalId,
      isAutomation,
      executeAt,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async createContractCallTransaction(
    vaultId: string,
    blockChain: string,
    messageHex: string,
    toAddress?: string,
    amount?: string,
    externalId?: string,
  ): Promise<Transaction> {
    const data = {
      vaultId,
      blockChain,
      messageHex,
      toAddress,
      amount,
      externalId,
      category: "CONTRACT_CALL",
    };
    return await this.post("/api/external/transactions/", data);
  }

  async getTradeQuote(
    vaultId: string,
    fromAsset: string,
    toAsset: string,
    fromAmount: string,
    fromChain: string,
    toChain: string,
    slippage: string,
  ) {
    const params = {
      vaultId,
      fromAsset,
      toAsset,
      fromAmount,
      blockChain: fromChain,
      toBlockchain: toChain,
      slippage,
    };
    return await this.get("/api/external/transactions/trade_quote/", params);
  }

  async createTradeTransaction(
    vaultId: string,
    tradeRequestData: Record<string, any>,
    tradeResponseData: Record<string, any>,
    externalId?: string,
  ) {
    const data = {
      vaultId,
      tradeRequestData,
      tradeResponseData,
      category: "SWAP",
      blockChain: tradeRequestData["blockChain"],
      externalId,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async getVaults(
    params: Record<string, string> = {},
    page: number = 1,
    limit: number = 20,
    reverse: boolean = false,
  ): Promise<Vault[]> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/vaults/?limit=${limit}&page=${page}&reverse=${reverse}`;
    if (query) {
      url += `&${query}`;
    }
    const vaultsResponse = await this.get(url);
    return vaultsResponse.results;
  }

  async getVaultById(vaultId: string): Promise<Vault> {
    return await this.get(`/api/external/vaults/${vaultId}/`);
  }

  async createVault(data: Record<string, any>): Promise<Vault> {
    return await this.post("/api/external/vaults/", data);
  }

  async getBalances(vaultId: string) {
    return await this.get(`/api/external/vaults/${vaultId}/balances/`);
  }

  async updateBalances(vaultId: string) {
    return await this.post(`/api/external/vaults/${vaultId}/update_balances/`);
  }

  async getOperationMessageToSign(operationId: string) {
    return await this.get(
      `/api/external/operations/${operationId}/operation_message_to_sign/`,
    );
  }

  async updateUserAction(
    operationId: string,
    isApproved: boolean,
    signatureHex: string,
  ) {
    const data = {
      isApproved,
      signatureHex,
      operationId,
    };
    return await this.post(
      `/api/external/operations/${operationId}/update_user_action/`,
      data,
    );
  }

  async getContacts(
    params: Record<string, string> = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<Contact[]> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/contacts/?limit=${limit}&page=${page}`;
    if (query) {
      url += `&${query}`;
    }
    const contactsResponse = await this.get(url);
    return contactsResponse.results;
  }

  async getContactById(contactId: string): Promise<Contact> {
    return await this.get(`/api/external/contacts/${contactId}/`);
  }

  async createContact(
    name: string,
    address: string,
    chain: string,
    tags?: string[],
    externalId?: string,
  ) {
    const data = {
      name,
      address,
      blockChain: chain,
      tags,
      externalId,
    };
    return await this.post("/api/external/contacts/", data);
  }
}
