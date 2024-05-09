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

function pemToOneLine(pemString: string) {
  return pemString.replace(/\n/g, '\\n');
}

function convertDerToPem(derUint8Array: Uint8Array) {
  const derBuffer = Buffer.from(derUint8Array);
  const der = derBuffer.toString('base64');
  let pem = '-----BEGIN PUBLIC KEY-----\n';
  let offset = 0;
  const length = 64;

  while (offset < der.length) {
    pem += der.substring(offset, offset + length) + '\n';
    offset += length;
  }
  pem += '-----END PUBLIC KEY-----\n';
  return pemToOneLine(pem);
}

export async function generatePublicPrivateKeyPair() {
  const { publicKey, privateKey } = await crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  return {"publicKey": pemToOneLine(publicKey), "privateKey": pemToOneLine(privateKey)}
}

export async function generateAwsKmsKeyPair() {
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
    AliasName: 'alias/PrimeVaultSigningKey3', // update this to your desired alias
    TargetKeyId: keyId
  };
  const aliasCommand = new CreateAliasCommand(aliasInput);
  await kmsClient.send(aliasCommand);

  const publicKeyInput = {
    KeyId: keyId,
  };
  const publicKeyCommand = new GetPublicKeyCommand(publicKeyInput);
  const publicKeyResponse = await kmsClient.send(publicKeyCommand);

  return { publicKey: convertDerToPem(publicKeyResponse.PublicKey!), keyId };
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

export function encodeBase64(data: string) {
  return base64url.encode(data)
}
