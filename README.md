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

### Examples

SubOrg creation and cursor-based listing are available through `createSubOrg` and
`getSubOrgs`; see [the SubOrg example](examples/sub_org.tsx). Creation requires
only `name` and creates an end-user SubOrg with `MANAGED` control mode.
Supplying `controlMode` in a create request is rejected by the API.
The API user must be ADMIN or OWNER to create or list SubOrgs. Creation requires
organization-wide access; end-user admins and owners can list only their own
SubOrg. The response includes `id`,
`orgId`, `name`, `controlMode`, `createdAt`, `updatedAt`, `isDeleted`, and `version`.
The optional `name` filter uses case-insensitive SQL patterns (`%Acme%` for a
substring match). List responses include `results`, `nextCursor`, and `hasNext`.

Code examples [here](https://github.com/horcrux01/primevault_api_sdk_js_public/tree/main/examples)
