# SDK Development Guide

The Payvo SDK provides all the boilerplate and structures you need to integrate your blockchain into Payvo products. This guide will provide in-depth explanations as to what you will need to do, how to do it, and what limitations and gotchas there are that need to be kept in mind when developing your integration.

## Requirements & Limitations

All Payvo products that interact with the SDK do so in 2 ways. These interactions either occur directly through code like when integrated into products like wallets or through a JSON-RPC server. Interactions directly through code occur when the project is developed in JavaScript or TypeScript, like Payvo Wallet. If the project is developed in PHP then the interactions will occur through the JSON-RPC server, like Payvo ID. It is important to keep this in mind when developing your integration because you need to make sure that everything works with the latest node.js version and can be serialized for HTTP responses.

In addition to those restrictions, you'll also need to keep in mind that your integration will be part of the Payvo Wallet, which uses Electron. Electron has support for node.js modules but some things can degrade the user experience significantly. An example of this is BIP38 encryption which is intentionally slow and very resource hungry. This results in the UI getting stuck when it is performed and can only be resolved by moving it into another thread like the main process. Doing this would require work outside of the SDK and defeat the purpose of every coin being able to handle all of its interactions on its own inside the package it lives in. An alternative approach for such situations is to use a different encryption algorithm like PBKDF2 which is more lightweight but also offers a high degree of security.

Besides local resource consumption, you should also keep network traffic in mind. Not everyone lives in places that have access to unlimited high-speed internet which allows you to be more lenient with how many requests you send to retrieve data. This affects both the amount of data you are trying to retrieve and the number of requests it takes to do so. For example with Bitcoin and Ethereum it can take up to 3 API calls each to get all relevant information about a wallet, like nonce, balance, and public key. With more modern blockchains this can usually be done in a single API call that has all of the information you need to construct an in-memory wallet. In cases like this, it might make sense to provide a server that acts as a middleman which wraps all of those calls into a single call, at least from the point of view of the client. They'll only have to send a single request from their device and your server can more efficiently send concurrent requests without wasting the bandwidth of the client. It can probably also do it faster because people affected by low-speed internet are also more likely to have worse hardware.

## Getting Started

Integrating a new blockchain into the Payvo SDK is a fairly straightforward process but there are a few things to keep in mind to provide an integration that follows best practices and recommendations to ensure consistent behavior for clients. Following the best practices and recommendations made in the following sections is essential to providing an implementation that requires low maintenance.

### Recommendations

- **Don't pull in your own cryptography dependencies.** This sounds like an absolute statement but there are exceptions. Our [cryptography](https://github.com/PayvoHQ/cryptography) package provides a lot of utilities for working with base58, base64, bip32, bip38, bip39, bip44 and many more. Unless you need very customized versions of those implementations you should use this package for the consistency, compatibility, and performance benefits it provides.
- **Don't pull in your own HTTP client dependencies.** The SDK requires dependencies like key-value storage and HTTP client to be passed in during instantiation. This means all coins have access to an HTTP client without having to implement one themselves and they shouldn't. Each client has different needs which means the HTTP client implementations will also differ so trust the client to do handle the HTTP requests as they see fit.

## Networks

**TBD**: *(Explain what network manifests are and what they do)*

## Services

Services are what make the SDK tick. They are responsible for fetching information from a network and handle all of the cryptography to allow the creation of data that can be processed by a blockchain. All of the services come with an abstract base implementation which will save you some time when implementing a service. These abstract boilerplates have a default implementation of every method that will throw an exception to indicate that the method has not been implemented. If your blockchain supports a method then you should overwrite it and throw exceptions when invalid input is provided or invalid output is produced.

> We won't go into much detail about how to implements these services but instead talk about the general idea and what should be kept in mind. There are over a dozen of blockchains that have been integrated into the SDK that can be used as a reference for a variety of different approaches and solutions.

### Address

The Address service is responsible for deriving addresses from mnemonics, public keys, and multi-signature aggregates. The primary use of this service is for when users import wallets or new wallets are generated with random mnemonics.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/address.contract.ts) and apply it to an implementation, we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/address.service.ts).

- The `fromMnemonic` method should derive an address from a BIP39-compliant mnemonic. **Any non-compliant value should throw an exception.**
- The `fromMultiSignature` method should derive an address from a number of participants and their public keys. **If your blockchain does not support MuSig you should not implement this method.**
- The `fromPublicKey` method should derive an address from a public key. **If your blockchain has legacy public keys because of a change in the signature algorithm you should handle them or throw an exception.**
- The `fromPrivateKey` method should derive an address from a private key. **If your blockchain has legacy private keys because of a change in the signature algorithm you should handle them or throw an exception.**
- The `fromSecret` method should derive an address from a string that is not compliant with BIP39. **Any BIP39-compliant value should throw an exception.**
- The `fromWIF` method should derive an address from a WIF. **Before deriving an address you should validate that the WIF version matches the network.**
- The `validate` method should validate an address. **If your blockchain uses bech32(m) you should ensure that the prefix matches.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/address.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods produce the same output with the same input, every single time. **Use an [identity fixture](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/test/fixtures/identity.ts) to ensure you are testing against a known set of keys.**
- Ensure that `fromMnemonic` throws an exception if the mnemonic is not compliant with BIP39.
- Ensure that `fromSecret` throws an exception if the secret is compliant with BIP39.
- Ensure that unsupported methods throw a `NotImplemented` exception.

### Client

The Client service is responsible for communication between the client and network. This includes retrieving the state of wallets, listing transactions, and broadcasting transactions.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/client.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/client.service.ts).

- The `transaction` method should return a `ConfirmedTransactionData` instance that contains information about a transaction by its ID.
- The `transactions` method should return a `ConfirmedTransactionDataCollection` instance that contains information about all transactions that match the given parameters.
- The `wallet` method should return a `WalletData` instance that contains information about a wallet by its address or public key.
- The `wallets` method should return a `WalletDataCollection` instance that contains information about all wallets that match the given parameters.
- The `delegate` method should return a `WalletData` instance that contains information about a delegate by its address, publicKey, or username.
- The `delegates` method should return a `WalletDataCollection` instance that contains information about all delegates that match the given parameters.
- The `votes` method should return a `VoteReport` instance that contains a list of votes cast by a wallet by its ID.
- The `voters` method should return a `WalletDataCollection` instance that contains a list of all voters for a given wallet.
- The `unlockableBalances` method should return a `UnlockTokenResponse` instance that contains information about all locked funds and when they can be released.
- The `broadcast` method should return a `BroadcastResponse` instance that contains information about a transaction by its ID.

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/transaction.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods produce the same output with the same input, every single time. **Use an [identity fixture](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/test/fixtures/identity.ts) to ensure you are testing against a known set of keys.**
- Ensure that `broadcast` is tested for both local and remote failures. The reason why a transaction fails to be broadcast isn't always a network issue so make sure you handle local issues like type mismatches.
- Ensure that unsupported methods throw a `NotImplemented` exception.

### Fee

The Fee service is responsible for retrieving and calculating fees. The calculation of fees can be quite complex and be reliant on the state of the blockchain so a client needs a way of performing this calculation.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/fee.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/fee.service.ts).

- The `all` method should return a `TransactionFees` instance which contains the minimum, average and maximum values for fees based on type. **If there are no type-specific fees you should return the same value for every type.**
- The `calculate` method should calculate and return the fee for a transaction. **If your blockchain uses static or dynamic fees then this method should not be implemented.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/fee.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that `all` and `calculate` throw an exception if the network request to retrieve fees fails. You can use `nock` to simulate network request issues.
- Ensure that `calculate` produces the same fees as other applications you know to support this feature for your blockchain.
- Ensure that `calculate` throw an exception if a transaction type has a static fee.
- Ensure that unsupported methods throw an `NotImplemented` exception.

### Key-Pair

The Key-Pair service is responsible for deriving public and private keys. *This service is basically a combination of the public and private key services.*

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/key-pair.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/key-pair.service.ts).

- The `fromMnemonic` method should derive a key-pair from a BIP39-compliant mnemonic. **Any non-compliant value should throw an exception.**
- The `fromPrivateKey` method should derive a key-pair from a private key. **If your blockchain has legacy private keys because of a change in the signature algorithm you should handle them or throw an exception.**
- The `fromSecret` method should derive a key-pair from a string that is not compliant with BIP39. **Any BIP39-compliant value should throw an exception.**
- The `fromWIF` method should derive a key-pair from a WIF. **Before deriving a key-pair you should validate that the WIF version matches the network.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/key-pair.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods produce the same output with the same input, every single time. **Use an [identity fixture](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/test/fixtures/identity.ts) to ensure you are testing against a known set of keys.**
- Ensure that `fromMnemonic` throws an exception if the mnemonic is not compliant with BIP39.
- Ensure that `fromSecret` throws an exception if the secret is compliant with BIP39.
- Ensure that unsupported methods throw an `NotImplemented` exception.

### Known Wallets

The Known Wallets service is responsible for identifying publicly known wallets like exchanges. This is only a nice-to-have for users and serves no critical functionality.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/known-wallets.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/known-wallets.service.ts).

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/known-wallets.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that unsupported methods throw an `NotImplemented` exception.

### Ledger

The Ledger service is responsible for all interactions with a Ledger Hardware Wallet. This includes derivation and signing of transactions and is limited to 1 device at a time.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/ledger.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/ledger.service.ts).

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/ledger.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that unsupported methods throw an `NotImplemented` exception.

**Test Fixtures**:

Preparing test fixtures for Ledger can be a non-trivial task, but essentially involves wrapping a serialized transaction into an [APDU](https://wikipedia.org/wiki/Smart_card_application_protocol_data_unit) payload.

Visit the [Core Transfer](https://ark.dev/docs/core/transactions/types/transfer) page to see the structure of a serialized ARK transaction. You can further examine the ARK Ledger Transport's [test fixtures](https://github.com/ArkEcosystem/ledger-transport/blob/c7d67ed0a52929699d45cf828747de57cacd650b/__tests__/__fixtures__/transport-fixtures.ts) and [APDU constants](https://github.com/ArkEcosystem/ledger-transport/blob/c7d67ed0a52929699d45cf828747de57cacd650b/src/apdu.ts#L5-#L66) to get an idea of how serialized transactions should be wrapped.

### Link

The Link service is responsible for generating links to view data on an explorer. This only applies to blocks, transactions, and wallets and should use the most popular explorer.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/link.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/link.service.ts).

- The `block` method should generate a `https` URL to an explorer to view information about a block by its ID.
- The `transaction` method should generate a `https` URL to an explorer to view information about a transaction by its ID.
- The `wallet` method should generate a `https` URL to an explorer to view information about a wallet by its ID.

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/link.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods generate URLs with `https` to ensure secure communication between the client and server.
- Ensure that all methods generate URLs that respond with status code 200 or 301. Any other status indicates that the user won't reach it easily or at all.
- Ensure that no methods throw a `NotImplemented` exception. All methods have to be implemented to allow a client to display the correct information.

### Message

The Message service is responsible for signing and verifying messages. These messages are anything the user wants to sign and serves no critical functionality.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/message.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/message.service.ts).

- The `sign` method should cryptographically sign a message to produce a signature.
- The `verify` method should cryptographically compare a message, signature, and signatory for its validity.

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/message.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that `sign` handles all possible signatories that your blockchain supports. Meaning mnemonic or secret or whatever else you support that fits into constraints of the SDK.
- Ensure that `verify` returns `false` for all kinds of malfunctions. This ensures that the client doesn't have to manually catch exceptions to invalidate a message.
- Ensure that unsupported methods throw an `NotImplemented` exception.

### Multi-Signature

The Multi-Signature service is responsible for determining the state of multi-signature transactions. Depending on the state that the user interface on the client-side will be altered.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/multi-signature.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/multi-signature.service.ts).

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/multi-signature.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that unsupported methods throw an `NotImplemented` exception.

### Private Key

The Private Key service is responsible for deriving private keys. This is the starting point for most other derivations.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/private-key.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/private-key.service.ts).

- The `fromMnemonic` method should derive a private key from a BIP39-compliant mnemonic. **Any non-compliant value should throw an exception.**
- The `fromSecret` method should derive a private key from a string that is not compliant with BIP39. **Any BIP39-compliant value should throw an exception.**
- The `fromWIF` method should derive a private key from a WIF. **Before deriving a private key you should validate that the WIF version matches the network.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/private-key.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods produce the same output with the same input, every single time. **Use an [identity fixture](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/test/fixtures/identity.ts) to ensure you are testing against a known set of keys.**
- Ensure that `fromMnemonic` throws an exception if the mnemonic is not compliant with BIP39.
- Ensure that `fromSecret` throws an exception if the secret is compliant with BIP39.
- Ensure that unsupported methods throw an `NotImplemented` exception.

### Public Key

The Public Key service is responsible for deriving public keys.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/public-key.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/public-key.service.ts).

- The `fromMnemonic` method should derive a public key from a BIP39-compliant mnemonic. **Any non-compliant value should throw an exception.**
- The `fromMultiSignature` method should derive a public key from a number of participants and their public keys. **If your blockchain does not support MuSig you should not implement this method.**
- The `fromSecret` method should derive a public key from a string that is not compliant with BIP39. **Any BIP39-compliant value should throw an exception.**
- The `fromWIF` method should derive a public key from a WIF. **Before deriving a public key you should validate that the WIF version matches the network.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/public-key.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods produce the same output with the same input, every single time. **Use an [identity fixture](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/test/fixtures/identity.ts) to ensure you are testing against a known set of keys.**
- Ensure that `fromMnemonic` throws an exception if the mnemonic is not compliant with BIP39.
- Ensure that `fromSecret` throws an exception if the secret is compliant with BIP39.
- Ensure that unsupported methods throw an `NotImplemented` exception.

### Transaction

The Transaction service is responsible for signing transactions.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/transaction.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/transaction.service.ts).

- The `transfer` method should return a `SignedTransactionData` instance that contains a signed payload for a transfer transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `secondSignature` method should return a `SignedTransactionData` instance that contains a signed payload for a second signature transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `delegateRegistration` method should return a `SignedTransactionData` instance that contains a signed payload for a delegate registration transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `vote` method should return a `SignedTransactionData` instance that contains a signed payload for a vote transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `multiSignature` method should return a `SignedTransactionData` instance that contains a signed payload for a MuSig transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `ipfs` method should return a `SignedTransactionData` instance that contains a signed payload for an IPFS transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `multiPayment` method should return a `SignedTransactionData` instance that contains a signed payload for a multi payment transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `delegateResignation` method should return a `SignedTransactionData` instance that contains a signed payload for a delegate resignation transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `htlcLock` method should return a `SignedTransactionData` instance that contains a signed payload for a HTLC lock transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `htlcClaim` method should return a `SignedTransactionData` instance that contains a signed payload for a HTLC claim transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `htlcRefund` method should return a `SignedTransactionData` instance that contains a signed payload for a HTLC refund transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `unlockToken` method should return a `SignedTransactionData` instance that contains a signed payload for an unlock token transaction. **If your blockchain does not support this transaction type you should not implement it.**
- The `estimateExpiration` method should return a `string` that indicates the estimated expiration of a transaction. **This can be a height, timestamp, nonce, or whatever other indicators you use for expiration on your blockchain. If your blockchain does not have the concept of expiration you should not implement it.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/transaction.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods throw exceptions if invalid input is provided or required input is missing. **What is required and what is optional depends on the blockchain so it's your job to handle this part.**
- Ensure that all signatories are handled. If you don't support signing with a specific type of signatory you should throw an exception.
- Ensure that unsupported methods throw an `NotImplemented` exception.

### WIF

The WIF service is responsible for deriving WIFs.

**Implementation**:

If we take the [implementation contract](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/services/wif.contract.ts) and apply it to an implementation we can [use ARK as an example](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/wif.service.ts).

- The `fromMnemonic` method should derive a WIF from a BIP39-compliant mnemonic. **Any non-compliant value should throw an exception.**
- The `fromPrivateKey` method should derive a WIF from a private key. **If your blockchain has legacy private keys because of a change in the signature algorithm you should handle them or throw an exception.**
- The `fromSecret` method should derive a WIF from a string that is not compliant with BIP39. **Any BIP39-compliant value should throw an exception.**

**Testing**:

Testing the service is fairly straightforward and an example can be seen [here](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/wif.service.test.ts) but we'll outline what you should keep in mind when writing tests.

- Ensure that all methods produce the same output with the same input, every single time. **Use an [identity fixture](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/test/fixtures/identity.ts) to ensure you are testing against a known set of keys.**
- Ensure that `fromMnemonic` throws an exception if the mnemonic is not compliant with BIP39.
- Ensure that `fromSecret` throws an exception if the secret is compliant with BIP39.
- Ensure that unsupported methods throw an `NotImplemented` exception.

## Data Transfer Objects (DTOs)

The Payvo SDK exposes a variety of Data Transfer Objects *(referred to as DTO from here on)* to normalize data that is passed around between the SDK and the client. This is important so that we can give the client some guarantees as to what the data will look like when working with the SDK. Without those guarantees, a lot of work would be deferred to the client and result in inconsistent implementations.

### Confirmed Transaction

The `ConfirmedTransactionData` DTO is responsible for normalizing and exposing confirmed transactions that have been retrieved through an API call. This is the most complex DTO the SDK exposes because it is responsible for determining the types of transactions and normalize data depending on the type. ARK for example supports transferring funds to multiple people in a single transaction which means the `amount` method will have to either use a flat amount for a single-recipient transfer or aggregate all payment amounts for a multi-recipient transfer. The same applies to the list of recipients because they will be in different formats depending on if the transfer was for multiple recipients or not.

**Relevant**:

- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/confirmed-transaction.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/confirmed-transaction.ts)
- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/confirmed-transaction.contract.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/confirmed-transaction.contract.ts)
- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/transaction.dto.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/transaction.dto.ts)

### Signed Transaction

The `SignedTransactionData` DTO is one of the most transient objects in the SDK. Its only purpose is to be created and broadcast. This generally happens in seconds because it will be created, its data be presented to a user for confirmation, and finally be broadcast. This object holds two different objects, them being the signed data and the data that should be broadcast. These can be different depending on the coin because the signed data is the payload that the user signed but the broadcast data for ETH for example is the hex representation of the signed data.

Implementing this DTO is fairly straightforward and the SDK provides an `AbstractSignedTransactionData` class to save you the hassle of implementing dozens of methods over and over again. We won't go into much detail here because you can take a look at existing implementations but let's take a quick look at what the most important properties and their tasks are. The `this.signedData` property should always be an object which you use to determine transaction types, the direction of a transaction, the participants, and amounts. The `this.broadcastData` property should never be manually used as it will only need to be called by the SDK internally to broadcast the transaction. This property has varying types because some blockchains expect transactions to be broadcast as a hex string and others expect a JSON payload.

**Relevant**:

- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/signed-transaction.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/signed-transaction.ts)
- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/signed-transaction.contract.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/signed-transaction.contract.ts)
- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/signed-transaction.dto.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/signed-transaction.dto.ts)

### Wallet

The `WalletData` DTO is responsible for normalizing and exposing the data that represents the state of an account on the blockchain. Modern blockchains expose all relevant information fairly easily but for older systems like Bitcoin, this process is more involved which means how you implement this DTO will depend on your blockchain. With Bitcoin for example you'll end up with a lot of API calls to gather all balances and UTXO for a single account so you end up aggregating all of that data in memory after receiving it. An alternative approach would be to create a server that does the aggregating for you based on an extended public key. There are many ways you could solve such an issue, but in the end, it all comes down to a mix of efficiency for the end-user and simplicity for your developers.

**Relevant**:

- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/wallet.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/dto/wallet.ts)
- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/contracts.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/contracts.ts)
- [https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/wallet.dto.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/wallet.dto.ts)

## Packaging

Once you've implemented all of the [services](/docs/sdk/development/services) and [data transfer objects](/docs/sdk/development/dto), you're probably wondering how to package it all up to be ready for a release. There are a few things to keep in mind for your package to flawlessly work when used by the SDK.

### Exporting Service Provider

The service provider is what will be executed to create an instance of your implementation. This class should be used to do everything that needs to be done to prepare your coin to be usable. With ARK, for example, we need to [retrieve configurations from the blockchain network](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/coin.provider.ts#L20-L47) while Zilliqa doesn't require any extra work which means we can just [construct the instance](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-zil/source/coin.provider.ts#L6-L8) and move on. **Use [this](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-zil/source/coin.provider.ts) as an example and store it in the `coin.provider.ts` file of your package.**

### Exporting Everything

Now that we've prepared all working parts that need to be exported we can organize them and export the whole construct. **Use [this](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/index.ts) as an example and store it in the `index.ts` file of your package.** Ensure that the name of the export reflects the name of your primary ticker. For ARK the primary ticker is `ARK` because it can be traded on exchanges while `DARK` is the secondary ticker because it is the testnet token.
