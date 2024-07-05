import { SignatureServiceEnum } from "./constants";

export class Config {
  private static _config: { [key: string]: any } = {};

  public static set(key: string, value: any): void {
    Config._config[key] = value;
  }

  public static get<T>(key: string): T | undefined {
    return Config._config[key];
  }

  public static clear(): void {
    Config._config = {};
  }

  public static getSignatureService() {
    return Config.get("SIGNATURE_SERVICE") || SignatureServiceEnum.PRIVATE_KEY;
  }

  public static getExpiresIn(): number {
    return Config.get<number>("EXPIRES_IN") || 120;
  }

  public static getAwsRegion(): string {
    return Config.get<string>("AWS_REGION") || "eu-north-1";
  }

  public static getKmsSigningAlgorithm(): string {
    return Config.get<string>("KMS_SIGNING_ALGORITHM") || "ECDSA_SHA_256";
  }
}
