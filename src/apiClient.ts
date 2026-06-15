import { BaseAPIClient } from "./baseApiClient";
import {
  ApprovalAction,
  ApprovalActionResponse,
  Asset,
  BalanceResponse,
  BankDetails,
  BankAccount,
  BankAccountListResponse,
  ChainData,
  Contact,
  CreateBankAccountRequest,
  CreateContactRequest,
  CreateContractCallTransactionRequest,
  CreateTransferTransactionRequest,
  CreateVaultRequest,
  EstimatedFeeResponse,
  EstimateFeeRequest,
  GetApprovalRequest,
  GetApprovalMessageResponse,
  GetQuoteRequest,
  QuoteResponse,
  ReplaceTransactionRequest,
  Transaction,
  TransactionCategory,
  TransactionExecuteIntentRequest,
  TransactionIntentRequest,
  TransactionListResponse,
  TransactionStatus,
  TransferPartyData,
  Vault,
  DetailedBalanceResponse,
  DelegateResourceRequest,
  StakeResourceRequest,
  UpdateContactRequest,
  UpdateContactResponse,
  VaultListResponse,
  ContactListResponse,
} from "./types";

function buildBankDetailsData(
  bank?: BankDetails | null,
): Record<string, any> | null {
  if (!bank) {
    return null;
  }

  return {
    bankAccountId: bank.bankAccountId ?? null,
    bankName: bank.bankName ?? null,
    beneficiaryName: bank.beneficiaryName ?? null,
    accountName: bank.accountName ?? null,
    accountNumber: bank.accountNumber ?? null,
    routingNumber: bank.routingNumber ?? null,
    paymentRail: bank.paymentRail ?? null,
    bankAddress: bank.bankAddress ?? null,
    swiftCode: bank.swiftCode ?? null,
    swiftBic: bank.swiftBic ?? null,
    iban: bank.iban ?? null,
    currency: bank.currency ?? null,
    country: bank.country ?? null,
  };
}

function buildTransferPartyData(
  party?: TransferPartyData | null,
): Record<string, any> | null {
  if (!party) {
    return null;
  }

  return {
    type: party.type,
    id: party.id ?? null,
    name: party.name ?? null,
    address: party.address ?? null,
    provider: party.provider ?? null,
    bankDetails: buildBankDetailsData(party.bankDetails),
    chain: party.chain ?? null,
    paymentRail: party.paymentRail ?? null,
  };
}

function buildTransactionIntentData(
  request?: TransactionIntentRequest | null,
): Record<string, any> | null {
  if (!request) {
    return null;
  }

  return {
    source: buildTransferPartyData(request.source),
    destination: buildTransferPartyData(request.destination),
    fromAsset: request.fromAsset ?? null,
    toAsset: request.toAsset ?? null,
    fromAmount: request.fromAmount ?? null,
    fromChain: request.fromChain ?? null,
    fromPaymentRail: request.fromPaymentRail ?? null,
    toAmount: request.toAmount ?? null,
    toChain: request.toChain ?? null,
    toPaymentRail: request.toPaymentRail ?? null,
  };
}

export class APIClient extends BaseAPIClient {
  async getAssetsData(): Promise<Asset[]> {
    return await this.get("/api/external/assets/");
  }

  async getSupportedChains(): Promise<ChainData[]> {
    return await this.get("/api/external/assets/supported_chains/");
  }

  async getTransactions(
    params: Record<string, string> = {},
    limit: number = 20,
    cursor: string | null = "",
  ): Promise<TransactionListResponse> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/transactions/?limit=${limit}&cursor=${cursor ?? ""}`;
    if (query) {
      url += `&${query}`;
    }
    return (await this.get(url)) as TransactionListResponse;
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    return await this.get(`/api/external/transactions/${transactionId}/`);
  }

  async getChangeApprovalMessage(
    entityId: string,
  ): Promise<GetApprovalMessageResponse> {
    return await this.get(
      "/api/external/change_requests/approvals/approval_message/",
      { entityId },
    );
  }

  async submitChangeApprovalAction(
    approvalId: string,
    action: ApprovalAction | string,
    signatureHex: string,
    reason: string | null = "ok",
  ): Promise<ApprovalActionResponse> {
    const data: Record<string, string> = {
      action,
      signature: signatureHex,
    };
    if (reason !== null) {
      data.reason = reason;
    }

    return await this.post(
      `/api/external/change_requests/approvals/${approvalId}/action/`,
      data,
    );
  }

  async approveChangeRequest(
    request: GetApprovalRequest,
  ): Promise<ApprovalActionResponse> {
    const approvalMessage = await this.getChangeApprovalMessage(
      request.entityId,
    );
    const signatureHex = await (this as any).signatureService.sign(
      approvalMessage.message,
    );
    return await this.submitChangeApprovalAction(
      approvalMessage.approvalId,
      request.action,
      signatureHex,
      request.reason,
    );
  }

  private async approvePendingTransactionChangeRequest(
    transaction: Transaction,
  ): Promise<Transaction> {
    if (transaction.status !== TransactionStatus.PENDING) {
      return transaction;
    }

    await this.approveChangeRequest({
      entityId: transaction.id,
      action: ApprovalAction.APPROVE,
    });
    return await this.getTransactionById(transaction.id);
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
    return await this.post(
      "/api/external/transactions/replace_transaction/",
      request,
    );
  }

  async getQuote(request: GetQuoteRequest): Promise<QuoteResponse> {
    const intent = buildTransactionIntentData(request.intent);
    if (intent && request.intent.routeAccounts) {
      intent.routeAccounts = request.intent.routeAccounts.map(
        (routeAccount) => ({
          provider: routeAccount.provider,
          id: routeAccount.id,
        }),
      );
    }

    return await this.post("/api/external/transactions/quote/", {
      intent,
    });
  }

  async createTransactionFromIntent(
    request: TransactionExecuteIntentRequest,
  ): Promise<Transaction> {
    const transaction = (await this.post(
      "/api/external/transactions/intent/create/",
      {
        intent: buildTransactionIntentData(request.intent),
        quoteId: request.quoteId,
        externalId: request.externalId,
        memo: request.memo,
      },
    )) as Transaction;
    return await this.approvePendingTransactionChangeRequest(transaction);
  }

  async markDepositDone(transactionId: string): Promise<Transaction> {
    return await this.post("/api/external/transactions/mark_deposit_done/", {
      transactionId,
    });
  }

  async getVaults(
    params: Record<string, string> = {},
    limit: number = 20,
    cursor?: string | null,
  ): Promise<VaultListResponse> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/vaults/?limit=${limit}&cursor=${cursor ?? ""}`;
    if (query) {
      url += `&${query}`;
    }
    return (await this.get(url)) as VaultListResponse;
  }

  async getVaultById(vaultId: string): Promise<Vault> {
    return await this.get(`/api/external/vaults/${vaultId}/`);
  }

  async createVault(data: CreateVaultRequest): Promise<Vault> {
    return await this.post("/api/external/vaults/", data);
  }

  async createVaultApproval(vault: Vault): Promise<Vault> {
    await this.approveChangeRequest({
      entityId: vault.id,
      action: ApprovalAction.APPROVE,
    });
    return await this.getVaultById(vault.id);
  }

  async createVaultWithApproval(request: CreateVaultRequest): Promise<Vault> {
    const vault = await this.createVault(request);
    return await this.createVaultApproval(vault);
  }

  async getBalances(vaultId: string): Promise<BalanceResponse> {
    return await this.get(`/api/external/vaults/${vaultId}/balances/`);
  }

  async getDetailedBalances(
    vaultId: string,
    params: Record<string, string> = {},
  ): Promise<DetailedBalanceResponse> {
    return await this.get(
      `/api/external/vaults/${vaultId}/detailed_balances/`,
      params,
    );
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
    limit: number = 20,
    cursor?: string | null,
  ): Promise<ContactListResponse> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/contacts/?limit=${limit}&cursor=${cursor ?? ""}`;
    if (query) {
      url += `&${query}`;
    }
    return (await this.get(url)) as ContactListResponse;
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
      contactGroupIds: request.contactGroupIds,
    };
    return await this.post("/api/external/contacts/", data);
  }

  async createContactApproval(
    contact: Contact | UpdateContactResponse,
  ): Promise<Contact> {
    await this.approveChangeRequest({
      entityId: contact.id,
      action: ApprovalAction.APPROVE,
    });
    return await this.getContactById(contact.id);
  }

  async createContactWithApproval(
    request: CreateContactRequest,
  ): Promise<Contact> {
    const contact = await this.createContact(request);
    return await this.createContactApproval(contact);
  }

  async updateContact(
    request: UpdateContactRequest,
  ): Promise<UpdateContactResponse> {
    const data = {
      assetList: request.assetList || [],
      contactGroupIds: request.contactGroupIds,
    };
    return await this.put(`/api/external/contacts/${request.id}/`, data);
  }

  async updateContactWithApproval(
    request: UpdateContactRequest,
  ): Promise<Contact> {
    const updated = await this.updateContact(request);
    return await this.createContactApproval(updated);
  }

  async delegateResource(
    request: DelegateResourceRequest,
  ): Promise<Transaction> {
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
    limit: number = 20,
    cursor?: string | null,
  ): Promise<BankAccountListResponse> {
    const query = new URLSearchParams(params).toString();
    let url = `/api/external/bank_accounts/?limit=${limit}&cursor=${cursor ?? ""}`;
    if (query) {
      url += `&${query}`;
    }
    return (await this.get(url)) as BankAccountListResponse;
  }

  async getBankAccountById(bankAccountId: string): Promise<BankAccount> {
    return await this.get(`/api/external/bank_accounts/${bankAccountId}/`);
  }

  async createBankAccount(
    request: CreateBankAccountRequest,
  ): Promise<BankAccount> {
    return await this.post("/api/external/bank_accounts/", request);
  }

  async createBankAccountApproval(
    bankAccount: BankAccount,
  ): Promise<BankAccount> {
    await this.approveChangeRequest({
      entityId: bankAccount.id,
      action: ApprovalAction.APPROVE,
    });
    return await this.getBankAccountById(bankAccount.id);
  }

  async createBankAccountWithApproval(
    request: CreateBankAccountRequest,
  ): Promise<BankAccount> {
    const bankAccount = await this.createBankAccount(request);
    return await this.createBankAccountApproval(bankAccount);
  }
}
