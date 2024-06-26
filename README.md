# PrimeVault TypeScript/JavaScript SDK

NPM Package: [Here](https://www.npmjs.com/package/@primevault/js-api-sdk)

### Generating API user's access public-private key pair
This should be executed in some secure environment and access private key should be stored securely.
The access public key is required when creating a new API user in PrimeVault.

The flow is as follows:
1. Generate a public-private key pair
2. Create a new API user in PrimeVault
3. Get the API key for the new user
4. Set the API key, API URL, and initialize the API client
5. Use the API client to make requests to PrimeVault

```
#### Option 1: PRIVATE_KEY
import {generatePublicPrivateKeyPair} from "@primevault/js-api-sdk";

const response = await generatePublicPrivateKeyPair()
console.log(response)

#### Option 2: AWS_KMS
In the API documentation

```

### Setting up API Client


#### Typescript 
```
import {APIClient} from "@primevault/js-api-sdk";

const apiClient = new APIClient("API_KEY", "API_URL");
```

#### Javascript
```
const { APIClient } = require("@primevault/js-api-sdk");

const apiClient = new APIClient("API_KEY", "API_URL");
```

#### Option 1: PRIVATE_KEY

```
const apiKey = "509bc039-65b5-4200-ac56-4827acc5a1ee" // replace this with the API user's key
const apiUrl = "https://app.primevault.com"

const privateKey = "..."
Config.set("SIGNATURE_SERVICE", "PRIVATE_KEY")

const apiClient = new APIClient(apiKey, apiUrl, privateKey)
```

#### Option 2: AWS_KMS

```
const apiKey = "509bc039-65b5-4200-ac56-4827acc5a1ee" // replace this with the API user's key
const apiUrl = "https://app.primevault.com"
const keyId = '..'  // AWS KMS key Id from Key's detail page

Config.set("SIGNATURE_SERVICE", "AWS_KMS")
Config.set("AWS_REGION", "us-east-1")  // replace this with your region

const apiClient = new APIClient(apiKey, apiUrl, undefined, keyId)
```

### Creating transfer transaction
```
// find the asset and chain
const assets = await apiClient.getAssetsData();
const ethereumAsset = assets.find(
  (asset: Asset) =>
    asset.blockChain === "ETHEREUM" && asset.symbol === "ETH",
);

const sourceVaults = await apiClient.getVaults({
  vaultName: "core-vault-1",
}); // Source Vault

const destinationContacts = await apiClient.getContacts({
  name: "Lynn Bell",
}); // Destination Contact. This could be Core or Exchange Vault id as well.

const sourceId = sourceVaults[0].id;
const destinationId = destinationContacts[0].id;

// Optional fee estimate API which returns the expected fee for different tiers, HIGH, MEDIUM, LOW.
// Default is HIGH. The feeTier is passed in gasParams argument while creating the tranfer transaction.
const feeEstimates = await apiClient.estimateFee({
  sourceId, // source id
  destinationId, // destination id
  amount: "0.0001",
  asset: ethereumAsset.symbol,
  chain: ethereumAsset.blockChain,
});


let txnResponse = await apiClient.createTransferTransaction({
  sourceId,
  destinationId,
  amount: "0.0001",
  asset: ethereumAsset.symbol,
  chain: ethereumAsset.blockChain,
  externalId: "externalId-1",               // Optional externalId to track transactions, should be unique
  gasParams: {},                            // Optional gasParams. Example: {'feeTier': 'MEDIUM'} for medium fee tier. Default is HIGH.
});

while (true) {
    txnResponse = await apiClient.getTransactionById(txnResponse.id)
    if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
        break
    }
    await new Promise(resolve => setTimeout(resolve, 3000))
}
console.log(txnResponse)
```

### Creating contract call transaction

```
const vaults = await apiClient.getVaults({
    vaultName: "core-vault-1",
});

const vaultId = vaults[0].id;

let txnResponse = await apiClient.createContractCallTransaction({
  vaultId,
  chain: "POLYGON",
  messageHex: "0x095ea7b3000000000000000000000000c",                 // Final message/data in hex
  toAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",           // Address of smart contract
  externalId: "externalId-1",                                        // Optional externalId to track transactions, should be unique
});

while (true) {
    txnResponse = await apiClient.getTransactionById(txnResponse.id)
    if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
        break
    }
    await new Promise(resolve => setTimeout(resolve, 3000))
}
console.log(txnResponse)

```

### Creating a new vault
```
const data = {
    "vaultName": "Ethereum Vault",                      // Vault name, should be unique
    "defaultTransferSpendLimit": {                      // Default spend policy for transfer operations
        "action": {                                     // action when the txn exceeds the current spend limit. Options are to ask for more approvals or block txn.
           "actionType": "NEEDS_MORE_APPROVALS",
           "additionalApprovalCount": 1
        },
        "spendLimit": "10000",                          // spend limit amount
        "resetFrequency": "86400",                      // spend limit window, in seconds.
    },
    "defaultTradeSpendLimit": {                         // Default spend limit for trade operations
        "action": {"actionType": "BLOCK_OPERATION"},
        "spendLimit": "100",
        "resetFrequency": "86400", 
    },
}

let vaultResponse = await apiClient.createVault(data);
while (true) {
    vaultResponse = await apiClient.getVaultById(vaultResponse.id);
    if (vaultResponse.walletsGenerated) {
      break
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
}
// vaultResponse.wallets has the wallet addresses.

// balance of a vault
const balances = await apiClient.getBalances(vaultResponse.id);
console.log(balances);

```
