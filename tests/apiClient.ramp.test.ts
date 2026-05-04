jest.mock("uuid", () => ({
  v4: () => "test-jti",
}));

import { APIClient } from "../src/apiClient";
import {
  RampQuoteResponse,
  TransactionCategory,
  TransferPartyType,
} from "../src/types";

describe("APIClient ramp quotes", () => {
  test("getRampQuote sends toAmount and accepts finalFromAmount", async () => {
    const apiClient = Object.create(APIClient.prototype) as APIClient;
    const response: RampQuoteResponse = {
      quotes: [
        {
          finalFromAmount: "101.25",
          quoteId: "quote-1",
          fees: {
            amount: "1.25",
            asset: "USDC",
          },
          quoteResponseDict: {},
          sourceName: "provider",
        },
      ],
    };
    const postSpy = jest.spyOn(apiClient, "post").mockResolvedValue(response);

    const rampQuoteResponse = await apiClient.getRampQuote({
      source: {
        type: TransferPartyType.VAULT,
        id: "vault-1",
      },
      fromAsset: "USDC",
      fromChain: "ETHEREUM",
      toAsset: "USD",
      toAmount: "100",
      category: TransactionCategory.OFF_RAMP,
    });

    expect(postSpy).toHaveBeenCalledWith("/api/external/transactions/quote/", {
      source: {
        type: TransferPartyType.VAULT,
        id: "vault-1",
      },
      destination: undefined,
      fromAsset: "USDC",
      fromAmount: undefined,
      fromChain: "ETHEREUM",
      toAsset: "USD",
      toAmount: "100",
      toChain: undefined,
      category: TransactionCategory.OFF_RAMP,
      paymentMethod: undefined,
    });
    expect(rampQuoteResponse.quotes[0].finalFromAmount).toBe("101.25");
    expect(rampQuoteResponse.quotes[0]).not.toHaveProperty("finalToAmount");
  });
});
