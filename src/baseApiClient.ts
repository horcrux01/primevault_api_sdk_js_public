import axios, { AxiosRequestConfig } from "axios";
import { AuthTokenService } from "./authTokenService";
import { getSignatureService } from "./signatureService";
import { sortObjectKeys } from "./utils";

interface RequestOptions {
  urlPath?: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
}

export class BaseAPIClient {
  private apiKey: string;
  private apiUrl: string;
  private headers: Record<string, string>;
  private authTokenService: AuthTokenService;
  private signatureService: any;

  constructor(
    apiKey: string,
    apiUrl: string,
    privateKeyHex?: string,
    keyId?: string,
  ) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Api-Key": this.apiKey,
    };
    this.authTokenService = new AuthTokenService(apiKey, privateKeyHex, keyId);
    this.signatureService = getSignatureService(privateKeyHex, keyId);
  }

  async get(path: string, params?: Record<string, any>): Promise<any> {
    return this._makeRequest("GET", { urlPath: path, params });
  }

  async post(path: string, data?: Record<string, any>): Promise<any> {
    return this._makeRequest("POST", { urlPath: path, data });
  }

  private async _makeRequest(
    method: string,
    options: RequestOptions,
  ): Promise<any> {
    const { urlPath, params, data } = options;
    const full_url = `${this.apiUrl}${urlPath || ""}`;
    const api_token = await this.authTokenService.generateAuthToken(
      urlPath || "",
      data,
    );

    const requestHeaders = {
      ...this.headers,
      Authorization: `Bearer ${api_token}`,
    };

    let requestData = data;
    if (data) {
      requestData = { ...data };
      const dataSignature = await this.signatureService.sign(
        JSON.stringify(sortObjectKeys(data)),
      );
      requestData["dataSignatureHex"] = dataSignature.toString("hex");
    }

    const axiosConfig: AxiosRequestConfig = {
      headers: requestHeaders,
    };
    if (requestData && Object.keys(requestData).length > 0) {
      axiosConfig.data = requestData;
    }
    if (params && Object.keys(params).length > 0) {
      axiosConfig.params = params;
    }

    try {
      const response = await axios.request({
        method,
        url: full_url,
        ...axiosConfig,
      });
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw new NetworkError(error.message || "Network request failed");
      }

      const { status, data: responseData } = error.response;
      const errorMessage =
        (typeof responseData === "object" && responseData?.message) ||
        (typeof responseData === "string" && responseData) ||
        "Unknown error";
      const errorCode =
        typeof responseData === "object" ? responseData?.code : undefined;

      switch (status) {
        case 400:
          throw new BadRequestError(errorMessage, errorCode, status, responseData);
        case 401:
          throw new UnauthorizedError(errorMessage, errorCode, status, responseData);
        case 403:
          throw new ForbiddenError(errorMessage, errorCode, status, responseData);
        case 404:
          throw new NotFoundError(errorMessage, errorCode, status, responseData);
        case 408:
          throw new RequestTimeoutError(errorMessage, errorCode, status, responseData);
        case 409:
          throw new ConflictError(errorMessage, errorCode, status, responseData);
        case 422:
          throw new ValidationError(errorMessage, errorCode, status, responseData);
        case 429:
          throw new TooManyRequestsError(errorMessage, errorCode, status, responseData);
        case 500:
          throw new InternalServerError(errorMessage, errorCode, status, responseData);
        case 502:
          throw new BadGatewayError(errorMessage, errorCode, status, responseData);
        case 503:
          throw new ServiceUnavailableError(errorMessage, errorCode, status, responseData);
        case 504:
          throw new GatewayTimeoutError(errorMessage, errorCode, status, responseData);
        default:
          throw new UnknownError(errorMessage, errorCode, status, responseData);
      }
    }
  }
}

export class BaseAPIException extends Error {
  message: string;
  errorCode?: string;
  status?: number;
  responseText?: any;

  constructor(
    message: string,
    code?: string,
    status?: number,
    responseText?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = code;
    this.message = message;
    this.status = status;
    this.responseText = responseText;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends BaseAPIException {}

export class BadRequestError extends BaseAPIException {}

export class UnauthorizedError extends BaseAPIException {}

export class ForbiddenError extends BaseAPIException {}

export class NotFoundError extends BaseAPIException {}

export class RequestTimeoutError extends BaseAPIException {}

export class ConflictError extends BaseAPIException {}

export class ValidationError extends BaseAPIException {}

export class TooManyRequestsError extends BaseAPIException {}

export class InternalServerError extends BaseAPIException {}

export class BadGatewayError extends BaseAPIException {}

export class ServiceUnavailableError extends BaseAPIException {}

export class GatewayTimeoutError extends BaseAPIException {}

export class UnknownError extends BaseAPIException {}