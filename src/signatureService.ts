import { Config } from './config'
import { SignatureServiceEnum } from './constants'
import { KMS, MessageType, SignCommand, SigningAlgorithmSpec } from '@aws-sdk/client-kms'

const crypto = require('crypto')

abstract class BaseSignatureService {
  abstract sign(data: string): Promise<Buffer | undefined>
}

export class PrivateKeySignatureService extends BaseSignatureService {
  private privateKey: any

  constructor(privateKey: string) {
    super()
    this.privateKey = privateKey
  }

  async sign(data: string): Promise<Buffer | undefined> {
    const sign = crypto.createSign('SHA256')
    sign.update(data)
    sign.end()
    const signature = sign.sign(this.privateKey, 'hex')
    return Buffer.from(signature, 'hex')
  }
}

export class KMSSignatureService extends BaseSignatureService {
  private kmsClient: KMS
  private keyId: string

  constructor(keyId: string) {
    super()
    this.keyId = keyId
    this.kmsClient = new KMS({
      region: Config.getAwsRegion()
    })
  }

  async sign(data: string): Promise<Buffer | undefined> {
    try {
      const input = {
        KeyId: this.keyId,
        Message: Buffer.from(data),
        MessageType: MessageType.RAW,
        SigningAlgorithm: Config.getKmsSigningAlgorithm() as SigningAlgorithmSpec,
      };
      const command = new SignCommand(input);
      const response = await this.kmsClient.send(command);
      return response.Signature as Buffer
    } catch (error) {
      console.error(`An error occurred while signing: ${error}`)
      return undefined
    }
  }
}

export function getSignatureService(
  privateKey?: string,
  keyId?: string
): BaseSignatureService {
  const signatureService = Config.getSignatureService()
  if (signatureService === SignatureServiceEnum.PRIVATE_KEY) {
    if (!privateKey)
      throw new Error(
        'Private key is required for PRIVATE_KEY signature service.'
      )
    return new PrivateKeySignatureService(privateKey)
  } else if (signatureService === SignatureServiceEnum.AWS_KMS) {
    if (!keyId)
      throw new Error('Key ID is required for AWS_KMS signature service.')
    return new KMSSignatureService(keyId)
  } else {
    throw new Error(`Invalid signature service: ${signatureService}`)
  }
}
