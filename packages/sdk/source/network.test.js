import { assert, Mockery, test } from "@payvo/sdk-test";

import { manifest } from "../../ark/distribution/manifest";
import { FeatureFlag } from "./enums";
import { Network } from "./network";

let subject;

test.before.each(() => {
	subject = new Network(manifest, manifest.networks["ark.devnet"]);
});

test.skip("should have an coin", () => {
	assert.is(subject.coin(), "ARK");
});

test.skip("should have an coin name", () => {
	assert.is(subject.coinName(), "ARK");
});

test.skip("should have an id", () => {
	assert.is(subject.id(), "ark.devnet");
});

test.skip("should have a name", () => {
	assert.is(subject.name(), "Devnet");
});

test.skip("should have a display name", () => {
	assert.is(subject.displayName(), "ARK Devnet");

	Mockery.stub(subject, "isLive").mockReturnValueOnce(true);

	assert.is(subject.displayName(), "ARK");
});

test.skip("should have an explorer", () => {
	assert.is(subject.explorer(), "https://dexplorer.ark.io");
});

test.skip("should have a ticker", () => {
	assert.is(subject.ticker(), "DARK");
});

test.skip("should have a symbol", () => {
	assert.is(subject.symbol(), "DѦ");
});

test.skip("should determine if the network is a live environment", () => {
	assert.false(subject.isLive());
});

test.skip("should determine if the network is a test environment", () => {
	assert.true(subject.isTest());
});

test.skip("should get the expiration type", () => {
	assert.is(subject.expirationType(), "height");
});

test.skip("should allows voting", () => {
	assert.true(subject.allowsVoting());

	subject = new Network(manifest, {
		"ark.devnet": {
			...manifest.networks["ark.devnet"],
			governance: {},
		},
	});

	assert.false(subject.allowsVoting());
});

test.skip("#votesAmountStep", () => {
	assert.number(subject.votesAmountStep());
});

test.skip("#votesAmountMinimum", () => {
	assert.number(subject.votesAmountMinimum());
});

test.skip("#votesAmountMaximum", () => {
	assert.number(subject.votesAmountMaximum());
});

test.skip("should get the delegate count", () => {
	assert.is(subject.delegateCount(), 51);

	subject = new Network(manifest, {
		"ark.devnet": {
			...manifest.networks["ark.devnet"],
			governance: {},
		},
	});

	assert.is(subject.delegateCount(), 0);
});

test.skip("should get maximum votes per wallet", () => {
	assert.is(subject.maximumVotesPerWallet(), 1);

	subject = new Network(manifest, {
		"ark.devnet": {
			...manifest.networks["ark.devnet"],
			governance: {},
		},
	});

	assert.is(subject.maximumVotesPerWallet(), 0);
});

test.skip("should get maximum votes per transaction", () => {
	assert.is(subject.maximumVotesPerTransaction(), 1);

	subject = new Network(manifest, {
		"ark.devnet": {
			...manifest.networks["ark.devnet"],
			governance: {},
		},
	});

	assert.is(subject.maximumVotesPerTransaction(), 0);
});

test.skip("should get the delegate identifier", () => {
	assert.string(subject.delegateIdentifier());
});

test.skip("should determine if the network uses extended public keys", () => {
	assert.is(subject.usesExtendedPublicKey(), false);
});

test.skip("should have an object representation", () => {
	assert.object(subject.toObject());
});

test.skip("should have an string representation", () => {
	assert.string(subject.toJson());
});

test.skip("#allows", () => {
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

test.skip("#denies", () => {
	assert.is(subject.denies(FeatureFlag.AddressMnemonicBip84), true);
	assert.is(subject.denies(FeatureFlag.ClientBroadcast), false);
});

test.skip("#chargesStaticFees", () => {
	assert.boolean(subject.chargesStaticFees());
});

test.skip("#chargesDynamicFees", () => {
	assert.boolean(subject.chargesDynamicFees());
});

test.skip("#chargesGasFees", () => {
	assert.boolean(subject.chargesGasFees());
});

test.skip("#chargesWeightFees", () => {
	assert.boolean(subject.chargesWeightFees());
});

test.skip("#chargesZeroFees", () => {
	assert.boolean(subject.chargesZeroFees());
});

test.skip("#importMethods", () => {
	assert.object(subject.importMethods());
});

test.skip("#meta", () => {
	assert.object(subject.meta());
});

test.skip("#feeType", () => {
	assert.is(subject.feeType(), "dynamic");
});

test.skip("#usesMemo", () => {
	assert.boolean(subject.usesMemo());
});

test.skip("#usesUTXO", () => {
	assert.boolean(subject.usesUTXO());
});

test.skip("#usesLockedBalance", () => {
	assert.boolean(subject.usesLockedBalance());
});

test.skip("#tokens", () => {
	assert.array(subject.tokens());
});

test.skip("#multiPaymentRecipients", () => {
	assert.number(subject.multiPaymentRecipients());
});

test.skip("#multiSignatureType", () => {
	assert.string(subject.multiSignatureType());
});

test.skip("#wordCount", () => {
	assert.is(subject.wordCount(), 24);
});

test.run();
