import { BaseAPIClient } from "./baseApiClient";
import { ActivityEventListResponse, ApprovalAction, ApprovalActionResponse, Asset, BalanceResponse, BankAccount, BankAccountListResponse, ChainData, Contact, CreateBankAccountRequest, CreateContactRequest, CreateContractCallTransactionRequest, CreateTransferTransactionRequest, CreateVaultRequest, EstimatedFeeResponse, EstimateFeeRequest, GetApprovalRequest, GetApprovalMessageResponse, GetQuoteRequest, QuoteResponse, ReplaceTransactionRequest, Transaction, TransactionExecuteIntentRequest, TransactionListResponse, Vault, DetailedBalanceResponse, DelegateResourceRequest, StakeResourceRequest, UpdateContactRequest, UpdateContactResponse, VaultListResponse, ContactListResponse } from "./types";
export declare class APIClient extends BaseAPIClient {
    getAssetsData(): Promise<Asset[]>;
    getSupportedChains(): Promise<ChainData[]>;
    getTransactions(params?: Record<string, string>, limit?: number, cursor?: string | null): Promise<TransactionListResponse>;
    getActivityEvents(params?: Record<string, string>, limit?: number, cursor?: string | null): Promise<ActivityEventListResponse>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    getChangeApprovalMessage(entityId: string): Promise<GetApprovalMessageResponse>;
    submitChangeApprovalAction(approvalId: string, action: ApprovalAction | string, signatureHex: string, reason?: string | null): Promise<ApprovalActionResponse>;
    approveChangeRequest(request: GetApprovalRequest): Promise<ApprovalActionResponse>;
    private approvePendingTransactionChangeRequest;
    estimateFee(request: EstimateFeeRequest): Promise<EstimatedFeeResponse>;
    createTransferTransaction(request: CreateTransferTransactionRequest): Promise<Transaction>;
    /**
     * Create a transfer transaction and approve it in one call.
     *
     * The transaction is only signed for approval when it lands in PENDING, so
     * orgs whose policy approves on create get the created transaction back
     * untouched.
     */
    createTransactionWithApproval(request: CreateTransferTransactionRequest): Promise<Transaction>;
    createContractCallTransaction(request: CreateContractCallTransactionRequest): Promise<Transaction>;
    replaceTransaction(request: ReplaceTransactionRequest): Promise<Transaction>;
    getQuote(request: GetQuoteRequest): Promise<QuoteResponse>;
    createTransactionFromIntent(request: TransactionExecuteIntentRequest): Promise<Transaction>;
    markDepositDone(transactionId: string): Promise<Transaction>;
    getVaults(params?: Record<string, string>, limit?: number, cursor?: string | null): Promise<VaultListResponse>;
    getVaultById(vaultId: string): Promise<Vault>;
    createVault(data: CreateVaultRequest): Promise<Vault>;
    createVaultApproval(vault: Vault): Promise<Vault>;
    createVaultWithApproval(request: CreateVaultRequest): Promise<Vault>;
    getBalances(vaultId: string): Promise<BalanceResponse>;
    getDetailedBalances(vaultId: string, params?: Record<string, string>): Promise<DetailedBalanceResponse>;
    getOperationMessageToSign(operationId: string): Promise<any>;
    updateUserAction(operationId: string, isApproved: boolean, signatureHex: string): Promise<any>;
    getContacts(params?: Record<string, string>, limit?: number, cursor?: string | null): Promise<ContactListResponse>;
    getContactById(contactId: string): Promise<Contact>;
    createContact(request: CreateContactRequest): Promise<Contact>;
    createContactApproval(contact: Contact | UpdateContactResponse): Promise<Contact>;
    createContactWithApproval(request: CreateContactRequest): Promise<Contact>;
    updateContact(request: UpdateContactRequest): Promise<UpdateContactResponse>;
    updateContactWithApproval(request: UpdateContactRequest): Promise<Contact>;
    delegateResource(request: DelegateResourceRequest): Promise<Transaction>;
    stakeResource(request: StakeResourceRequest): Promise<Transaction>;
    getBankAccounts(params?: Record<string, string>, limit?: number, cursor?: string | null): Promise<BankAccountListResponse>;
    getBankAccountById(bankAccountId: string): Promise<BankAccount>;
    createBankAccount(request: CreateBankAccountRequest): Promise<BankAccount>;
    createBankAccountApproval(bankAccount: BankAccount): Promise<BankAccount>;
    createBankAccountWithApproval(request: CreateBankAccountRequest): Promise<BankAccount>;
}
//# sourceMappingURL=apiClient.d.ts.map