---
title: Wallets
---

# Wallets

<x-alert type="info">
These methods are accessible through `profile.wallets()` which exposes a `WalletRepository` instance.
</x-alert>

## Wallet Calls

### Get a list of all wallets with key and value

```typescript
profile.wallets().all();
```

### Get the first listed wallet

```typescript
profile.wallets().first();
```

### Get the last listed wallet

```typescript
profile.wallets().last();
```

### Get a list of all wallets grouped by coin

```typescript
profile.wallets().allByCoin();
```

### Get a list of all wallet keys

```typescript
profile.wallets().keys();
```

### Get a list of all wallet values

```typescript
profile.wallets().values();
```

### Restore a wallet using its wallet data

```typescript
profile.wallets().restore(wallet);
```

### Find the wallet by the given ID

```typescript
profile.wallets().findById("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
```

### Find the wallet for the given address

```typescript
profile.wallets().findByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
```

### Find the wallet for the given public key

```typescript
profile.wallets().findByPublicKey("034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192");
```

### Find all wallets that use the given coin

```typescript
profile.wallets().findByCoin("DARK");
```

### Find all wallets that use the given coin and network

```typescript
profile.wallets().findByCoinWithNetwork("DARK", "ark.devnet");
```

### Find all wallets that use the given alias

```typescript
profile.wallets().findByAlias("Alias");
```

### Update a wallet using a given wallet Id and data

```typescript
profile.wallets().update(newWallet.id(), { alias: "My New Wallet" });
```

### Check that a wallet contains the provided data

```typescript
profile.wallets().has(wallet.id());
```

### Forget a wallet for a given Id

```typescript
profile.wallets().forget("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
```

### Forget all wallets (Use with caution!)

```typescript
profile.wallets().flush();
```

### Get the count of stored wallets

```typescript
profile.wallets().count();
```

### Return all stored wallets as a single object

```typescript
profile.wallets().toObject();
```

### Generate a new wallet

```typescript
await profile.walletFactory().generate({ ... });
```

### Create a new wallet from an mnemonic with BIP39 derivation

```typescript
await profile.walletFactory().fromMnemonicWithBIP39({ ... });
```

### Create a new wallet from an mnemonic with BIP44 derivation

```typescript
await profile.walletFactory().fromMnemonicWithBIP44({ ... });
```

### Create a new wallet from an mnemonic with BIP49 derivation

```typescript
await profile.walletFactory().fromMnemonicWithBIP49({ ... });
```

### Create a new wallet from an mnemonic with BIP84 derivation

```typescript
await profile.walletFactory().fromMnemonicWithBIP84({ ... });
```

### Create a new wallet from an address

```typescript
await profile.walletFactory().fromAddress({ ... });
```

### Create a new wallet from a public key

```typescript
await profile.walletFactory().fromPublicKey({ ... });
```

### Create a new wallet from a private key

```typescript
await profile.walletFactory().fromPrivateKey({ ... });
```

### Create a new wallet from an address and derivation path (Ledger)

```typescript
await profile.walletFactory().fromAddressWithDerivationPath({ ... });
```

### Create a new wallet from a secret (non-BIP39 passphrase)

```typescript
await profile.walletFactory().fromSecret({ ... });
```

### Create a new wallet from a WIF (Wallet Import Format)

```typescript
await profile.walletFactory().fromWIF({ ... });
```

## API Calls

<x-alert type="info">
The following methods are accessible through `profile.wallets()` and provide a means of interacting with the underlying coin.
</x-alert>

### API Options

```typescript
// ClientPagination
cursor?: string | number;
limit?: number;
orderBy?: string;

// ClientTransactionsInput
address?: string;
addresses?: string[];
senderId?: string;
recipientId?: string;
walletId?: string;
senderPublicKey?: string;
recipientPublicKey?: string;
asset?: Record<string, any>;
type?: number;
typeGroup?: number;

// ClientWalletsInput
address?: string;
addresses?: string[];
publicKey?: string;
username?: string;
```

### List all transactions that a wallet has sent or received

```typescript
await wallet.transactions({ limit: 15 });
```

### List all transactions that a wallet has sent

```typescript
await wallet.sentTransactions({ limit: 100 });
```

### List all transactions that a wallet received

```typescript
await wallet.receivedTransactions({ });
```

### Get information about a wallet from the network

```typescript
await wallet.wallet("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
```

### Get a list of wallets from the network that match the given criteria

```typescript
await wallet.wallets({ ... });
```

### Get information about a delegate from the network

```typescript
await wallet.delegate("genesis_1");
```

### Get a list of delegates from the network that match the given criteria

```typescript
await wallet.delegates({ ... });
```

### List all votes that a wallet cast

```typescript
await wallet.votes("034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192");
```

### List all voters that a wallet has

```typescript
await wallet.voters("genesis_1");
```

### Broadcast all of the given transactions

```typescript
await wallet.client().broadcast([transaction, transaction, transaction]);
```

## Transactions

### Create a new transfer transaction

```typescript
await wallet.transaction().signTransfer(input, options);
```

### Create a new second signature transaction

```typescript
await wallet.transaction().signSecondSignature(input, options);
```

### Create a new delegate registration transaction

```typescript
await wallet.transaction().signDelegateRegistration(input, options);
```

### Create a new vote transaction

```typescript
await wallet.transaction().signVote(input, options);
```

### Create a new multi signature transaction

```typescript
await wallet.transaction().signMultiSignature(input, options);
```

### Create a new ipfs transaction

```typescript
await wallet.transaction().signIpfs(input, options);
```

### Create a new multi payment transaction

```typescript
await wallet.transaction().signMultiPayment(input, options);
```

### Create a new delegate resignation transaction

```typescript
await wallet.transaction().signDelegateResignation(input, options);
```

### Create a new htlc lock transaction

```typescript
await wallet.transaction().signHtlcLock(input, options);
```

### Create a new htlc claim transaction

```typescript
await wallet.transaction().signHtlcClaim(input, options);
```

### Create a new htlc refund transaction

```typescript
await wallet.transaction().signHtlcRefund(input, options);
```

### Create a new unlock token transaction

```typescript
await wallet.transaction().signUnlockToken(input, options);
```

## Messages

### Message options

```typescript
// MessageInput
message: string;
mnemonic: string;

// SignedMessage
message: string;
signatory: string;
signature: string;
mnemonic?: string;
```

### Sign a new message

```typescript
await wallet.message().sign(input);
```

### Verify an existing message

```typescript
await wallet.message().verify(input);
```

## Ledger

### Get the version from ledger

```typescript
await wallet.ledger().getVersion();
```

### Get a public key from ledger

```typescript
await wallet.ledger().getPublicKey(path);
```

### Sign a transaction with ledger

```typescript
await wallet.ledger().signTransaction(path, serializedTx);
```

### Sign a message with ledger

```typescript
await wallet.ledger().signMessage(path, asciiMessage);
```

## Links

### Get an explorer link for a block

```typescript
await wallet.link().block(id);
```

### Get an explorer link for a transaction

```typescript
await wallet.link().transaction(id);
```

### Get an explorer link for a wallet

```typescript
await wallet.link().wallet(id);
```
