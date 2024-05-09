import { BaseAPIClient } from './baseApiClient'

export class APIClient extends BaseAPIClient {
  async getAssetsData() {
    return await this.get('/api/external/assets/')
  }

  async getTransactions(page: number = 1, limit: number = 20) {
    return await this.get(
      `/api/external/transactions/?page=${page}&limit=${limit}`
    )
  }

  async getTransactionById(transactionId: string) {
    return await this.get(`/api/external/transactions/${transactionId}/`)
  }

  async estimateFee(
    sourceId: string,
    destinationId: string,
    amount: string,
    asset: string,
    chain: string
  ) {
    const data = {
      sourceId,
      destinationId,
      amount,
      asset,
      blockChain: chain,
      category: 'TRANSFER'
    }
    return await this.post('/api/external/transactions/estimate_fee/', data)
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
    executeAt?: string
  ) {
    const data = {
      sourceId,
      destinationId,
      amount: String(amount),
      asset,
      blockChain: chain,
      category: 'TRANSFER',
      gasParams,
      externalId,
      isAutomation,
      executeAt
    }
    return await this.post('/api/external/transactions/', data)
  }

  async getTradeQuote(
    vaultId: string,
    fromAsset: string,
    toAsset: string,
    fromAmount: string,
    fromChain: string,
    toChain: string,
    slippage: string
  ) {
    const params = {
      vaultId,
      fromAsset,
      toAsset,
      fromAmount,
      blockChain: fromChain,
      toBlockchain: toChain,
      slippage
    }
    return await this.get('/api/external/transactions/trade_quote/', params)
  }

  async createTradeTransaction(
    vaultId: string,
    tradeRequestData: Record<string, any>,
    tradeResponseData: Record<string, any>,
    externalId?: string
  ) {
    const data = {
      vaultId,
      tradeRequestData,
      tradeResponseData,
      category: 'SWAP',
      blockChain: tradeRequestData['blockChain'],
      externalId
    }
    return await this.post('/api/external/transactions/', data)
  }

  async getVaults(
    page: number = 1,
    limit: number = 20,
    reverse: boolean = false
  ) {
    return await this.get(
      `/api/external/vaults/?limit=${limit}&page=${page}&reverse=${reverse}`
    )
  }

  async getVaultById(vaultId: string) {
    return await this.get(`/api/external/vaults/${vaultId}/`)
  }

  async createVault(data: Record<string, any>) {
    return await this.post('/api/external/vaults/', data)
  }

  async getBalances(vaultId: string) {
    return await this.get(`/api/external/vaults/${vaultId}/balances/`)
  }

  async updateBalances(vaultId: string) {
    return await this.post(`/api/external/vaults/${vaultId}/update_balances/`)
  }

  async getOperationMessageToSign(operationId: string) {
    return await this.get(
      `/api/external/operations/${operationId}/operation_message_to_sign/`
    )
  }

  async updateUserAction(
    operationId: string,
    isApproved: boolean,
    signatureHex: string
  ) {
    const data = {
      isApproved,
      signatureHex,
      operationId
    }
    return await this.post(
      `/api/external/operations/${operationId}/update_user_action/`,
      data
    )
  }

  async getContacts(page: number = 1, limit: number = 20) {
    return await this.get(`/api/external/contacts/?limit=${limit}&page=${page}`)
  }

  async getContactById(contactId: string) {
    return await this.get(`/api/external/contacts/${contactId}/`)
  }

  async createContact(
    name: string,
    address: string,
    chain: string,
    tags?: string[],
    externalId?: string
  ) {
    const data = {
      name,
      address,
      blockChain: chain,
      tags,
      externalId
    }
    return await this.post('/api/external/contacts/', data)
  }
}
