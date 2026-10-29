import {APIClient, Transaction, TransactionStatus, TransferPartyData, TransferPartyType} from "../src"; // Import the APIClient and types from the SDK @primevault/js-api-sdk

const pollForTransaction = async (apiClient: APIClient, transactionId: string) => {
    let txnResponse: Transaction;
    while (true) {
        txnResponse = await apiClient.getTransactionById(transactionId)
        if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
            break
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
    return txnResponse;
}

const activateStellarAsset = async (apiClient: APIClient) => {
    /*
    A Stellar vault holds XLM by default. Before it can hold an issued asset such as USDC,
    the asset must be activated (a trustline is added) on the vault. Stellar keeps 0.5 XLM
    in the vault for each activated asset; a fee payer vault can only cover the network fee.
    */
    const vaults = await apiClient.getVaults({
        vaultName: "stellar-vault-1",
    });
    const vaultId = vaults.results[0].id;

    // Optional: another Stellar vault in the organization pays the network fee.
    const feePayerVaults = await apiClient.getVaults({
        vaultName: "fee-payer-1",
    });

    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "STELLAR",                                                // use "STELLAR_TESTNET" for testnet vaults
        externalId: "externalId-stellar-activation-1",                   // Optional externalId to track transactions, should be unique
        data: {
            activateAsset: "USDC",
        },
        feePayer: { id: feePayerVaults.results[0].id },                 // Optional, must be a different vault than vaultId
    });
    console.log(txnResponse.subCategory);                              // ACTIVATION

    txnResponse = await pollForTransaction(apiClient, txnResponse.id);
    console.log(txnResponse);
}

const createStellarTransfer = async (apiClient: APIClient) => {
    const sourceVaults = await apiClient.getVaults({
        vaultName: "stellar-vault-1",
    });
    const feePayerVaults = await apiClient.getVaults({
        vaultName: "fee-payer-1",
    });

    // The destination account must exist and, for issued assets like USDC, have the asset activated.
    const source: TransferPartyData = { type: TransferPartyType.VAULT, id: sourceVaults.results[0].id };
    const destination: TransferPartyData = {
        type: TransferPartyType.EXTERNAL_ADDRESS,
        value: "GCACGH7OUW47CNHU2ARUFWFJU5PEZXDISMMYX6MLIVV5XKX4BGQG4U4N",
    };

    let txnResponse = await apiClient.createTransferTransaction({
        source,
        destination,
        amount: "1",
        asset: "USDC",
        chain: "STELLAR",
        externalId: "externalId-stellar-transfer-1",
        feePayer: { id: feePayerVaults.results[0].id },                 // Optional
    });

    txnResponse = await pollForTransaction(apiClient, txnResponse.id);
    console.log(txnResponse);
}
