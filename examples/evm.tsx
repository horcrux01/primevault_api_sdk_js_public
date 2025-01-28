import {APIClient, TransactionStatus} from "../src"; // Import the APIClient and types from the SDK @primevault/js-api-sdk

const createContractCall = async (apiClient: APIClient) => {
    const vaults = await apiClient.getVaults({
        vaultName: "core-vault-1",
    });

    const vaultId = vaults[0].id;

    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "POLYGON",
        externalId: "externalId-1",                                        // Optional externalId to track transactions, should be unique
        "data": {
           "callData": "0x095ea7b3000000000000000000000000c36442b4a4522e871399cd717abdd847ab11fe88ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
           "toAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",         // Address of smart contract
        },
    });

    while (true) {
        txnResponse = await apiClient.getTransactionById(txnResponse.id)
        if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
            break
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
    console.log(txnResponse)

}

const rawMessageSignature = async (apiClient: APIClient) => {
    const vaults = await apiClient.getVaults({
        vaultName: "core-vault-1",
    });

    const vaultId = vaults[0].id;

    // Signing a raw message on ETHEREUM
    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "ETHEREUM",
        messageHex: "0x095ea7b3000000000000000000000000c",                 // Final message/data in hex
        externalId: "externalId-1",                                        // Optional externalId to track transactions, should be unique
    });

    while (true) {
        txnResponse = await apiClient.getTransactionById(txnResponse.id)
        if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
            break
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
    console.log(txnResponse.txnSignature)

}
