import { BaseAPIClient } from "./baseApiClient";
import {
  ActivityEventListResponse,
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
  CreateSubOrgRequest,
  CreateTransferTransactionRequest,
  CreateVaultRequest,
  EstimatedFeeResponse,
  EstimateFeeRequest,
  GetApprovalRequest,
  GetApprovalMessageResponse,
  GetQuoteRequest,
  GetVaultDepositInstructionsRequest,
  IntentAsset,
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
  SubOrg,
  SubOrgListResponse,
  UpdateContactRequest,
  UpdateContactResponse,
  VaultListResponse,
  VaultDepositInstructionsResponse,
  ContactListResponse,
} from "./types";

// accountNumberMasked and swiftBic only appear in deposit instructions; the
// backend BankDetails request contract has no such fields.
function buildBankDetailsData(bank: BankDetails): Record<string, any> {
  return {
    ...(bank.bankAccountId === undefined ? {} : { bankAccountId: bank.bankAccountId }),
    ...(bank.bankName === undefined ? {} : { bankName: bank.bankName }),
    ...(bank.bankCode === undefined ? {} : { bankCode: bank.bankCode }),
    ...(bank.beneficiaryName === undefined
      ? {}
      : { beneficiaryName: bank.beneficiaryName }),
    ...(bank.accountName === undefined ? {} : { accountName: bank.accountName }),
    ...(bank.accountNumber === undefined ? {} : { accountNumber: bank.accountNumber }),
    ...(bank.routingNumber === undefined ? {} : { routingNumber: bank.routingNumber }),
    ...(bank.paymentRail === undefined ? {} : { paymentRail: bank.paymentRail }),
    ...(bank.bankAddress === undefined ? {} : { bankAddress: bank.bankAddress }),
    ...(bank.beneficiaryAddress === undefined
      ? {}
      : { beneficiaryAddress: bank.beneficiaryAddress }),
    ...(bank.swiftCode === undefined ? {} : { swiftCode: bank.swiftCode }),
    ...(bank.iban === undefined ? {} : { iban: bank.iban }),
    ...(bank.country === undefined ? {} : { country: bank.country }),
  };
}

function buildTransferPartyData(party: TransferPartyData): Record<string, any> {
  return {
    type: party.type,
    ...(party.id === undefined ? {} : { id: party.id }),
    ...(party.name === undefined ? {} : { name: party.name }),
    ...(party.address === undefined ? {} : { address: party.address }),
    ...(party.provider === undefined ? {} : { provider: party.provider }),
    ...(party.bankDetails === undefined
      ? {}
      : { bankDetails: buildBankDetailsData(party.bankDetails) }),
    ...(party.chain === undefined ? {} : { chain: party.chain }),
    ...(party.paymentRail === undefined ? {} : { paymentRail: party.paymentRail }),
  };
}

function buildIntentAssetData(asset: IntentAsset): Record<string, any> {
  return {
    asset: asset.asset,
    ...(asset.amount === undefined ? {} : { amount: asset.amount }),
    ...(asset.vaultId === undefined ? {} : { vaultId: asset.vaultId }),
  };
}

function buildTransactionIntentData(
  request?: TransactionIntentRequest | null,
): Record<string, any> | null {
  if (!request) {
    return null;
  }

  return {
    input: buildIntentAssetData(request.input),
    output: buildIntentAssetData(request.output),
    ...(request.source === undefined
      ? {}
      : { source: buildTransferPartyData(request.source) }),
    ...(request.destination === undefined
      ? {}
      : { destination: buildTransferPartyData(request.destination) }),
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

  async getActivityEvents(
    params: Record<string, string> = {},
    limit: number = 20,
    cursor: string | null = "",
  ): Promise<ActivityEventListResponse> {
    const query = new URLSearchParams({
      limit: String(limit),
      cursor: cursor ?? "",
      ...params,
    });
    return (await this.get(
      `/api/external/activity/events/?${query.toString()}`,
    )) as ActivityEventListResponse;
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
      memo: request.memo,
      feePayer: request.feePayer,
    };
    return await this.post("/api/external/transactions/", data);
  }

  /**
   * Create a transfer transaction and approve it in one call.
   *
   * The transaction is only signed for approval when it lands in PENDING, so
   * orgs whose policy approves on create get the created transaction back
   * untouched.
   */
  async createTransactionWithApproval(
    request: CreateTransferTransactionRequest,
  ): Promise<Transaction> {
    const transaction = await this.createTransferTransaction(request);
    return await this.approvePendingTransactionChangeRequest(transaction);
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

  async replaceTransaction(
    request: ReplaceTransactionRequest,
  ): Promise<Transaction> {
    return await this.post(
      "/api/external/transactions/replace_transaction/",
      request,
    );
  }

  async getQuote(request: GetQuoteRequest): Promise<QuoteResponse> {
    return await this.post("/api/external/transactions/v2/quote/", {
      intent: buildTransactionIntentData(request.intent),
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

  async getVaultDepositInstructions(
    vaultId: string,
    request: GetVaultDepositInstructionsRequest,
  ): Promise<VaultDepositInstructionsResponse> {
    return await this.get(
      `/api/external/vaults/${vaultId}/deposit_instructions/`,
      request,
    );
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

  async getSubOrgs(
    params: Record<string, string> = {},
    limit: number = 20,
    cursor?: string | null,
  ): Promise<SubOrgListResponse> {
    const query = new URLSearchParams({
      limit: String(limit),
      cursor: cursor ?? "",
      ...params,
    });
    return (await this.get(
      `/api/external/sub_orgs/?${query}`,
    )) as SubOrgListResponse;
  }

  async createSubOrg(request: CreateSubOrgRequest): Promise<SubOrg> {
    return await this.post("/api/external/sub_orgs/", request);
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
      subOrgId: request.subOrgId,
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
