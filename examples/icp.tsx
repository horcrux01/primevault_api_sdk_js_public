import {APIClient, TransactionStatus} from "../src"; // Import the APIClient and types from the SDK @primevault/js-api-sdk

const icpCanisterCallTransaction = async (apiClient: APIClient) => {
    const vaults = await apiClient.getVaults({
        vaultName: "DeFi vault",
    });
    const vaultId = vaults[0].id;

    // Calling a canister on ICP Chain
    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "ICP",
        toAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",                         // Canister address
        externalId: "externalId-16",                                      // Optional externalId to track transactions, should be unique
        data: {
            canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
            method: "icrc2_approve",
            arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICt4gQAAAEKAAAAAAFgYdUBAQA=",
        }
    });

    // wait for transaction to complete
    while (true) {
        txnResponse = await apiClient.getTransactionById(txnResponse.id)
        if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
            break
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
    console.log(txnResponse.output)
}

const rawMessageSignature = async (apiClient: APIClient) => {
    const vaults = await apiClient.getVaults({
        vaultName: "DeFi vault",
    });
    const vaultId = vaults[0].id;

    // Signing a raw message on ICP Chain
    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "ICP",
        messageHex: "65",                 // Final message/data in hex
        externalId: "externalId-12",     // Optional externalId to track transactions, should be unique
    });

    // wait for transaction to complete
    while (true) {
        txnResponse = await apiClient.getTransactionById(txnResponse.id)
        if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED) {
            break
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
    console.log(txnResponse.txnSignature)
}
