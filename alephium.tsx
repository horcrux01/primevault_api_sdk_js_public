import {APIClient, TransactionStatus} from "../src"; // Import the APIClient and types from the SDK @primevault/js-api-sdk

const alephiumContractCall = async (apiClient: APIClient) => {
    const vaults = await apiClient.getVaults({
        vaultName: "DeFi vault",
    });
    const vaultId = vaults[0].id;

    // Calling a contract call on Alephium
    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "ALEPHIUM",
        externalId: "externalId-1",                                      // Optional externalId to track transactions, should be unique
        data: {
            method: "signAndSubmitExecuteScriptTx",
            params: {
                bytecode: "01010300050040350dd12c1700034c180c0d144020a57434c5ee33ad573f7009a9b85827a6ecb71c127cdb04520df19e29451a0600011617010d13c3b1a2bc2ec500002c1702b47a1600a216011602a30d14402000000000000000000000000000000000000000000000000000000000000000000e0d144020a57434c5ee33ad573f7009a9b85827a6ecb71c127cdb04520df19e29451a0600010f184a170c0d144020a57434c5ee33ad573f7009a9b85827a6ecb71c127cdb04520df19e29451a0600011217030d13c3b1a2bc2ec500002c1704b47a1600a216031604a30d14402000000000000000000000000000000000000000000000000000000000000000000e0d144020a57434c5ee33ad573f7009a9b85827a6ecb71c127cdb04520df19e29451a0600010c18",
                tokens: [
                    {
                        "id": "0000000000000000000000000000000000000000000000000000000000000000",
                        "amount": "1000000000000000000",
                    }
                ],
            },
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
