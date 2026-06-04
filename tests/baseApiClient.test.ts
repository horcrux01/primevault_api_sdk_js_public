jest.mock("axios", () => ({
  __esModule: true,
  default: {
    request: jest.fn(),
  },
}));

jest.mock("../src/authTokenService", () => ({
  AuthTokenService: jest.fn().mockImplementation(() => ({
    generateAuthToken: jest.fn().mockResolvedValue("auth-token"),
  })),
}));

jest.mock("../src/signatureService", () => ({
  getSignatureService: jest.fn(() => ({
    sign: jest.fn().mockResolvedValue("abcd"),
  })),
}));

import axios from "axios";
import { BaseAPIClient } from "../src/baseApiClient";

const { version: sdkVersion } = require("../package.json");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("BaseAPIClient", () => {
  beforeEach(() => {
    mockedAxios.request.mockResolvedValue({ data: {} });
    mockedAxios.request.mockClear();
  });

  test("sends the SDK version header on all request methods", async () => {
    const client = new BaseAPIClient("api-key", "https://api.example.test");

    await client.get("/get-path/", { page: 1 });
    await client.post("/post-path/", { amount: "1" });
    await client.put("/put-path/", { status: "ok" });

    expect(mockedAxios.request).toHaveBeenCalledTimes(3);
    for (const call of mockedAxios.request.mock.calls) {
      expect(call[0].headers).toEqual(
        expect.objectContaining({
          "Api-Key": "api-key",
          version: sdkVersion,
          Authorization: "Bearer auth-token",
        }),
      );
    }
  });
});
