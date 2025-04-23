import {
  AptosConfig,
  Network,
  Aptos,
  generateSigningMessageForTransaction,
  TransactionAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  SignedTransaction,
  postAptosFullNode,
  MimeType,
} from '@aptos-labs/ts-sdk';

import { TransactionStatus, APIClient } from '@primevault/js-api-sdk';

async function aptosTransfer(apiClient: APIClient) {
  // Step 1: Initialize the Aptos client with Testnet network configuration
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  // Step 2: Build a simple token transfer transaction (can be replaced with any DeFi or contract interaction)
  const transaction = await aptos.transaction.build.simple({
    sender:
      '0xc4c9366532c5e5ba59824ced6803cd2efd450f292a1d27399873c7b5c6a36b7b',
    data: {
      function: '0x1::aptos_account::transfer',
      functionArguments: [
        '0xa39432a064608b1ec3855e28b19c6978239eb7d2639bb8de1c544cd2e8e73226',
        1,
      ],
    },
  });

  // Generate message to be signed and convert to hex format for PrimeVault API
  const signingMessage = generateSigningMessageForTransaction(transaction);
  const signingMessageHex = Buffer.from(signingMessage).toString('hex');

  // Step 3: Send transaction to PrimeVault for signing and poll until the signing process completes
  let txnResponse = await apiClient.createContractCallTransaction({
    vaultId: '73e65d1e-4270-4ff3-8f1a-4dd03a2af8b0', // replace the vault ID
    chain: 'APTOS_TESTNET',
    data: { messageHex: signingMessageHex },
  });
  while (true) {
    txnResponse = await apiClient.getTransactionById(txnResponse.id);
    if (
      txnResponse.status === TransactionStatus.COMPLETED ||
      txnResponse.status === TransactionStatus.FAILED
    ) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Step 4: Create signed transaction with Ed25519 authenticator and submit to Aptos network
  const txnAuthenticator = new TransactionAuthenticatorEd25519(
    new Ed25519PublicKey(
      '0cfaa6b73e9b38aa174b9d7536d1344c86d5ea39730c1beed46bbc43c46a5e6d'
    ), // replace the public key
    new Ed25519Signature(txnResponse.txnSignature)
  );

  const signedTransaction = new SignedTransaction(
    transaction.rawTransaction,
    txnAuthenticator
  ).bcsToBytes();
  const { data } = await postAptosFullNode({
    aptosConfig: config,
    body: signedTransaction,
    path: 'transactions',
    originMethod: 'submitTransaction',
    contentType: MimeType.BCS_SIGNED_TRANSACTION,
  });
  const submittedTransaction = data;
  console.log(`Submitted transaction hash: ${submittedTransaction.hash}`);

  // Step 5: Wait for transaction execution and retrieve final transaction status
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: submittedTransaction.hash,
  });
  console.log(executedTransaction);
}
