import { describe } from "@payvo/sdk-test";

import { manifest } from "../../ark/distribution/esm/manifest.js";
import { FeatureFlag } from "./enums.js";
import { Network } from "./network.js";

describe("Network", ({ assert, beforeEach, it, stub }) => {
	beforeEach((context) => {
		context.subject = new Network(manifest, manifest.networks["ark.mainnet"]);
	});

	it("should have an coin", (context) => {
		assert.is(context.subject.coin(), "ARK");
	});

	it("should have an coin name", (context) => {
		assert.is(context.subject.coinName(), "ARK");
	});

	it("should have an id", (context) => {
		assert.is(context.subject.id(), "ark.mainnet");
	});

	it("should have a name", (context) => {
		assert.is(context.subject.name(), "Mainnet");
	});

	it("should have a display name", (context) => {
		assert.is(context.subject.displayName(), "ARK");
	});

	it("should have an explorer", (context) => {
		assert.is(context.subject.explorer(), "https://explorer.ark.io");
	});

	it("should have a ticker", (context) => {
		assert.is(context.subject.ticker(), "ARK");
	});

	it("should have a symbol", (context) => {
		assert.is(context.subject.symbol(), "Ѧ");
	});

	it("should determine if the network is a live environment", (context) => {
		assert.true(context.subject.isLive());
	});

	it("should determine if the network is a test environment", (context) => {
		assert.false(context.subject.isTest());
	});

	it("should get the expiration type", (context) => {
		assert.is(context.subject.expirationType(), "height");
	});

	it("should allows voting", (context) => {
		assert.true(context.subject.allowsVoting());

		context.subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.false(context.subject.allowsVoting());
	});

	it("#votesAmountStep", (context) => {
		assert.number(context.subject.votesAmountStep());
	});

	it("#votesAmountMinimum", (context) => {
		assert.number(context.subject.votesAmountMinimum());
	});

	it("#votesAmountMaximum", (context) => {
		assert.number(context.subject.votesAmountMaximum());
	});

	it("should get the delegate count", (context) => {
		assert.is(context.subject.delegateCount(), 51);

		context.subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.is(context.subject.delegateCount(), 0);
	});

	it("should get maximum votes per wallet", (context) => {
		assert.is(context.subject.maximumVotesPerWallet(), 1);

		context.subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.is(context.subject.maximumVotesPerWallet(context), 0);
	});

	it("should get maximum votes per transaction", (context) => {
		assert.is(context.subject.maximumVotesPerTransaction(), 1);

		context.subject = new Network(manifest, {
			"ark.mainnet": {
				...manifest.networks["ark.mainnet"],
				governance: {},
			},
		});

		assert.is(context.subject.maximumVotesPerTransaction(), 0);
	});

	it("should get the delegate identifier", (context) => {
		assert.string(context.subject.delegateIdentifier());
	});

	it("should determine if the network uses extended public keys", (context) => {
		assert.is(context.subject.usesExtendedPublicKey(), false);
	});

	it("should have an object representation", (context) => {
		assert.object(context.subject.toObject());
	});

	it("should have an string representation", (context) => {
		assert.string(context.subject.toJson());
	});

	it("should determine if the network allows a feature", (context) => {
		assert.is(context.subject.allows(FeatureFlag.ClientBroadcast), true);
		assert.is(context.subject.allows(FeatureFlag.AddressMnemonicBip84), false);

		assert.is(context.subject.allows(FeatureFlag.TransactionDelegateRegistration), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionDelegateResignation), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionIpfs), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionMultiPayment), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionMultiSignature), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionSecondSignature), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionTransfer), true);
		assert.is(context.subject.allows(FeatureFlag.TransactionVote), true);

		assert.is(context.subject.allows("randomKey"), false);
	});

	it("should determine if the network denies a feature", (context) => {
		assert.is(context.subject.denies(FeatureFlag.AddressMnemonicBip84), true);
		assert.is(context.subject.denies(FeatureFlag.ClientBroadcast), false);
	});

	it("should determine if the network charges static fees", (context) => {
		assert.boolean(context.subject.chargesStaticFees());
	});

	it("should determine if the network charges dynamic fees", (context) => {
		assert.boolean(context.subject.chargesDynamicFees());
	});

	it("should determine if the network charges gas fees", (context) => {
		assert.boolean(context.subject.chargesGasFees());
	});

	it("should determine if the network charges weight fees", (context) => {
		assert.boolean(context.subject.chargesWeightFees());
	});

	it("should determine if the network charges zero fees", (context) => {
		assert.boolean(context.subject.chargesZeroFees());
	});

	it("should get the wallet import methods", (context) => {
		assert.object(context.subject.importMethods());
	});

	it("should get the meta data", (context) => {
		assert.object(context.subject.meta());
	});

	it("should get the fee type", (context) => {
		assert.is(context.subject.feeType(), "dynamic");
	});

	it("should determine if the network uses Memo", (context) => {
		assert.boolean(context.subject.usesMemo());
	});

	it("should determine if the network uses UTXO", (context) => {
		assert.boolean(context.subject.usesUTXO());
	});

	it("should determine if the network uses locked balances", (context) => {
		assert.boolean(context.subject.usesLockedBalance());
	});

	it("should get the tokens", (context) => {
		assert.array(context.subject.tokens());
	});

	it("should get the number of multi-payment recipients", (context) => {
		assert.number(context.subject.multiPaymentRecipients());
	});

	it("should get the multi-signature type", (context) => {
		assert.string(context.subject.multiSignatureType());
	});

	it("should get the word count for mnemonics", (context) => {
		assert.is(context.subject.wordCount(), 24);
	});
});
