import axios, { AxiosRequestConfig } from 'axios'
import { AuthTokenService } from './authTokenService'
import { getSignatureService } from './signatureService'
import { sortObjectKeys } from './utils'

interface RequestOptions {
  urlPath?: string
  params?: Record<string, any>
  data?: Record<string, any>
}

export class BaseAPIClient {
  private apiKey: string
  private apiUrl: string
  private headers: Record<string, string>
  private authTokenService: AuthTokenService
  private signatureService: any

  constructor(
    apiKey: string,
    apiUrl: string,
    privateKeyHex?: string,
    keyId?: string
  ) {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Api-Key': this.apiKey
    }
    this.authTokenService = new AuthTokenService(apiKey, privateKeyHex, keyId)
    this.signatureService = getSignatureService(privateKeyHex, keyId)
  }

  async get(path: string, params?: Record<string, any>): Promise<any> {
    return this._makeRequest('GET', { urlPath: path, params })
  }

  async post(path: string, data?: Record<string, any>): Promise<any> {
    return this._makeRequest('POST', { urlPath: path, data })
  }

  private async _makeRequest(
    method: string,
    options: RequestOptions
  ): Promise<any> {
    const { urlPath, params, data } = options
    const full_url = `${this.apiUrl}${urlPath || ''}`
    const api_token = await this.authTokenService.generateAuthToken(
      urlPath || '',
      data
    )
    this.headers['Authorization'] = `Bearer ${api_token}`

    if (data) {
      const dataSignature = await this.signatureService.sign(
        JSON.stringify(sortObjectKeys(data))
      )
      data['dataSignatureHex'] = dataSignature.toString('hex')
    }

    const axiosConfig: AxiosRequestConfig = {
      headers: this.headers,
      params: params || {},
      data: data || {}
    }

    try {
      const response = await axios.request({
        method,
        url: full_url,
        ...axiosConfig
      })
      return response.data
    } catch (error: any) {
      const response = error.response || {}
      const { status, data: responseText } = response
      switch (status) {
        case 400:
          throw new BadRequestError(
            `400 Bad Request: ${response.statusText}`,
            responseText
          )
        case 401:
          throw new UnauthorizedError(
            `401 Unauthorized: ${response.statusText}`,
            responseText
          )
        case 403:
          throw new ForbiddenError(
            `403 Forbidden: ${response.statusText}`,
            responseText
          )
        case 404:
          throw new NotFoundError(
            `404 Not Found: ${response.statusText}`,
            responseText
          )
        case 429:
          throw new TooManyRequestsError(
            `429 Too Many Requests: ${response.statusText}`,
            responseText
          )
        case 500:
          throw new InternalServerError(
            `500 Internal Server Error: ${response.statusText}`,
            responseText
          )
        default:
          throw new Error(`HTTP Error: ${response.statusText}`)
      }
    }
  }
}

class BaseAPIException extends Error {
  constructor(
    message: string,
    public responseText?: any
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends BaseAPIException {}

class UnauthorizedError extends BaseAPIException {}

class ForbiddenError extends BaseAPIException {}

class NotFoundError extends BaseAPIException {}

class InternalServerError extends BaseAPIException {}

class ServiceUnavailableError extends BaseAPIException {}

class TooManyRequestsError extends BaseAPIException {}
