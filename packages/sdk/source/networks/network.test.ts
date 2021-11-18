

import { manifest } from "../../../ark/distribution/manifest.js";
import { FeatureFlag } from "../enums.js";
import { Network } from "./network.js";

let subject: Network;

test.before.each(() => (subject = new Network(manifest, manifest.networks["ark.devnet"])));

it("should have an coin", () => {
    assert.is(subject.coin(), "ARK");
});

it("should have an coin name", () => {
    assert.is(subject.coinName(), "ARK");
});

it("should have an id", () => {
    assert.is(subject.id(), "ark.devnet");
});

it("should have a name", () => {
    assert.is(subject.name(), "Devnet");
});

it("should have a display name", () => {
    assert.is(subject.displayName(), "ARK Devnet");

    jest.spyOn(subject, "isLive").mockReturnValueOnce(true);

    assert.is(subject.displayName(), "ARK");
});

it("should have an explorer", () => {
    assert.is(subject.explorer(), "https://dexplorer.ark.io");
});

it("should have a ticker", () => {
    assert.is(subject.ticker(), "DARK");
});

it("should have a symbol", () => {
    assert.is(subject.symbol(), "DѦ");
});

it("should determine if the network is a live environment", () => {
    assert.is(subject.isLive(), false);
});

it("should determine if the network is a test environment", () => {
    assert.is(subject.isTest(), true);
});

it("should get the expiration type", () => {
    assert.is(subject.expirationType(), "height");
});

it("should allows voting", () => {
    assert.is(subject.allowsVoting(), true);

    subject = new Network(manifest, {
        // @ts-ignore
        "ark.devnet": {
            ...manifest.networks["ark.devnet"],
            governance: {},
        },
    });

    assert.is(subject.allowsVoting(), false);
});

test("#votesAmountStep", () => {
    assert.is(subject.votesAmountStep()), "number");
});

test("#votesAmountMinimum", () => {
    assert.is(subject.votesAmountMinimum()), "number");
});

test("#votesAmountMaximum", () => {
    assert.is(subject.votesAmountMaximum()), "number");
});

it("should get the delegate count", () => {
    assert.is(subject.delegateCount(), 51);

    subject = new Network(manifest, {
        // @ts-ignore
        "ark.devnet": {
            ...manifest.networks["ark.devnet"],
            governance: {},
        },
    });

    assert.is(subject.delegateCount(), 0);
});

it("should get maximum votes per wallet", () => {
    assert.is(subject.maximumVotesPerWallet(), 1);

    subject = new Network(manifest, {
        // @ts-ignore
        "ark.devnet": {
            ...manifest.networks["ark.devnet"],
            governance: {},
        },
    });

    assert.is(subject.maximumVotesPerWallet(), 0);
});

it("should get maximum votes per transaction", () => {
    assert.is(subject.maximumVotesPerTransaction(), 1);

    subject = new Network(manifest, {
        // @ts-ignore
        "ark.devnet": {
            ...manifest.networks["ark.devnet"],
            governance: {},
        },
    });

    assert.is(subject.maximumVotesPerTransaction(), 0);
});

it("should get the delegate identifier", () => {
    assert.is(subject.delegateIdentifier()), "string");
});

it("should determine if the network uses extended public keys", () => {
    assert.is(subject.usesExtendedPublicKey(), false);
});

it("should have an object representation", () => {
    assert.is(subject.toObject()).toMatchInlineSnapshot(`
		Object {
		  "coin": "ARK",
		  "constants": Object {
		    "slip44": 1,
		  },
		  "currency": Object {
		    "decimals": 8,
		    "symbol": "DѦ",
		    "ticker": "DARK",
		  },
		  "explorer": Object {
		    "block": "block/{0}",
		    "transaction": "transaction/{0}",
		    "wallet": "wallets/{0}",
		  },
		  "featureFlags": Object {
		    "Address": Array [
		      "mnemonic.bip39",
		      "multiSignature",
		      "privateKey",
		      "publicKey",
		      "validate",
		      "wif",
		    ],
		    "Client": Array [
		      "transaction",
		      "transactions",
		      "wallet",
		      "wallets",
		      "delegate",
		      "delegates",
		      "votes",
		      "voters",
		      "broadcast",
		    ],
		    "Fee": Array [
		      "all",
		      "calculate",
		    ],
		    "KeyPair": Array [
		      "mnemonic.bip39",
		      "privateKey",
		      "wif",
		    ],
		    "Ledger": Array [
		      "getVersion",
		      "getPublicKey",
		      "signTransaction",
		      "signMessage",
		    ],
		    "Message": Array [
		      "sign",
		      "verify",
		    ],
		    "PrivateKey": Array [
		      "mnemonic.bip39",
		      "wif",
		    ],
		    "PublicKey": Array [
		      "mnemonic.bip39",
		      "multiSignature",
		      "wif",
		    ],
		    "Transaction": Array [
		      "delegateRegistration",
		      "delegateResignation",
		      "estimateExpiration",
		      "htlcClaim",
		      "htlcLock",
		      "htlcRefund",
		      "ipfs.ledgerS",
		      "ipfs.ledgerX",
		      "ipfs.musig",
		      "ipfs",
		      "multiPayment.musig",
		      "multiPayment",
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
		    "WIF": Array [
		      "mnemonic.bip39",
		    ],
		  },
		  "governance": Object {
		    "delegateCount": 51,
		    "votesPerTransaction": 1,
		    "votesPerWallet": 1,
		  },
		  "hosts": Array [
		    Object {
		      "host": "https://ark-test.payvo.com/api",
		      "type": "full",
		    },
		    Object {
		      "host": "https://ark-test-musig.payvo.com",
		      "type": "musig",
		    },
		    Object {
		      "host": "https://dexplorer.ark.io",
		      "type": "explorer",
		    },
		  ],
		  "id": "ark.devnet",
		  "importMethods": Object {
		    "address": Object {
		      "default": false,
		      "permissions": Array [
		        "read",
		      ],
		    },
		    "bip39": Object {
		      "canBeEncrypted": true,
		      "default": true,
		      "permissions": Array [
		        "read",
		        "write",
		      ],
		    },
		    "publicKey": Object {
		      "default": false,
		      "permissions": Array [
		        "read",
		      ],
		    },
		    "secret": Object {
		      "canBeEncrypted": true,
		      "default": false,
		      "permissions": Array [
		        "read",
		        "write",
		      ],
		    },
		  },
		  "knownWallets": "https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
		  "meta": Object {
		    "fastDelegateSync": true,
		  },
		  "name": "Devnet",
		  "transactions": Object {
		    "expirationType": "height",
		    "fees": Object {
		      "ticker": "DARK",
		      "type": "dynamic",
		    },
		    "memo": true,
		    "multiPaymentRecipients": 128,
		    "types": Array [
		      "delegateRegistration",
		      "delegateResignation",
		      "htlcClaim",
		      "htlcLock",
		      "htlcRefund",
		      "ipfs",
		      "multiPayment",
		      "multiSignature",
		      "secondSignature",
		      "transfer",
		      "vote",
		    ],
		  },
		  "type": "test",
		}
	`);
});

it("should have an string representation", () => {
    assert.is(subject.toJson()).toMatchInlineSnapshot(
        `"{\\"coin\\":\\"ARK\\",\\"constants\\":{\\"slip44\\":1},\\"currency\\":{\\"decimals\\":8,\\"symbol\\":\\"DѦ\\",\\"ticker\\":\\"DARK\\"},\\"explorer\\":{\\"block\\":\\"block/{0}\\",\\"transaction\\":\\"transaction/{0}\\",\\"wallet\\":\\"wallets/{0}\\"},\\"featureFlags\\":{\\"Address\\":[\\"mnemonic.bip39\\",\\"multiSignature\\",\\"privateKey\\",\\"publicKey\\",\\"validate\\",\\"wif\\"],\\"Client\\":[\\"transaction\\",\\"transactions\\",\\"wallet\\",\\"wallets\\",\\"delegate\\",\\"delegates\\",\\"votes\\",\\"voters\\",\\"broadcast\\"],\\"Fee\\":[\\"all\\",\\"calculate\\"],\\"KeyPair\\":[\\"mnemonic.bip39\\",\\"privateKey\\",\\"wif\\"],\\"Ledger\\":[\\"getVersion\\",\\"getPublicKey\\",\\"signTransaction\\",\\"signMessage\\"],\\"Message\\":[\\"sign\\",\\"verify\\"],\\"PrivateKey\\":[\\"mnemonic.bip39\\",\\"wif\\"],\\"PublicKey\\":[\\"mnemonic.bip39\\",\\"multiSignature\\",\\"wif\\"],\\"Transaction\\":[\\"delegateRegistration\\",\\"delegateResignation\\",\\"estimateExpiration\\",\\"htlcClaim\\",\\"htlcLock\\",\\"htlcRefund\\",\\"ipfs.ledgerS\\",\\"ipfs.ledgerX\\",\\"ipfs.musig\\",\\"ipfs\\",\\"multiPayment.musig\\",\\"multiPayment\\",\\"multiSignature.ledgerX\\",\\"multiSignature.musig\\",\\"multiSignature\\",\\"secondSignature\\",\\"transfer.ledgerS\\",\\"transfer.ledgerX\\",\\"transfer.musig\\",\\"transfer\\",\\"vote.ledgerS\\",\\"vote.ledgerX\\",\\"vote.musig\\",\\"vote\\"],\\"WIF\\":[\\"mnemonic.bip39\\"]},\\"governance\\":{\\"delegateCount\\":51,\\"votesPerTransaction\\":1,\\"votesPerWallet\\":1},\\"hosts\\":[{\\"host\\":\\"https://ark-test.payvo.com/api\\",\\"type\\":\\"full\\"},{\\"host\\":\\"https://ark-test-musig.payvo.com\\",\\"type\\":\\"musig\\"},{\\"host\\":\\"https://dexplorer.ark.io\\",\\"type\\":\\"explorer\\"}],\\"id\\":\\"ark.devnet\\",\\"importMethods\\":{\\"address\\":{\\"default\\":false,\\"permissions\\":[\\"read\\"]},\\"bip39\\":{\\"canBeEncrypted\\":true,\\"default\\":true,\\"permissions\\":[\\"read\\",\\"write\\"]},\\"publicKey\\":{\\"default\\":false,\\"permissions\\":[\\"read\\"]},\\"secret\\":{\\"canBeEncrypted\\":true,\\"default\\":false,\\"permissions\\":[\\"read\\",\\"write\\"]}},\\"knownWallets\\":\\"https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json\\",\\"meta\\":{\\"fastDelegateSync\\":true},\\"name\\":\\"Devnet\\",\\"transactions\\":{\\"expirationType\\":\\"height\\",\\"fees\\":{\\"ticker\\":\\"DARK\\",\\"type\\":\\"dynamic\\"},\\"memo\\":true,\\"multiPaymentRecipients\\":128,\\"types\\":[\\"delegateRegistration\\",\\"delegateResignation\\",\\"htlcClaim\\",\\"htlcLock\\",\\"htlcRefund\\",\\"ipfs\\",\\"multiPayment\\",\\"multiSignature\\",\\"secondSignature\\",\\"transfer\\",\\"vote\\"]},\\"type\\":\\"test\\"}"`,
    );
});

it("#allows", () => {
    assert.is(subject.allows(FeatureFlag.ClientBroadcast), true);
    assert.is(subject.allows(FeatureFlag.AddressMnemonicBip84), false);

    assert.is(subject.allows(FeatureFlag.TransactionDelegateRegistration), true);
    assert.is(subject.allows(FeatureFlag.TransactionDelegateResignation), true);
    assert.is(subject.allows(FeatureFlag.TransactionHtlcClaim), true);
    assert.is(subject.allows(FeatureFlag.TransactionHtlcLock), true);
    assert.is(subject.allows(FeatureFlag.TransactionHtlcRefund), true);
    assert.is(subject.allows(FeatureFlag.TransactionIpfs), true);
    assert.is(subject.allows(FeatureFlag.TransactionMultiPayment), true);
    assert.is(subject.allows(FeatureFlag.TransactionMultiSignature), true);
    assert.is(subject.allows(FeatureFlag.TransactionSecondSignature), true);
    assert.is(subject.allows(FeatureFlag.TransactionTransfer), true);
    assert.is(subject.allows(FeatureFlag.TransactionVote), true);

    assert.is(subject.allows("randomKey"), false);
});

it("#denies", () => {
    assert.is(subject.denies(FeatureFlag.AddressMnemonicBip84), true);
    assert.is(subject.denies(FeatureFlag.ClientBroadcast), false);
});

it("#chargesStaticFees", () => {
    assert.is(subject.chargesStaticFees()), "boolean");
});

it("#chargesDynamicFees", () => {
    assert.is(subject.chargesDynamicFees()), "boolean");
});

it("#chargesGasFees", () => {
    assert.is(subject.chargesGasFees()), "boolean");
});

it("#chargesWeightFees", () => {
    assert.is(subject.chargesWeightFees()), "boolean");
});

it("#chargesZeroFees", () => {
    assert.is(subject.chargesZeroFees()), "boolean");
});

it("#importMethods", () => {
    assert.is(subject.importMethods()), "object");
});

it("#meta", () => {
    assert.is(subject.meta()), "object");
});

it("#feeType", () => {
    assert.is(subject.feeType(), "dynamic");
});

it("#usesMemo", () => {
    assert.is(subject.usesMemo()), "boolean");
});

it("#usesUTXO", () => {
    assert.is(subject.usesUTXO()), "boolean");
});

it("#usesLockedBalance", () => {
    assert.is(subject.usesLockedBalance()), "boolean");
});

it("#tokens", () => {
    assert.is(subject.tokens()).toBeArray();
});

it("#multiPaymentRecipients", () => {
    assert.is(subject.multiPaymentRecipients()), "number");
});

it("#multiSignatureType", () => {
    assert.is(subject.multiSignatureType()), "string");
});

it("#wordCount", () => {
    assert.is(subject.wordCount(), 24);
});
