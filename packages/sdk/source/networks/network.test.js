

import { manifest } from "../../../ark/distribution/manifest";
import { FeatureFlag } from "../enums";
import { Network } from "./network";

let subject: Network;

test.before.each(() => (subject = new Network(manifest, manifest.networks["ark.devnet"])));

test("should have an coin", () => {
    assert.is(subject.coin(), "ARK");
});

test("should have an coin name", () => {
    assert.is(subject.coinName(), "ARK");
});

test("should have an id", () => {
    assert.is(subject.id(), "ark.devnet");
});

test("should have a name", () => {
    assert.is(subject.name(), "Devnet");
});

test("should have a display name", () => {
    assert.is(subject.displayName(), "ARK Devnet");

    jest.spyOn(subject, "isLive").mockReturnValueOnce(true);

    assert.is(subject.displayName(), "ARK");
});

test("should have an explorer", () => {
    assert.is(subject.explorer(), "https://dexplorer.ark.io");
});

test("should have a ticker", () => {
    assert.is(subject.ticker(), "DARK");
});

test("should have a symbol", () => {
    assert.is(subject.symbol(), "DѦ");
});

test("should determine if the network is a live environment", () => {
    assert.is(subject.isLive(), false);
});

test("should determine if the network is a test environment", () => {
    assert.is(subject.isTest(), true);
});

test("should get the expiration type", () => {
    assert.is(subject.expirationType(), "height");
});

test("should allows voting", () => {
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

test("should get the delegate count", () => {
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

test("should get maximum votes per wallet", () => {
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

test("should get maximum votes per transaction", () => {
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

test("should get the delegate identifier", () => {
    assert.is(subject.delegateIdentifier()), "string");
});

test("should determine if the network uses extended public keys", () => {
    assert.is(subject.usesExtendedPublicKey(), false);
});

test("should have an object representation", () => {
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

test("should have an string representation", () => {
    assert.is(subject.toJson()).toMatchInlineSnapshot(
        `"{\\"coin\\":\\"ARK\\",\\"constants\\":{\\"slip44\\":1},\\"currency\\":{\\"decimals\\":8,\\"symbol\\":\\"DѦ\\",\\"ticker\\":\\"DARK\\"},\\"explorer\\":{\\"block\\":\\"block/{0}\\",\\"transaction\\":\\"transaction/{0}\\",\\"wallet\\":\\"wallets/{0}\\"},\\"featureFlags\\":{\\"Address\\":[\\"mnemonic.bip39\\",\\"multiSignature\\",\\"privateKey\\",\\"publicKey\\",\\"validate\\",\\"wif\\"],\\"Client\\":[\\"transaction\\",\\"transactions\\",\\"wallet\\",\\"wallets\\",\\"delegate\\",\\"delegates\\",\\"votes\\",\\"voters\\",\\"broadcast\\"],\\"Fee\\":[\\"all\\",\\"calculate\\"],\\"KeyPair\\":[\\"mnemonic.bip39\\",\\"privateKey\\",\\"wif\\"],\\"Ledger\\":[\\"getVersion\\",\\"getPublicKey\\",\\"signTransaction\\",\\"signMessage\\"],\\"Message\\":[\\"sign\\",\\"verify\\"],\\"PrivateKey\\":[\\"mnemonic.bip39\\",\\"wif\\"],\\"PublicKey\\":[\\"mnemonic.bip39\\",\\"multiSignature\\",\\"wif\\"],\\"Transaction\\":[\\"delegateRegistration\\",\\"delegateResignation\\",\\"estimateExpiration\\",\\"htlcClaim\\",\\"htlcLock\\",\\"htlcRefund\\",\\"ipfs.ledgerS\\",\\"ipfs.ledgerX\\",\\"ipfs.musig\\",\\"ipfs\\",\\"multiPayment.musig\\",\\"multiPayment\\",\\"multiSignature.ledgerX\\",\\"multiSignature.musig\\",\\"multiSignature\\",\\"secondSignature\\",\\"transfer.ledgerS\\",\\"transfer.ledgerX\\",\\"transfer.musig\\",\\"transfer\\",\\"vote.ledgerS\\",\\"vote.ledgerX\\",\\"vote.musig\\",\\"vote\\"],\\"WIF\\":[\\"mnemonic.bip39\\"]},\\"governance\\":{\\"delegateCount\\":51,\\"votesPerTransaction\\":1,\\"votesPerWallet\\":1},\\"hosts\\":[{\\"host\\":\\"https://ark-test.payvo.com/api\\",\\"type\\":\\"full\\"},{\\"host\\":\\"https://ark-test-musig.payvo.com\\",\\"type\\":\\"musig\\"},{\\"host\\":\\"https://dexplorer.ark.io\\",\\"type\\":\\"explorer\\"}],\\"id\\":\\"ark.devnet\\",\\"importMethods\\":{\\"address\\":{\\"default\\":false,\\"permissions\\":[\\"read\\"]},\\"bip39\\":{\\"canBeEncrypted\\":true,\\"default\\":true,\\"permissions\\":[\\"read\\",\\"write\\"]},\\"publicKey\\":{\\"default\\":false,\\"permissions\\":[\\"read\\"]},\\"secret\\":{\\"canBeEncrypted\\":true,\\"default\\":false,\\"permissions\\":[\\"read\\",\\"write\\"]}},\\"knownWallets\\":\\"https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json\\",\\"meta\\":{\\"fastDelegateSync\\":true},\\"name\\":\\"Devnet\\",\\"transactions\\":{\\"expirationType\\":\\"height\\",\\"fees\\":{\\"ticker\\":\\"DARK\\",\\"type\\":\\"dynamic\\"},\\"memo\\":true,\\"multiPaymentRecipients\\":128,\\"types\\":[\\"delegateRegistration\\",\\"delegateResignation\\",\\"htlcClaim\\",\\"htlcLock\\",\\"htlcRefund\\",\\"ipfs\\",\\"multiPayment\\",\\"multiSignature\\",\\"secondSignature\\",\\"transfer\\",\\"vote\\"]},\\"type\\":\\"test\\"}"`,
    );
});

test("#allows", () => {
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

test("#denies", () => {
    assert.is(subject.denies(FeatureFlag.AddressMnemonicBip84), true);
    assert.is(subject.denies(FeatureFlag.ClientBroadcast), false);
});

test("#chargesStaticFees", () => {
    assert.is(subject.chargesStaticFees()), "boolean");
});

test("#chargesDynamicFees", () => {
    assert.is(subject.chargesDynamicFees()), "boolean");
});

test("#chargesGasFees", () => {
    assert.is(subject.chargesGasFees()), "boolean");
});

test("#chargesWeightFees", () => {
    assert.is(subject.chargesWeightFees()), "boolean");
});

test("#chargesZeroFees", () => {
    assert.is(subject.chargesZeroFees()), "boolean");
});

test("#importMethods", () => {
    assert.is(subject.importMethods(), "object");
});

test("#meta", () => {
    assert.is(subject.meta(), "object");
});

test("#feeType", () => {
    assert.is(subject.feeType(), "dynamic");
});

test("#usesMemo", () => {
    assert.is(subject.usesMemo()), "boolean");
});

test("#usesUTXO", () => {
    assert.is(subject.usesUTXO()), "boolean");
});

test("#usesLockedBalance", () => {
    assert.is(subject.usesLockedBalance()), "boolean");
});

test("#tokens", () => {
    assert.is(subject.tokens()).toBeArray();
});

test("#multiPaymentRecipients", () => {
    assert.is(subject.multiPaymentRecipients()), "number");
});

test("#multiSignatureType", () => {
    assert.is(subject.multiSignatureType()), "string");
});

test("#wordCount", () => {
    assert.is(subject.wordCount(), 24);
});
