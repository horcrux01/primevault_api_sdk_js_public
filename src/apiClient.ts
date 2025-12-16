import { BaseAPIClient } from "./baseApiClient";
import {
  Asset,
  BalanceResponse, ChainData,
  Contact,
  CreateContactRequest,
  CreateContractCallTransactionRequest,
  CreateTradeTransactionRequest,
  CreateTransferTransactionRequest,
  CreateVaultRequest,
  EstimatedFeeResponse,
  EstimateFeeRequest,
  GetTradeQuoteResponse, ReplaceTransactionRequest,
  RampExchangeRatesRequest,
  RampExchangeRatesResponse,
  TradeQuoteRequest,
  Transaction,
  Vault,
  DetailedBalanceResponse,
  CreateOnRampTransactionRequest,
  CreateOffRampTransactionRequest,
  TransactionCategory,
  DelegateResourceRequest,
  StakeResourceRequest,
} from "./types";

export class APIClient extends BaseAPIClient {
  async getAssetsData(): Promise<Asset[]> {
    return await this.get("/api/external/assets/");
  }

  async getSupportedChains(): Promise<ChainData[]> {
    return await this.get("/api/external/assets/supported_chains/");
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
      source: request.source,
      destination: request.destination,
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
      source: request.source,
      destination: request.destination,
      amount: request.amount,
      asset: request.asset,
      blockChain: request.chain,
      category: TransactionCategory.TRANSFER,
      gasParams: request.gasParams,
      externalId: request.externalId,
      isAutomation: request.isAutomation,
      executeAt: request.executeAt,
      memo: request.memo,
      feePayer: request.feePayer,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async createContractCallTransaction(
    request: CreateContractCallTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      vaultId: request.vaultId,
      blockChain: request.chain,
      amount: request.amount,
      category: TransactionCategory.CONTRACT_CALL,
      data: request.data,
      externalId: request.externalId,
      gasParams: request.gasParams,
      creationOptions: request.creationOptions,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async replaceTransaction(request: ReplaceTransactionRequest) {
    return await this.post("/api/external/transactions/replace_transaction/", request);
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

  async getRampExchangeRates(
    request: RampExchangeRatesRequest,
  ): Promise<RampExchangeRatesResponse> {
    const params = {
      amount: request.amount,
      currency: request.currency,
      asset: request.asset,
      category: request.category,
      blockChain: request.blockChain,
      vaultId: request.vaultId,
    };
    return await this.get(
      "/api/external/transactions/ramp_exchange_rates/",
      params,
    );
  }

  async createTradeTransaction(
    request: CreateTradeTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      vaultId: request.vaultId,
      tradeRequestData: request.tradeRequestData,
      tradeResponseData: request.tradeResponseData,
      category: TransactionCategory.SWAP,
      blockChain: request.tradeRequestData.blockChain,
      externalId: request.externalId,
      memo: request.memo,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async createOnRampTransaction(
    request: CreateOnRampTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      vaultId: request.vaultId,
      onRampRequestData: request.onRampRequestData,
        onRampResponseData: request.onRampResponseData,
      category: TransactionCategory.ON_RAMP,
      blockChain: request.onRampRequestData.blockChain,
      externalId: request.externalId,
      memo: request.memo,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async createOffRampTransaction(
    request: CreateOffRampTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      vaultId: request.vaultId,
        offRampRequestData: request.offRampRequestData,
        offRampResponseData: request.offRampResponseData,
      category: TransactionCategory.OFF_RAMP,
      blockChain: request.offRampRequestData.blockChain,
      externalId: request.externalId,
      memo: request.memo,
      quoteId: request.quoteId,
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

  async getDetailedBalances(vaultId: string): Promise<DetailedBalanceResponse> {
    return await this.get(`/api/external/vaults/${vaultId}/detailed_balances/`);
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

  async delegateResource(request: DelegateResourceRequest): Promise<Transaction> {
    const data = {
      source: request.source,
      destination: request.destination,
      asset: request.asset,
      blockChain: request.chain,
      amount: request.amount,
      resourceType: request.resourceType,
      externalId: request.externalId,
      memo: request.memo,
      category: TransactionCategory.DELEGATE_RESOURCE,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async stakeResource(request: StakeResourceRequest): Promise<Transaction> {
    const data = {
      source: request.source,
      asset: request.asset,
      blockChain: request.chain,
      amount: request.amount,
      resourceType: request.resourceType,
      category: TransactionCategory.STAKE,
      externalId: request.externalId,
      memo: request.memo,
    };
    return await this.post("/api/external/transactions/", data);
  }
}
