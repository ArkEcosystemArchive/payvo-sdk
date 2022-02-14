# Specification

## Contracts

Each coin follows a strict implementation contract. All of these contracts can be found at the following links.

- [Coins](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/coins/contracts.ts)
- [Markets](https://github.com/PayvoHQ/markets/tree/master/source/contracts)
- [DTO](https://github.com/PayvoHQ/sdk/tree/master/packages/sdk/source/dto)

## Network Manifest

Each coin follows a strict implementation contract which can be incomplete for certain coins due to how they work or a lack of features. The missing or unsupported methods will throw exceptions and to avoid unwanted surprised we need a way of letting consumers of the SDK know that calling a certain method will lead to an exception.

### Example

Let's take the `sdk-ark` network manifest as an example. It contains some information like the name and ticker, but the important part is the `featureFlags` object. This object contains all supported services and methods.

```typescript
import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "ark.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "ARK",
	currency: {
		ticker: "ARK",
		symbol: "Ѧ",
		decimals: 8,
	},
	constants: {
		slip44: 111,
	},
	hosts: [
		{
			type: "full",
			host: "https://ark-live.payvo.com/api",
		},
		{
			type: "musig",
			host: "https://ark-live-musig.payvo.com",
		},
		{
			type: "explorer",
			host: "https://explorer.ark.io",
		},
	],
	governance: {
		delegateCount: 51,
		votesPerWallet: 1,
		votesPerTransaction: 1,
	},
	transactions,
	importMethods,
	featureFlags,
	explorer,
	knownWallets: "https://raw.githubusercontent.com/ArkEcosystem/common/master/mainnet/known-wallets-extended.json",
	meta: {
		fastDelegateSync: true,
	},
};

export default network;
```

> [packages/sdk-ark/source/networks/ark.mainnet.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/networks/ark.mainnet.ts)

---

```typescript
import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
    expirationType: "height",
    types: [
        "delegate-registration",
        "delegate-resignation",
        "htlc-claim",
        "htlc-lock",
        "htlc-refund",
        "ipfs",
        "multi-payment",
        "multi-signature",
        "second-signature",
        "transfer",
        "vote",
    ],
    fees: {
        type: "dynamic",
        ticker: "ARK",
    },
    memo: true,
};

export const importMethods: Networks.NetworkManifestImportMethods = {
    address: {
        default: false,
        permissions: ["read"],
    },
    bip39: {
        default: true,
        permissions: ["read", "write"],
    },
    publicKey: {
        default: false,
        permissions: ["read"],
    },
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
    Client: [
        "transaction",
        "transactions",
        "wallet",
        "wallets",
        "delegate",
        "delegates",
        "votes",
        "voters",
        "configuration",
        "fees",
        "syncing",
        "broadcast",
    ],
    Fee: ["all"],
    Identity: [
        "address.mnemonic.bip39",
        "address.multiSignature",
        "address.privateKey",
        "address.publicKey",
        "address.validate",
        "address.wif",
        "keyPair.mnemonic.bip39",
        "keyPair.privateKey",
        "keyPair.wif",
        "privateKey.mnemonic.bip39",
        "privateKey.wif",
        "publicKey.mnemonic.bip39",
        "publicKey.multiSignature",
        "publicKey.wif",
        "wif.mnemonic.bip39",
    ],
    Ledger: ["getVersion", "getPublicKey", "signTransaction", "signMessage"],
    Link: ["block", "transaction", "wallet"],
    Message: ["sign", "verify"],
    Transaction: [
        "delegateRegistration",
        "delegateResignation",
        "ipfs.ledgerS",
        "ipfs.ledgerX",
        "ipfs.musig",
        "ipfs",
        "multiPayment.ledgerS",
        "multiPayment.ledgerX",
        "multiPayment.musig",
        "multiPayment",
        "multiSignature.ledgerS",
        "multiSignature.ledgerX",
        "multiSignature.musig",
        "multiSignature",
        "secondSignature",
        "transfer.ledgerS",
        "transfer.ledgerX",
        "transfer.musig",
        "transfer",
        "vote.ledgerS",
        "vote.ledgerX",
        "vote.musig",
        "vote",
    ],
};

export const explorer: Networks.NetworkManifestExplorer = {
    block: "block/{0}",
    transaction: "transaction/{0}",
    wallet: "wallets/{0}",
};
```

> [packages/sdk-ark/source/networks/shared.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk-ark/source/networks/shared.ts)

---

### Checking for Supported Feature Flags

In the case of ARK it would be unsafe to call `HDWallet.fromMnemonic(identity.mnemonic, { bip84: { account: 0 } })` because it would lead to an exception due to a lack of support for this specific way of retrieving a key-pair. Knowing that there is a lack of support for this feature before we even try to call the method will allow us to safe-guard our application against any unexpected behaviors for a certain coin.

A given coin's network may be checked for supported features using the following pattern as an example:

```typescript
network.allows(FeatureFlag.IdentityAddressMnemonicBip84);
```

---

### Available Feature Flags

Below is a list of all currently-available feature flags.

```typescript
export enum FeatureFlag {
	AddressMnemonicBip39 = "Address.mnemonic.bip39",
	AddressMnemonicBip44 = "Address.mnemonic.bip44",
	AddressMnemonicBip49 = "Address.mnemonic.bip49",
	AddressMnemonicBip84 = "Address.mnemonic.bip84",
	AddressMultiSignature = "Address.multiSignature",
	AddressPrivateKey = "Address.privateKey",
	AddressPublicKey = "Address.publicKey",
	AddressSecret = "Address.secret",
	AddressValidate = "Address.validate",
	AddressWif = "Address.wif",
	ClientBroadcast = "Client.broadcast",
	ClientDelegate = "Client.delegate",
	ClientDelegates = "Client.delegates",
	ClientTransaction = "Client.transaction",
	ClientTransactions = "Client.transactions",
	ClientVoters = "Client.voters",
	ClientVotes = "Client.votes",
	ClientWallet = "Client.wallet",
	ClientWallets = "Client.wallets",
	FeeAll = "Fee.all",
	FeeCalculate = "Fee.calculate",
	KeyPairMnemonicBip39 = "KeyPair.mnemonic.bip39",
	KeyPairMnemonicBip44 = "KeyPair.mnemonic.bip44",
	KeyPairMnemonicBip49 = "KeyPair.mnemonic.bip49",
	KeyPairMnemonicBip84 = "KeyPair.mnemonic.bip84",
	KeyPairPrivateKey = "KeyPair.privateKey",
	KeyPairSecret = "KeyPair.secret",
	KeyPairWif = "KeyPair.wif",
	LedgerGetPublicKey = "Ledger.getPublicKey",
	LedgerGetVersion = "Ledger.getVersion",
	LedgerSignMessage = "Ledger.signMessage",
	LedgerSignTransaction = "Ledger.signTransaction",
	MessageSign = "Message.sign",
	MessageVerify = "Message.verify",
	PeerSearch = "Peer.search",
	PrivateKeyMnemonicBip39 = "PrivateKey.mnemonic.bip39",
	PrivateKeyMnemonicBip44 = "PrivateKey.mnemonic.bip44",
	PrivateKeyMnemonicBip49 = "PrivateKey.mnemonic.bip49",
	PrivateKeyMnemonicBip84 = "PrivateKey.mnemonic.bip84",
	PrivateKeySecret = "PrivateKey.secret",
	PrivateKeyWif = "PrivateKey.wif",
	PublicKeyMnemonicBip39 = "PublicKey.mnemonic.bip39",
	PublicKeyMnemonicBip44 = "PublicKey.mnemonic.bip44",
	PublicKeyMnemonicBip49 = "PublicKey.mnemonic.bip49",
	PublicKeyMnemonicBip84 = "PublicKey.mnemonic.bip84",
	PublicKeyMultiSignature = "PublicKey.multiSignature",
	PublicKeySecret = "PublicKey.secret",
	PublicKeyWif = "PublicKey.wif",
	TransactionDelegateRegistration = "Transaction.delegateRegistration",
	TransactionDelegateRegistrationLedgerS = "Transaction.delegateRegistration.ledgerS",
	TransactionDelegateRegistrationLedgerX = "Transaction.delegateRegistration.ledgerX",
	TransactionDelegateResignation = "Transaction.delegateResignation",
	TransactionDelegateResignationLedgerS = "Transaction.delegateResignation.ledgerS",
	TransactionDelegateResignationLedgerX = "Transaction.delegateResignation.ledgerX",
	TransactionHtlcClaim = "Transaction.htlcClaim",
	TransactionHtlcClaimLedgerS = "Transaction.htlcClaim.ledgerS",
	TransactionHtlcClaimLedgerX = "Transaction.htlcClaim.ledgerX",
	TransactionHtlcLock = "Transaction.htlcLock",
	TransactionHtlcLockLedgerS = "Transaction.htlcLock.ledgerS",
	TransactionHtlcLockLedgerX = "Transaction.htlcLock.ledgerX",
	TransactionHtlcRefund = "Transaction.htlcRefund",
	TransactionHtlcRefundLedgerS = "Transaction.htlcRefund.ledgerS",
	TransactionHtlcRefundLedgerX = "Transaction.htlcRefund.ledgerX",
	TransactionIpfs = "Transaction.ipfs",
	TransactionIpfsLedgerS = "Transaction.ipfs.ledgerS",
	TransactionIpfsLedgerX = "Transaction.ipfs.ledgerX",
	TransactionMultiPayment = "Transaction.multiPayment",
	TransactionMultiPaymentLedgerS = "Transaction.multiPayment.ledgerS",
	TransactionMultiPaymentLedgerX = "Transaction.multiPayment.ledgerX",
	TransactionMultiSignature = "Transaction.multiSignature",
	TransactionMultiSignatureLedgerS = "Transaction.multiSignature.ledgerS",
	TransactionMultiSignatureLedgerX = "Transaction.multiSignature.ledgerX",
	TransactionSecondSignature = "Transaction.secondSignature",
	TransactionSecondSignatureLedgerS = "Transaction.secondSignature.ledgerS",
	TransactionSecondSignatureLedgerX = "Transaction.secondSignature.ledgerX",
	TransactionTransfer = "Transaction.transfer",
	TransactionTransferLedgerS = "Transaction.transfer.ledgerS",
	TransactionTransferLedgerX = "Transaction.transfer.ledgerX",
	TransactionUnlockToken = "Transaction.unlockToken",
	TransactionUnlockTokenLedgerS = "Transaction.unlockToken.ledgerS",
	TransactionUnlockTokenLedgerX = "Transaction.unlockToken.ledgerX",
	TransactionVote = "Transaction.vote",
	TransactionVoteLedgerS = "Transaction.vote.ledgerS",
	TransactionVoteLedgerX = "Transaction.vote.ledgerX",
	WifMnemonicBip39 = "WIF.mnemonic.bip39",
	WifMnemonicBip44 = "WIF.mnemonic.bip44",
	WifMnemonicBip49 = "WIF.mnemonic.bip49",
	WifMnemonicBip84 = "WIF.mnemonic.bip84",
	WifSecret = "WIF.secret",
}
```

> [packages/sdk/source/enums.ts](https://github.com/PayvoHQ/sdk/blob/master/packages/sdk/source/enums.ts)
