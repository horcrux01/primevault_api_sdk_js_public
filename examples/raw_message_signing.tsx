import {APIClient, TransactionStatus} from "../src";

const rawMessageSignatureForEVM = async (apiClient: APIClient) => {
    const vaults = await apiClient.getVaults({
        vaultName: "core-vault-1",
    });

    const vaultId = vaults[0].id;

    // Signing a raw message on ETHEREUM
    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "ETHEREUM",
        externalId: "externalId-1",                                        // Optional externalId to track transactions, should be unique
        data: {
            messageHex: "0x095ea7b3000000000000000000000000c"
        }
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


const rawMessageSignatureForNear = async (apiClient: APIClient) => {
    /*
    const { transactions: { Transaction, SCHEMA } } = require('near-api-js');
    const { serialize } = require('borsh');
    const crypto = require('crypto');

    const tx = new Transaction( ... parameters here ... );
    // (Perform any additional processing on the tx object as needed)

    const msg = serialize(SCHEMA, tx);
    // Compute the SHA256 hash of the serialized message
    const hash = crypto.createHash('sha256').update(msg).digest();

    // Optionally, convert the hash to a hexadecimal string if required:
    const messageHex = hash.toString('hex');
    console.log('Transaction hash:', messageHex);
    // messageHex is the hash of the serialized transaction object
    */

    const vaults = await apiClient.getVaults({
        vaultName: "core-vault-1",
    });

    const vaultId = vaults[0].id;

    // Signing a raw message on ETHEREUM
    let txnResponse = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "NEAR",
        externalId: "externalId-1",                                        // Optional externalId to track transactions, should be unique
        data: {
            messageHex: "0x095ea7b3000000000000000000000000c"
        }
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

