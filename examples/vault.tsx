import {APIClient, BalanceResponse, Vault} from "../src";


const createVault = async (apiClient: APIClient) => {
    const data = {
        "vaultName": "Ethereum Vault",                      // Vault name, should be unique
        "templateId": "b188813e-3137-4b91-8534-f494cb198b8a", // Template to use for this vault
        "chains": ["ETHEREUM", "SOLANA"]
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
