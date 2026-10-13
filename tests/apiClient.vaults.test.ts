import {
  GetVaultDepositInstructionsRequest,
  PaymentRail,
  TransferPartyType,
  Vault,
  VaultDepositInstructionsResponse,
  VaultListResponse,
} from "../src";
import { createMockClient, vault } from "./helpers";

const bankInstructions: VaultDepositInstructionsResponse = {
  results: [
    {
      type: TransferPartyType.EXTERNAL_BANK_ACCOUNT,
      asset: "USD",
      paymentRail: PaymentRail.WIRE,
      memo: "deposit-reference",
      bankDetails: {
        bankAccountInfo: {
          bankName: "Example Bank",
          country: "US",
          bankAddress: "1 Bank Street",
          accountType: "CHECKING",
          routingNumber: "021000021",
          accountNumber: "000123456789",
          bic: "EXAMPLE0XXX",
        },
        beneficiary: {
          name: "PrimeVault Inc",
          address: {
            streetLine1: "123 Example Street",
            city: "New York",
            state: "NY",
            zip: "10001",
          },
        },
      },
    },
  ],
};

describe("Vault APIs", () => {
  test("preserves bound, null and omitted assets in list and detail responses", async () => {
    const { client, get } = createMockClient();
    const fiatVault: Vault = { ...vault, id: "fiat-vault-id", asset: "USD" };
    const cryptoVault: Vault = { ...vault, id: "crypto-vault-id", asset: null };
    const page: VaultListResponse = {
      results: [fiatVault, cryptoVault, vault],
      nextCursor: "next-page",
      hasNext: true,
    };
    get.mockResolvedValueOnce(page).mockResolvedValueOnce(fiatVault);

    const listed = await client.getVaults({}, 3);
    const retrieved = await client.getVaultById(fiatVault.id);

    expect(get).toHaveBeenNthCalledWith(
      1,
      "/api/external/vaults/?limit=3&cursor=",
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      "/api/external/vaults/fiat-vault-id/",
    );
    expect(listed).toBe(page);
    expect(retrieved).toBe(fiatVault);
  });

  test("fetches deposit instructions under results", async () => {
    const { client, get } = createMockClient();
    const request: GetVaultDepositInstructionsRequest = {
      asset: "USD",
      paymentRail: PaymentRail.WIRE,
    };
    get.mockResolvedValue(bankInstructions);

    const result = await client.getVaultDepositInstructions(vault.id, request);

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(
      "/api/external/vaults/vault-id/deposit_instructions/",
      request,
    );
    expect(Object.keys(result)).toEqual(["results"]);
    expect(result.results).toBe(bankInstructions.results);
    expect(result.results[0].bankDetails?.bankAccountInfo?.country).toBe("US");
    expect(result.results[0].bankDetails).not.toHaveProperty("country");

    const pixInstructions: VaultDepositInstructionsResponse = {
      results: [
        {
          asset: "BRL",
          paymentRail: PaymentRail.PIX,
          bankDetails: {
            bankAccountInfo: {
              country: "BR",
              pixKey: "00123456789",
              pixKeyType: "CPF",
            },
          },
        },
      ],
    };
    get.mockResolvedValueOnce(pixInstructions);
    const pix = await client.getVaultDepositInstructions(vault.id, {
      asset: "BRL",
      paymentRail: PaymentRail.PIX,
    });
    expect(pix.results[0].bankDetails?.bankAccountInfo).toEqual({
      country: "BR",
      pixKey: "00123456789",
      pixKeyType: "CPF",
    });
    expect(pix.results[0].bankDetails).not.toHaveProperty("pixKey");
  });
});
