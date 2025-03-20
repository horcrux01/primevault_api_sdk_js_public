import { Config } from "./config";
import { SignatureServiceEnum } from "./constants";
import {
  KMS,
  MessageType,
  SignCommand,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";
import { uInt8ArrayToHex } from "./utils";
import { KeyObject } from "crypto";

const crypto = require("crypto");

abstract class BaseSignatureService {
  abstract sign(data: string): Promise<string | undefined>;
}

export class PrivateKeySignatureService extends BaseSignatureService {
  private privateKey: KeyObject;

  constructor(privateKeyHex: string) {
    super();
    const trimmedKey = privateKeyHex.trim();
    if (trimmedKey.startsWith("-----BEGIN")) {
      // The key is in PEM format.
      // Determine if it is in SEC1 (EC PRIVATE KEY) or PKCS#8 (PRIVATE KEY) format.
      if (trimmedKey.includes("EC PRIVATE KEY")) {
        this.privateKey = crypto.createPrivateKey({
          key: trimmedKey,
          format: "pem",
          type: "sec1", // SEC1 for EC keys
        });
      } else {
        // Assume PKCS#8 format
        this.privateKey = crypto.createPrivateKey({
          key: trimmedKey,
          format: "pem",
          type: "pkcs8",
        });
      }
    } else {
      // Otherwise, assume it's a hex-encoded DER key in PKCS#8 format.
      const privateKeyDer = Buffer.from(trimmedKey, "hex");
      this.privateKey = crypto.createPrivateKey({
        key: privateKeyDer,
        format: "der",
        type: "pkcs8",
      });
    }
  }

  async sign(data: string): Promise<string | undefined> {
    const sign = crypto.createSign("SHA256");
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, "hex");
  }
}

export class KMSSignatureService extends BaseSignatureService {
  private kmsClient: KMS;
  private keyId: string;

  constructor(keyId: string) {
    super();
    this.keyId = keyId;
    this.kmsClient = new KMS({
      region: Config.getAwsRegion(),
    });
  }

  async sign(data: string): Promise<string | undefined> {
    const input = {
      KeyId: this.keyId,
      Message: Buffer.from(data),
      MessageType: MessageType.RAW,
      SigningAlgorithm: Config.getKmsSigningAlgorithm() as SigningAlgorithmSpec,
    };
    const command = new SignCommand(input);
    const response = await this.kmsClient.send(command);
    return uInt8ArrayToHex(response.Signature!);
  }
}

export function getSignatureService(
  privateKeyHex?: string,
  keyId?: string,
): BaseSignatureService {
  const signatureService = Config.getSignatureService();
  if (signatureService === SignatureServiceEnum.PRIVATE_KEY) {
    if (!privateKeyHex)
      throw new Error(
        "Private key is required for PRIVATE_KEY signature service.",
      );
    return new PrivateKeySignatureService(privateKeyHex);
  } else if (signatureService === SignatureServiceEnum.AWS_KMS) {
    if (!keyId)
      throw new Error("Key ID is required for AWS_KMS signature service.");
    return new KMSSignatureService(keyId);
  } else {
    throw new Error(`Invalid signature service: ${signatureService}`);
  }
}
