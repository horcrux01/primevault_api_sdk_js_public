import {
    APIClient,
    Transaction,
    TransactionStatus,
    TransferPartyType,
} from "../src"; // Import the APIClient and types from the SDK @primevault/js-api-sdk

const pollForTransaction = async (apiClient: APIClient, transactionId: string) => {
    // instead of polling, you can setup webhooks to get notified when the transaction is completed or failed.
    while (true) {
        const txnResponse: Transaction = await apiClient.getTransactionById(transactionId)
        if (txnResponse.status === TransactionStatus.COMPLETED || txnResponse.status === TransactionStatus.FAILED || txnResponse.status === TransactionStatus.DECLINED) {
            return txnResponse
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
}

// A Stellar vault can receive a token only after its account exists on chain and the
// account has opted in to that token. XLM itself needs neither step.
const activateStellarAsset = async (apiClient: APIClient) => {
    const fundingVaultsResponse = await apiClient.getVaults({vaultName: "core-vault-1"});     // a vault that already holds XLM
    const stellarVaultsResponse = await apiClient.getVaults({vaultName: "stellar-vault-1"});  // the vault to activate
    const vaultId = stellarVaultsResponse.results[0].id;

    // Step 1: bring the vault's Stellar account on chain by sending it XLM. Stellar locks
    // 1 XLM for the account and 0.5 XLM for every token enabled on it, so send enough for
    // both plus a small buffer for fees. Skip this step if the vault already holds XLM.
    const funding = await apiClient.createTransactionWithApproval({
        source: {type: TransferPartyType.VAULT, id: fundingVaultsResponse.results[0].id},
        destination: {type: TransferPartyType.VAULT, id: vaultId},
        amount: "2",
        asset: "XLM",
        chain: "STELLAR",                             // "STELLAR_TESTNET" on testnet
        externalId: "stellar-fund-1",                 // Optional externalId to track transactions, should be unique
    });
    await pollForTransaction(apiClient, funding.id);

    // Step 2: opt the account in to USDC. Built-in symbols (USDC, USDT) work as they are;
    // any other token has to be whitelisted in the app as CODE:ISSUER first, then enabled
    // here by its symbol. The transaction follows the vault's approval policy.
    const activation = await apiClient.createContractCallTransaction({
        vaultId,
        chain: "STELLAR",
        externalId: "stellar-activate-usdc-1",        // Optional externalId to track transactions, should be unique
        data: {activateAsset: "USDC"} as any,         // ContractCallData has no Stellar activation member yet
    });
    const txnResponse = await pollForTransaction(apiClient, activation.id);
    console.log(txnResponse.status, txnResponse.txHash);

    // To have another Stellar vault pay the network fee, post the request directly, since
    // createContractCallTransaction does not forward feePayer. The client still signs it.
    await apiClient.post("/api/external/transactions/", {
        vaultId,
        blockChain: "STELLAR",
        category: "CONTRACT_CALL",
        data: {activateAsset: "USDT"},
        externalId: "stellar-activate-usdt-1",
        feePayer: {id: fundingVaultsResponse.results[0].id},  // needs about 0.0002 XLM free
    });
}
