import { BaseAPIClient } from "./baseApiClient";
import {
  ApprovalAction,
  ApprovalActionResponse,
  Asset,
  BalanceResponse,
  BankAccount,
  BankAccountListResponse,
  ChainData,
  Contact,
  CreateBankAccountRequest,
  CreateContactRequest,
  CreateContractCallTransactionRequest,
  CreateTradeTransactionRequest,
  CreateTransferTransactionRequest,
  CreateVaultRequest,
  EstimatedFeeResponse,
  EstimateFeeRequest,
  GetApprovalMessageResponse,
  GetTradeQuoteResponse,
  RampQuoteRequest,
  RampQuoteResponse,
  ReplaceTransactionRequest,
  TradeQuoteRequest,
  Transaction,
  TransactionCategory,
  Vault,
  DetailedBalanceResponse,
  CreateOnRampTransactionRequest,
  CreateOffRampTransactionRequest,
  DelegateResourceRequest,
  StakeResourceRequest,
  UpdateContactRequest,
  UpdateContactResponse,
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
      expectedToAmount: request.expectedToAmount,
      expiryInMinutes: request.expiryInMinutes,
      category: request.category,
      paymentMethod: request.paymentMethod,
    };
    return await this.get("/api/external/transactions/trade_quote/", params);
  }

  async getRampQuote(
    request: RampQuoteRequest,
  ): Promise<RampQuoteResponse> {
    const params = {
      source: request.source,
      destination: request.destination,
      fromAsset: request.fromAsset,
      fromAmount: request.fromAmount,
      fromChain: request.fromChain,
      toAsset: request.toAsset,
      toChain: request.toChain,
      category: request.category,
      paymentMethod: request.paymentMethod,
    };
    return await this.post(
      "/api/external/transactions/quote/",
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
      destination: request.destination,
      onRampRequestData: request.rampRequestData,
      onRampResponseData: request.rampResponseData,
      category: TransactionCategory.ON_RAMP,
      externalId: request.externalId,
      memo: request.memo,
    };
    return await this.post("/api/external/transactions/", data);
  }

  async createOffRampTransaction(
    request: CreateOffRampTransactionRequest,
  ): Promise<Transaction> {
    const data = {
      source: request.source,
      destination: request.destination,
      category: TransactionCategory.OFF_RAMP,
      onRampRequestData: request.rampRequestData,
      onRampResponseData: request.rampResponseData,
      externalId: request.externalId,
      memo: request.memo,
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
      assetList: request.assetList || [],
    };
    return await this.post("/api/external/contacts/", data);
  }

  async updateContact(request: UpdateContactRequest): Promise<UpdateContactResponse> {
    const data = {
      assetList: request.assetList || [],
    };
    return await this.put(`/api/external/contacts/${request.id}/`, data);
  }

  async submitContactApprovalAction(
    entityId: string,
    action: ApprovalAction = ApprovalAction.APPROVE,
  ): Promise<ApprovalActionResponse> {
    const msgResponse: GetApprovalMessageResponse = await this.get(
      "/api/external/change_requests/approvals/approval_message/",
      { entityId },
    );
    const signatureHex = await (this as any).signatureService.sign(
      msgResponse.message,
    );
    return await this.post(
      `/api/external/change_requests/approvals/${msgResponse.approvalId}/action/`,
      {
        entityId,
        message: msgResponse.message,
        signature: signatureHex,
        action,
      },
    );
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

  // ── Bank Accounts ──────────────────────────────────────────────────

  async getBankAccounts(
    params: Record<string, string> = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<BankAccountListResponse> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/bank_accounts/?limit=${limit}&page=${page}`;
    if (query) {
      url += `&${query}`;
    }
    return await this.get(url);
  }

  async getBankAccountById(bankAccountId: string): Promise<BankAccount> {
    return await this.get(`/api/external/bank_accounts/${bankAccountId}/`);
  }

  async createBankAccount(
    request: CreateBankAccountRequest,
  ): Promise<BankAccount> {
    return await this.post("/api/external/bank_accounts/", request);
  }

  async submitBankAccountApprovalAction(
    entityId: string,
    action: ApprovalAction = ApprovalAction.APPROVE,
  ): Promise<ApprovalActionResponse> {
    const msgResponse: GetApprovalMessageResponse = await this.get(
      "/api/external/change_requests/approvals/approval_message/",
      { entityId },
    );
    const signatureHex = await (this as any).signatureService.sign(
      msgResponse.message,
    );
    return await this.post(
      `/api/external/change_requests/approvals/${msgResponse.approvalId}/action/`,
      {
        entityId,
        message: msgResponse.message,
        signature: signatureHex,
        action,
      },
    );
  }
}
