import { BaseAPIClient } from "./baseApiClient";
import {
  Asset,
  BalanceResponse,
  Contact,
  CreateContactRequest,
  CreateContractCallTransactionRequest,
  CreateTradeTransactionRequest,
  CreateTransferTransactionRequest,
  CreateVaultRequest,
  EstimatedFeeResponse,
  EstimateFeeRequest,
  GetTradeQuoteResponse,
  TradeQuoteRequest,
  Transaction,
  Vault,
} from "./types";

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
    request: EstimateFeeRequest,
  ): Promise<EstimatedFeeResponse> {
    const data = {
      sourceId: request.sourceId,
      destinationId: request.destinationId,
      amount: request.amount,
      asset: request.asset,
      blockChain: request.chain,
      category: "TRANSFER",
    };
    return await this.post("/api/external/transactions/estimate_fee/", data);
  }

  async createTransferTransaction(
    request: CreateTransferTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      sourceId: request.sourceId,
      destinationId: request.destinationId,
      amount: request.amount,
      asset: request.asset,
      blockChain: request.chain,
      category: "TRANSFER",
      gasParams: request.gasParams,
      externalId: request.externalId,
      isAutomation: request.isAutomation,
      executeAt: request.executeAt,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async createContractCallTransaction(
    request: CreateContractCallTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      vaultId: request.vaultId,
      blockChain: request.chain,
      messageHex: request.messageHex,
      toAddress: request.toAddress,
      amount: request.amount,
      externalId: request.externalId,
      category: "CONTRACT_CALL",
    };
    return await this.post("/api/external/transactions/", data);
  }

  async getTradeQuote(
    request: TradeQuoteRequest,
  ): Promise<GetTradeQuoteResponse> {
    const params = {
      vaultId: request.vaultId,
      fromAsset: request.fromAsset,
      toAsset: request.toAsset,
      fromAmount: request.fromAmount,
      blockChain: request.fromChain,
      toBlockchain: request.toChain,
      slippage: request.slippage,
    };
    return await this.get("/api/external/transactions/trade_quote/", params);
  }

  async createTradeTransaction(
    request: CreateTradeTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      vaultId: request.vaultId,
      tradeRequestData: request.tradeRequestData,
      tradeResponseData: request.tradeResponseData,
      category: "SWAP",
      blockChain: request.tradeRequestData.blockChain,
      externalId: request.externalId,
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

  async createVault(data: CreateVaultRequest): Promise<Vault> {
    return await this.post("/api/external/vaults/", data);
  }

  async getBalances(vaultId: string): Promise<BalanceResponse> {
    return await this.get(`/api/external/vaults/${vaultId}/balances/`);
  }

  async updateBalances(vaultId: string): Promise<BalanceResponse> {
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

  async createContact(request: CreateContactRequest): Promise<Contact> {
    const data = {
      name: request.name,
      address: request.address,
      blockChain: request.chain,
      tags: request.tags,
      externalId: request.externalId,
    };
    return await this.post("/api/external/contacts/", data);
  }
}
