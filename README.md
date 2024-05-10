# PrimeVault's API SDK

### Generating API user's access public-private key pair

```
#### Option 1: PRIVATE_KEY
const response = await generatePublicPrivateKeyPair()
console.log(response)

#### Option 2: AWS_KMS
"""
Here the private key is managed by AWS KMS.
Set up AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment before executing this.
"""
const response = generate_aws_kms_key_pair()
```

### Setting up API Client

```
const apiKey = "509bc039-65b5-4200-ac56-4827acc5a1ee" # replace this with the API user's key
const apiUrl = "https://app.primevault.com"

const privateKey = "..."
Config.set("SIGNATURE_SERVICE", "PRIVATE_KEY")

const apiClient = new APIClient(apiKey, apiUrl, privateKey)
```

### Creating transfer transaction
```
sourceVaultResponse = apiClient.get(f"/api/external/vaults/?vaultName=all-wallets-1")  # source

destinationContactResponse = apiClient.get(
    f"/api/external/contacts/?name=Karen Christian"
)  # destination

source_id = sourceVaultResponse["results"][0]["id"]
destination_id = destinationContactResponse["results"][0]["id"]

const response = apiClient.createTransferTransaction(
                    source_id,
                    destination_id,
                    "0.0001",
                    "ETH",
                    "ETHEREUM")

while True:
    transaction = apiClient.getTransactionById(transaction["id"])
    if transaction["status"] == "COMPLETED":
        break
    // sleep(5)
```

