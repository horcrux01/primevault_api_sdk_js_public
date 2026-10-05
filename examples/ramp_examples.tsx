import { APIClient, Transaction, TransferPartyType } from "../src";
import type {
  TransactionExecuteIntentRequest,
  TransactionIntentRequest,
  TransferPartyData,
} from "../src";

const createFiatToCryptoTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "7ad54443-21d2-4075-abef-83758c9dceb7";
  const rampVaultId = "1eadbf7c-7158-4f9e-ab5d-130c1370d001";

  const source: TransferPartyData = {
    type: TransferPartyType.VAULT,
    id: rampVaultId,
  };
  const destination: TransferPartyData = {
    type: TransferPartyType.VAULT,
    id: vaultId,
    chain: "ETHEREUM",
  };

  const intent: TransactionIntentRequest = {
    source,
    destination,
    input: { asset: "NGN", vaultId: rampVaultId },
    output: { asset: "USDT", amount: "5" },
  };

  const quoteResponse = await apiClient.getQuote({ intent });
  console.log("Quotes:", quoteResponse.quotes);
  const selectedQuote = quoteResponse.quotes[0];
  console.log("Quoted selections:", selectedQuote.input, selectedQuote.output);

  const request: TransactionExecuteIntentRequest = {
    quoteId: selectedQuote.quoteId,
    externalId: "fiat-to-crypto-example-2",
    memo: "fiat to crypto example",
  };

  const fiatToCryptoTransaction =
    await apiClient.createTransactionFromIntent(request);
  console.log("Fiat to crypto transaction:", fiatToCryptoTransaction);

  const depositInstructions = fiatToCryptoTransaction.depositInstructions;
  if (depositInstructions?.bankDetails) {
    console.log(
      "Fiat to crypto bank details:",
      depositInstructions.bankDetails,
    );
  }

  return fiatToCryptoTransaction;
};

const createCryptoToFiatTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const vaultId = "your-vault-id";
  const bankAccountId = "your-approved-bank-account-id";

  const source: TransferPartyData = {
    type: TransferPartyType.VAULT,
    id: vaultId,
    chain: "ETHEREUM",
  };

  const destination: TransferPartyData = {
    type: TransferPartyType.BANK_ACCOUNT,
    id: bankAccountId,
  };

  const intent: TransactionIntentRequest = {
    source,
    destination,
    input: { asset: "USDC", amount: "100" },
    output: { asset: "USD" },
  };

  const quoteResponse = await apiClient.getQuote({ intent });
  console.log("Quotes:", quoteResponse.quotes);
  const selectedQuote = quoteResponse.quotes[0];
  console.log("Quoted selections:", selectedQuote.input, selectedQuote.output);

  const cryptoToFiatTransaction = await apiClient.createTransactionFromIntent({
    quoteId: selectedQuote.quoteId,
    externalId: "crypto-to-fiat-example-1",
    memo: "crypto to fiat example",
  });
  console.log("Crypto to fiat transaction:", cryptoToFiatTransaction);

  return cryptoToFiatTransaction;
};

const createFiatToFiatTransaction = async (
  apiClient: APIClient,
): Promise<Transaction> => {
  const destinationBankAccountId = "your-usd-bank-account-id";

  const source: TransferPartyData = {
    type: TransferPartyType.EXTERNAL_BANK_ACCOUNT,
  };
  const destination: TransferPartyData = {
    type: TransferPartyType.BANK_ACCOUNT,
    id: destinationBankAccountId,
  };

  const intent: TransactionIntentRequest = {
    source,
    destination,
    input: { asset: "NGN", vaultId: "your-ngn-fiat-vault-id" },
    output: { asset: "USD", amount: "100", vaultId: "your-usd-fiat-vault-id" },
  };

  const quoteResponse = await apiClient.getQuote({ intent });
  console.log("Quotes:", quoteResponse.quotes);
  const selectedQuote = quoteResponse.quotes[0];
  console.log("Quoted selections:", selectedQuote.input, selectedQuote.output);

  const fiatToFiatTransaction = await apiClient.createTransactionFromIntent({
    quoteId: selectedQuote.quoteId,
    externalId: "ngn-to-usd-example-1",
    memo: "NGN to USD example",
  });
  console.log("NGN to USD transaction:", fiatToFiatTransaction);

  for (const change of fiatToFiatTransaction.balanceChanges?.changes ?? []) {
    console.log(`${change.asset} ${change.amount}:`, change.party);
  }

  return fiatToFiatTransaction;
};

export {
  createFiatToCryptoTransaction,
  createCryptoToFiatTransaction,
  createFiatToFiatTransaction,
};
