import { Config } from './config'
import { getSignatureService } from './signatureService'
import { encodeBase64, sortObjectKeys } from './utils'
import { createHash } from 'node:crypto'

export class AuthTokenService {
  private apiKey: string
  private signatureService: any

  constructor(apiKey: string, privateKey?: string, keyId?: string) {
    this.apiKey = apiKey
    this.signatureService = getSignatureService(privateKey, keyId)
  }

  async generateAuthToken(
    urlPath: string,
    body?: Record<string, any>
  ): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000)
    const expiresIn = Config.getExpiresIn()
    body = body || {}
    const bodyJson = JSON.stringify(sortObjectKeys(body))
    const hash = createHash('sha256')
    hash.update(bodyJson)
    const bodyHash = hash.digest('hex')
    const payload = {
      iat: timestamp,
      exp: timestamp + expiresIn,
      urlPath: urlPath,
      userId: this.apiKey,
      body: bodyHash
    }
    const headers = {
      alg: 'ES256',
      typ: 'JWT'
    }
    const encodedRequest = this.encodeRequest(headers, payload)
    const signature = await this.signatureService.sign(encodedRequest)
    const encodedSignature = encodeBase64(signature)
    return `${encodedRequest}.${encodedSignature}`
  }

  private encodeRequest(headers: object, payload: object): string {
    const jsonHeader = JSON.stringify(sortObjectKeys(headers), null, 0)
    const jsonPayload = JSON.stringify(sortObjectKeys(payload), null, 0)
    const encodedHeader = encodeBase64(jsonHeader)
    const encodedPayload = encodeBase64(jsonPayload)
    return `${encodedHeader}.${encodedPayload}`
  }
}
