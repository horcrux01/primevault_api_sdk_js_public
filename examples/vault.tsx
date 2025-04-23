import {APIClient, BalanceResponse, Vault} from "../src";
import {BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, TooManyRequestsError, InternalServerError} from "../src/baseApiClient";

const createVault = async (apiClient: APIClient) => {
    const data = {
        "vaultName": "Ethereum Vault",                      // Vault name, should be unique
        "templateId": "b188813e-3137-4b91-8534-f494cb198b8a", // Template to use for this vault
        "chains": ["ETHEREUM", "SOLANA"]
    }

    let vaultResponse: Vault | null = null;
    try {
        vaultResponse = await apiClient.createVault(data);
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            console.error("Invalid vault creation request:", error.message, error.responseText);
        } else if (error instanceof UnauthorizedError) {
            console.error("Authentication error when creating vault:", error.message);
        } else if (error instanceof ForbiddenError) {
            console.error("Permission denied for vault creation:", error.message);
        } else if (error instanceof NotFoundError) {
            console.error("Resource not found for vault creation:", error.message);
        } else if (error instanceof TooManyRequestsError) {
            console.error("Rate limit exceeded for vault creation:", error.message);
            console.log("Please wait before retrying");
        } else if (error instanceof InternalServerError) {
            console.error("Server error during vault creation:", error.message);
        } else {
            console.error("Error creating vault:", error);
        }
        return; // Exit if vault creation fails
    }

    // Check if vaultResponse exists before proceeding
    if (!vaultResponse) {
        console.error("Vault creation failed, cannot proceed.");
        return;
    }

    const vaultId = vaultResponse.id; // Store the id safely

    // Wait for wallet generation to complete
    while (true) {
        vaultResponse = await apiClient.getVaultById(vaultId);
        if (vaultResponse.walletsGenerated) {
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // vaultResponse.wallets has the wallet addresses.
    console.log("Vault created successfully with wallets:", vaultResponse.wallets);

    // balance of a vault
    const balances: BalanceResponse = await apiClient.getBalances(vaultId);
    console.log("Vault balances:", balances);
}

const getDetailedBalance = async (apiClient: APIClient) => {
    const response = await apiClient.getDetailedBalances('7ad54443-21d2-4075-abef-83758c9dceb7')
    console.log('response', response);
}
