import { assert, test } from "@payvo/sdk-test";

import { manifest } from "../../ark/distribution/manifest";
import { FeatureFlag } from "./enums";
import { Network } from "./network";

let subject;

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
    assert.number(subject.votesAmountStep());
});

test("#votesAmountMinimum", () => {
    assert.number(subject.votesAmountMinimum());
});

test("#votesAmountMaximum", () => {
    assert.number(subject.votesAmountMaximum());
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
    assert.string(subject.delegateIdentifier());
});

test("should determine if the network uses extended public keys", () => {
    assert.is(subject.usesExtendedPublicKey(), false);
});

test("should have an object representation", () => {
    assert.object(subject.toObject());
});

test("should have an string representation", () => {
    assert.string(subject.toJson());
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
    assert.boolean(subject.chargesStaticFees());
});

test("#chargesDynamicFees", () => {
    assert.boolean(subject.chargesDynamicFees());
});

test("#chargesGasFees", () => {
    assert.boolean(subject.chargesGasFees());
});

test("#chargesWeightFees", () => {
    assert.boolean(subject.chargesWeightFees());
});

test("#chargesZeroFees", () => {
    assert.boolean(subject.chargesZeroFees());
});

test("#importMethods", () => {
    assert.is(subject.importMethods());
});

test("#meta", () => {
    assert.is(subject.meta());
});

test("#feeType", () => {
    assert.is(subject.feeType(), "dynamic");
});

test("#usesMemo", () => {
    assert.boolean(subject.usesMemo());
});

test("#usesUTXO", () => {
    assert.boolean(subject.usesUTXO());
});

test("#usesLockedBalance", () => {
    assert.boolean(subject.usesLockedBalance());
});

test("#tokens", () => {
    assert.is(subject.tokens()).toBeArray();
});

test("#multiPaymentRecipients", () => {
    assert.number(subject.multiPaymentRecipients());
});

test("#multiSignatureType", () => {
    assert.string(subject.multiSignatureType());
});

test("#wordCount", () => {
    assert.is(subject.wordCount(), 24);
});

test.run();
