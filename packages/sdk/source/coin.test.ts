import { describe } from "@payvo/sdk-test";

import { ARK } from "../../ark/distribution/esm";
import { Request } from "../../fetch/distribution/esm";
import { CoinFactory } from "./coin-factory.js";
import { ConfigRepository } from "./config";
import { Manifest } from "./manifest";
import { Network, NetworkRepository } from "./networks";

describe("Coin", ({ assert, beforeEach, each, loader, nock, it }) => {
	beforeEach(async (context) => {
		nock.fake(/.+/)
			.get("/api/blockchain")
			.reply(200, loader.json("test/testnet/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, loader.json("test/testnet/configuration.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, loader.json("test/testnet/configuration-crypto.json"))
			.get("/api/node/syncing")
			.reply(200, loader.json("test/testnet/syncing.json"))
			.persist();

		context.subject = CoinFactory.make(ARK, {
			httpClient: new Request(),
			ledgerTransportFactory: async () => {
				//
			},
			network: "ark.devnet",
		});
	});

	it("should construct all services", async (context) => {
		assert.throws(() => context.subject.address(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.client(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.dataTransferObject(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.extendedPublicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.link(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.message(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.wif(), "No matching bindings found for serviceIdentifier");

		await context.subject.__construct();

		assert.not.throws(() => context.subject.address(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.client(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(
			() => context.subject.dataTransferObject(),
			"No matching bindings found for serviceIdentifier",
		);
		assert.not.throws(() => context.subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(
			() => context.subject.extendedPublicKey(),
			"No matching bindings found for serviceIdentifier",
		);
		assert.not.throws(() => context.subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.link(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.message(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.wif(), "No matching bindings found for serviceIdentifier");
	});

	it("should destruct all services", async (context) => {
		await context.subject.__construct();

		assert.not.throws(() => context.subject.address(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.client(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(
			() => context.subject.dataTransferObject(),
			"No matching bindings found for serviceIdentifier",
		);
		assert.not.throws(() => context.subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(
			() => context.subject.extendedPublicKey(),
			"No matching bindings found for serviceIdentifier",
		);
		assert.not.throws(() => context.subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.link(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.message(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => context.subject.wif(), "No matching bindings found for serviceIdentifier");

		await context.subject.__destruct();

		assert.throws(() => context.subject.address(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.client(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.dataTransferObject(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.extendedPublicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.link(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.message(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => context.subject.wif(), "No matching bindings found for serviceIdentifier");
	});

	it("should determine if the coin has been synchronized", async (context) => {
		assert.false(context.subject.hasBeenSynchronized());

		await context.subject.__construct();

		assert.true(context.subject.hasBeenSynchronized());

		await context.subject.__destruct();

		assert.false(context.subject.hasBeenSynchronized());
	});

	it("should get the network", (context) => {
		assert.instance(context.subject.network(), Network);
	});

	it("should get the networks", (context) => {
		assert.instance(context.subject.networks(), NetworkRepository);
	});

	it("should get the manifest", (context) => {
		assert.instance(context.subject.manifest(), Manifest);
	});

	it("should get the config", (context) => {
		assert.instance(context.subject.config(), ConfigRepository);
	});

	each(
		"should throw if coin has not been fully set up (%s)",
		async ({ dataset, context }) => {
			assert.throws(() => context.subject[dataset]());

			await context.subject.__construct();

			assert.object(context.subject[dataset]());
		},
		[
			"address",
			"bigNumber",
			"client",
			"dataTransferObject",
			"extendedAddress",
			"extendedPublicKey",
			"fee",
			"keyPair",
			"knownWallet",
			"ledger",
			"link",
			"message",
			"multiSignature",
			"privateKey",
			"publicKey",
			"signatory",
			"transaction",
			"walletDiscovery",
			"wif",
		],
	);
});
