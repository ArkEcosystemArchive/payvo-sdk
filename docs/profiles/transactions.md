---
title: Transactions
---

# Transactions

## List transactions for a profile

The `TransactionAggregate` acts like a self-paginating set of data by keeping track of the history. Every time you call the `transactions`, `sentTransactions` or `receivedTransactions` method the last responses will be stored based on the wallet ID and the next time you call those methods again it will retrieve the next page. If you want to reset the history you can call `profile.transactionAggregate().flush()` and start calling the methods again to retrieve fresh data.

```typescript
const firstPage = await profile.transactionAggregate().transactions();
const secondPage = await profile.transactionAggregate().transactions();
const thirdPage = await profile.transactionAggregate().transactions();
```

## List transactions for a wallet

```typescript
const response = await wallet.transactions({ limit: 15 });

if (response.hasMore()) {
    // This will automatically advanced to the next page of every wallet with a limit of 15.
    const nextPage = await wallet.transactions({ limit: 15 });
}
```

## Sign and broadcast a transaction through a wallet

```typescript
// 1. Sign and store the ID
const transactionId = await wallet.transaction().signTransfer({
    sign: {
        mnemonic: "this is a top secret passphrase",
    },
    data: {
        amount: "1",
        to: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
    },
});

// 2. Broadcast with the ID from signing
await wallet.transaction().broadcast(transactionId);

// 3. Periodically check if the transaction has been confirmed
await wallet.transaction().transaction(transactionId).hasBeenConfirmed();
```

## Sign and broadcast a transaction with multi-signature with 2 participants

<x-alert type="warning">
You should always ensure to call `wallet.syncIdentity()` before trying to sign transactions.
</x-alert>

```typescript
// This is the initial transaction without any signatures.
const transactionId = await wallet.transaction().signTransfer({
    nonce: "1",
    from: "DRsenyd36jRmuMqqrFJy6wNbUwYvoEt51y",
    sign: {
        multiSignature: wallet.multiSignature(),
    },
    data: {
        amount: "1",
        to: "DRsenyd36jRmuMqqrFJy6wNbUwYvoEt51y",
        memo: "Sent from SDK",
    },
});

// Broadcast the transaction without any signatures.
await wallet.transaction().broadcast(transactionId);

// Add the first signature and re-broadcast the transaction.
await wallet.transaction().addSignature(transactionId, "FIRST_PASSPHRASE");

// Add the second signature and re-broadcast the transaction.
await wallet.transaction().addSignature(transactionId, "SECOND_PASSPHRASE");

// Sync all of the transactions from the Multi-Signature Server and check the state of each.
await wallet.transaction().sync();

// Broadcast the multi signature.
await wallet.transaction().broadcast(transactionId);
```

## Sign and broadcast a multi-signature registration with 3 participants

<x-alert type="warning">
You should always ensure to call `wallet.syncIdentity()` before trying to sign transactions.
</x-alert>

```typescript
// This is the initial transaction without any signatures.
const transactionId = await wallet.transaction().signMultiSignature({
    nonce: "2",
    from: "AH3Ca9QE9u9jKKTdUaLjAQqcqK4ZmSkVqp,
    sign: {
        multiSignature: {
            publicKeys:[
                "0205d9bbe71c343ac9a6a83a4344fd404c3534fc7349827097d0835d160bc2b896",
                "03df0a1eb42d99b5de395cead145ba1ec2ea837be308c7ce3a4e8018b7efc7fdb8",
                "03860d76b1df09659ac282cea3da5bd84fc45729f348a4a8e5f802186be72dc17f"
            ],
            min: 3,
        }
    },
    data: {
        publicKeys:[
            "0205d9bbe71c343ac9a6a83a4344fd404c3534fc7349827097d0835d160bc2b896",
            "03df0a1eb42d99b5de395cead145ba1ec2ea837be308c7ce3a4e8018b7efc7fdb8",
            "03860d76b1df09659ac282cea3da5bd84fc45729f348a4a8e5f802186be72dc17f"
        ],
        min: 3,
        senderPublicKey: "0205d9bbe71c343ac9a6a83a4344fd404c3534fc7349827097d0835d160bc2b896",
    },
});

await activeWallet.transaction().broadcast(transactionId);

// Add the first signature and re-broadcast the transaction.
await activeWallet.transaction().addSignature(transactionId, "FIRST_PASSPHRASE");

// Sync all of the transactions from the Multi-Signature Server and check the state of each.
await activeWallet.transaction().sync();

// Add the second signature and re-broadcast the transaction.
await activeWallet.transaction().addSignature(transactionId, "SECOND_PASSPHRASE");

// Sync all of the transactions from the Multi-Signature Server and check the state of each.
await activeWallet.transaction().sync();

// Add the third signature and re-broadcast the transaction.
await activeWallet.transaction().addSignature(transactionId, "THIRD_PASSPHRASE");

// Sync all of the transactions from the Multi-Signature Server and check the state of each.
await activeWallet.transaction().sync();

// Add the final signature by signing the whole transaction with the signatures of all participants.
await activeWallet.transaction().addSignature(transactionId, "FIRST_PASSPHRASE");

// Sync all of the transactions from the Multi-Signature Server and check the state of each.
await activeWallet.transaction().sync();

// Broadcast the multi signature.
await activeWallet.transaction().broadcast(transactionId);
```

## Check what signatures a Multi-Signature Transaction or Registration is awaiting

<x-alert type="warning">
If both of the below examples are true the transaction is ready to be broadcast.
</x-alert>

```typescript
// Needs the signature of the currently active wallet.
wallet.transaction().isAwaitingOurSignature(transactionId);

// Needs the signatures of other wallets.
wallet.transaction().isAwaitingOtherSignatures(transactionId);
```
