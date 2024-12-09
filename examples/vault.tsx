import {APIClient, BalanceResponse, Vault} from "../src";


const createVault = async (apiClient: APIClient) => {
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

    let vaultResponse: Vault = await apiClient.createVault(data);
    while (true) {
        vaultResponse = await apiClient.getVaultById(vaultResponse.id);
        if (vaultResponse.walletsGenerated) {
            break
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    // vaultResponse.wallets has the wallet addresses.

    // balance of a vault
    const balances: BalanceResponse = await apiClient.getBalances(vaultResponse.id);
    console.log(balances);
}
