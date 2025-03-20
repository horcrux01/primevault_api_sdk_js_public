import {
    APIClient,
    Asset,
    Contact,
    Transaction,
    TransactionStatus,
    TransferPartyData,
    TransferPartyType,
    Vault
} from "../src"; // Import the APIClient and types from the SDK @primevault/js-api-sdk

const createTransfer = async (apiClient: APIClient) => {
    // find the asset. Here, we are looking for ETH on ETHEREUM
    const assets: Asset[] = await apiClient.getAssetsData();
    const ethereumAsset: Asset = assets.find(
        (asset: Asset) =>
            asset.blockChain === "ETHEREUM" && asset.symbol === "ETH",
    )!;

    // Get source and destinations
    const sourceVaults: Vault[] = await apiClient.getVaults({
        vaultName: "core-vault-1",
    }); // Source Vault

    const destinationContacts: Contact[] = await apiClient.getContacts({
        name: "Brandi Taylor",
    });  // Destination Contact. This could be Core or Exchange Vault or External address.

    const source: TransferPartyData = { type: TransferPartyType.VAULT, id: sourceVaults[0].id};
    const destination: TransferPartyData = { type: TransferPartyType.CONTACT, id: destinationContacts[0].id};
    /*
     To send the transaction to an external non-whitelisted address, change the type and set the value
     const destination: TransferPartyData = { type: TransferPartyType.EXTERNAL_ADDRESS, value: '0x123456789..'};
    */

    /*
      [Optional Step]: fee estimate API which returns the expected fee for different tiers, HIGH, MEDIUM, LOW.
      Default is HIGH. The feeTier is passed in gasParams argument while creating the transfer transaction.
    */
    const feeEstimates = await apiClient.estimateFee({
        source, // source id
        destination, // destination id
        amount: "0.0001",
        asset: ethereumAsset.symbol,
        chain: ethereumAsset.blockChain,
    });
    console.log(feeEstimates);

    let txnResponse: Transaction = await apiClient.createTransferTransaction({
        source,
        destination,
        amount: "0.0001",
        asset: ethereumAsset.symbol,
        chain: ethereumAsset.blockChain,
        externalId: "externalId-1",               // Optional externalId to track transactions, should be unique
        gasParams: {},                            // Optional gasParams. Example: {'feeTier': 'MEDIUM'} for medium fee tier. Default is HIGH.
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

const expectedGasForTransfer = async (apiClient: APIClient) => {
    const source = {id: "7ad54443-21d2-4075-abef-83758c9dceb7", type: TransferPartyType.VAULT}
    const destination = {id: "ee177fd8-d00e-4c55-9966-36fcbfdce123", type: TransferPartyType.VAULT}

    const response = await apiClient.estimateFee({
        chain: "SOLANA",
        source: source,
        destination: destination,
        amount: "0.0001",
        asset: "USDT"
    });
    console.log(response);
}
