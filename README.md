# PrimeVault's API SDK

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
const response = await generatePublicPrivateKeyPair()
console.log(response)

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
}); // source

const destinationContacts = await apiClient.getContacts({
  name: "Lynn Bell",
}); // destination

const sourceId = sourceVaults[0].id;
const destinationId = destinationContacts[0].id;

// Optional fee estimate API which returns the expected fee for different tiers, HIGH, MEDIUM, LOW.
// Default is HIGH
const feeEstimates = await apiClient.estimateFee(
    sourceId,  // source id
    destinationId,  // destination id
    "0.0001",
    ethereumAsset.symbol,
    ethereumAsset.blockChain
)

let txnResponse = await apiClient.createTransferTransaction(
    sourceId,
    destinationId,
    "0.0001",
    ethereumAsset.symbol,
    ethereumAsset.blockChain,
    {},                                        // optional gasParams. Example: {'feeTier': 'MEDIUM'} for medium fee tier. Default is HIGH
    "externalId-1",                            // external id to track txns. Should be unique.
);

while (true) {
    txnResponse = apiClient.getTransactionById(txnResponse.id)
    if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
        break
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
}
console.log(txnResponse)
```

### Creating contract call transaction

```
const vaults = await apiClient.getVaults({
    vaultName: "core-vault-1",
});

const vaultId = vaults[0].id;

let txnResponse = await apiClient.createContractCallTransaction(
    vaultId,
    "POLYGON",
    "0x095ea7b3000000000000000000000000c",               // Final message/data in hex
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",        // Address of smart contract
    undefined,                                           // Optional amount     
    "externalId-1",                                      // Optional externalId
);

while (true) {
    txnResponse = apiClient.getTransactionById(txnResponse.id)
    if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
        break
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    vaultResponse = apiClient.getVaultById(vaultResponse.id);
    if (vaultResponse.walletsGenerated) {
      break
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
}
// vaultResponse.wallets has the wallet addresses.
```
