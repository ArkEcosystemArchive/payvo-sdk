import { describe } from "@payvo/sdk-test";

import { manifest } from "../../ark/distribution/manifest";
import { FeatureFlag } from "./enums";
import { Network } from "./network";

let subject;

describe("Network", ({ assert, beforeEach, it, stub }) => {
	beforeEach(() => {
		subject = new Network(manifest, manifest.networks["ark.mainnet"]);
	});

	it("should have an coin", () => {
		assert.is(subject.coin(), "ARK");
	});

	it("should have an coin name", () => {
		assert.is(subject.coinName(), "ARK");
	});

	it("should have an id", () => {
		assert.is(subject.id(), "ark.mainnet");
	});

	it("should have a name", () => {
		assert.is(subject.name(), "Mainnet");
	});

	it("should have a display name", () => {
		assert.is(subject.displayName(), "ARK");
	});

	it("should have an explorer", () => {
		assert.is(subject.explorer(), "https://explorer.ark.io");
	});

	it("should have a ticker", () => {
		assert.is(subject.ticker(), "ARK");
	});

	it("should have a symbol", () => {
		assert.is(subject.symbol(), "Ѧ");
	});

	it("should determine if the network is a live environment", () => {
		assert.true(subject.isLive());
	});

	it("should determine if the network is a test environment", () => {
		assert.false(subject.isTest());
	});

	it("should get the expiration type", () => {
		assert.is(subject.expirationType(), "height");
	});

	it("should allows voting", () => {
		assert.true(subject.allowsVoting());

		subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.false(subject.allowsVoting());
	});

	it("#votesAmountStep", () => {
		assert.number(subject.votesAmountStep());
	});

	it("#votesAmountMinimum", () => {
		assert.number(subject.votesAmountMinimum());
	});

	it("#votesAmountMaximum", () => {
		assert.number(subject.votesAmountMaximum());
	});

	it("should get the delegate count", () => {
		assert.is(subject.delegateCount(), 51);

		subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.is(subject.delegateCount(), 0);
	});

	it("should get maximum votes per wallet", () => {
		assert.is(subject.maximumVotesPerWallet(), 1);

		subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.is(subject.maximumVotesPerWallet(), 0);
	});

	it("should get maximum votes per transaction", () => {
		assert.is(subject.maximumVotesPerTransaction(), 1);

		subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.is(subject.maximumVotesPerTransaction(), 0);
	});

	it("should get the delegate identifier", () => {
		assert.string(subject.delegateIdentifier());
	});

	it("should determine if the network uses extended public keys", () => {
		assert.is(subject.usesExtendedPublicKey(), false);
	});

	it("should have an object representation", () => {
		assert.object(subject.toObject());
	});

	it("should have an string representation", () => {
		assert.string(subject.toJson());
	});

	it("should determine if the network allows a feature", () => {
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

	it("should determine if the network denies a feature", () => {
		assert.is(subject.denies(FeatureFlag.AddressMnemonicBip84), true);
		assert.is(subject.denies(FeatureFlag.ClientBroadcast), false);
	});

	it("should determine if the network charges static fees", () => {
		assert.boolean(subject.chargesStaticFees());
	});

	it("should determine if the network charges dynamic fees", () => {
		assert.boolean(subject.chargesDynamicFees());
	});

	it("should determine if the network charges gas fees", () => {
		assert.boolean(subject.chargesGasFees());
	});

	it("should determine if the network charges weight fees", () => {
		assert.boolean(subject.chargesWeightFees());
	});

	it("should determine if the network charges zero fees", () => {
		assert.boolean(subject.chargesZeroFees());
	});

	it("should get the wallet import methods", () => {
		assert.object(subject.importMethods());
	});

	it("should get the meta data", () => {
		assert.object(subject.meta());
	});

	it("should get the fee type", () => {
		assert.is(subject.feeType(), "dynamic");
	});

	it("should determine if the network uses Memo", () => {
		assert.boolean(subject.usesMemo());
	});

	it("should determine if the network uses UTXO", () => {
		assert.boolean(subject.usesUTXO());
	});

	it("should determine if the network uses locked balances", () => {
		assert.boolean(subject.usesLockedBalance());
	});

	it("should get the tokens", () => {
		assert.array(subject.tokens());
	});

	it("should get the number of multi-payment recipients", () => {
		assert.number(subject.multiPaymentRecipients());
	});

	it("should get the multi-signature type", () => {
		assert.string(subject.multiSignatureType());
	});

	it("should get the word count for mnemonics", () => {
		assert.is(subject.wordCount(), 24);
	});
});
