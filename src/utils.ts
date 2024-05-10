import base64url from 'base64url'
import {
  CreateAliasCommand,
  CreateKeyCommand,
  CustomerMasterKeySpec,
  GetPublicKeyCommand,
  KeyUsageType,
  KMS, OriginType
} from '@aws-sdk/client-kms'
import { Config } from './config'

const crypto = require('crypto')

export function uInt8ArrayToHex(uInt8Array: Uint8Array) {
  return Buffer.from(uInt8Array).toString('hex');
}

export async function generatePublicPrivateKeyPair() {
  const { publicKey, privateKey } = await crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'der'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der'
    }
  });
  return {"publicKeyHex": publicKey.toString('hex'), "privateKeyHex": privateKey.toString('hex')};
}

export async function generateAwsKmsKeyPair(aliasName?: string) {
  const kmsClient = new KMS({
    region: Config.getAwsRegion()
  });

  const input = {
    Description: 'Key for Signing PrimeVault requests',
    CustomerMasterKeySpec: 'ECC_NIST_P256' as CustomerMasterKeySpec,
    KeyUsage: 'SIGN_VERIFY' as KeyUsageType,
    Origin: 'AWS_KMS' as OriginType
  };
  const command = new CreateKeyCommand(input);
  const response = await kmsClient.send(command);
  const keyId = response.KeyMetadata?.KeyId;

  const aliasInput = {
    AliasName: `alias/${aliasName || 'PrimeVaultSigningKey'}`, // update this to your desired alias
    TargetKeyId: keyId
  };
  const aliasCommand = new CreateAliasCommand(aliasInput);
  await kmsClient.send(aliasCommand);

  const publicKeyInput = {
    KeyId: keyId,
  };
  const publicKeyCommand = new GetPublicKeyCommand(publicKeyInput);
  const publicKeyResponse = await kmsClient.send(publicKeyCommand);

  return { publicKeyHex: uInt8ArrayToHex(publicKeyResponse.PublicKey!), keyId };
}

export function sortObjectKeys(obj: object): object {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = sortObjectKeys(obj[key as keyof typeof obj])
        return result
      }, {})
  }
  return obj
}

export function encodeBase64(data: string | Buffer): string {
  return base64url.encode(data)
}
