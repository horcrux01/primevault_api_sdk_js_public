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
const apiUrl = "https://api.primevault.com"

const privateKey = "..."
Config.set("SIGNATURE_SERVICE", "PRIVATE_KEY")

const apiClient = new APIClient(apiKey, apiUrl, privateKey)
```

#### Option 2: AWS_KMS

```
const apiKey = "509bc039-65b5-4200-ac56-4827acc5a1ee" // replace this with the API user's key
const apiUrl = "https://api.primevault.com"
const keyId = '..'  // AWS KMS key Id from Key's detail page

Config.set("SIGNATURE_SERVICE", "AWS_KMS")
Config.set("AWS_REGION", "us-east-1")  // replace this with your region

const apiClient = new APIClient(apiKey, apiUrl, undefined, keyId)
```

### Cursor Pagination
All list endpoints use cursor-based pagination. Pass `cursor` to iterate through results.

```typescript
// Fetch first page
const response = await apiClient.getTransactions({}, 20);
console.log(response.results);

// Fetch next page using the cursor from the previous response
if (response.has_next) {
  const nextResponse = await apiClient.getTransactions({}, 20, response.next_cursor);
  console.log(nextResponse.results);
}

// Iterate through all pages
let cursor: string | null = null;
const allItems: Vault[] = [];
while (true) {
  const res = await apiClient.getVaults({}, 50, cursor);
  allItems.push(...res.results);
  if (!res.has_next) break;
  cursor = res.next_cursor;
}

// With filters
const contacts = await apiClient.getContacts({ blockChain: "ETHEREUM" }, 10);
```

### Examples
Code examples [here](https://github.com/horcrux01/primevault_api_sdk_js_public/tree/main/examples)
