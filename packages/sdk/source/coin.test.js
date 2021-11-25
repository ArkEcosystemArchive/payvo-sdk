import { describe } from "@payvo/sdk-test";
import "reflect-metadata";

import { ARK } from "../../ark/distribution";
import { Request } from "../../http-fetch/distribution";
import { Network, NetworkRepository } from "./networks";
import { CoinFactory } from "./coin-factory";
import { ConfigRepository } from "./config";
import { Manifest } from "./manifest";

let subject;

const methods = [
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
];

describe("Coin", ({ assert, beforeEach, each, loader, nock, it }) => {
	beforeEach(async () => {
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

		subject = CoinFactory.make(ARK, {
			httpClient: new Request(),
			network: "ark.devnet",
		});
	});

	it("should construct all services", async () => {
		assert.throws(() => subject.address(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.client(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.dataTransferObject(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.extendedPublicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.link(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.message(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.wif(), "No matching bindings found for serviceIdentifier");

		await subject.__construct();

		assert.not.throws(() => subject.address(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.client(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.dataTransferObject(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.extendedPublicKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.link(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.message(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.wif(), "No matching bindings found for serviceIdentifier");
	});

	it("should destruct all services", async () => {
		await subject.__construct();

		assert.not.throws(() => subject.address(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.client(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.dataTransferObject(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.extendedPublicKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.link(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.message(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.not.throws(() => subject.wif(), "No matching bindings found for serviceIdentifier");

		await subject.__destruct();

		assert.throws(() => subject.address(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.bigNumber(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.client(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.dataTransferObject(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.extendedAddress(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.extendedPublicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.fee(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.keyPair(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.knownWallet(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.ledger(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.link(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.message(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.multiSignature(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.privateKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.publicKey(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.signatory(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.transaction(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.walletDiscovery(), "No matching bindings found for serviceIdentifier");
		assert.throws(() => subject.wif(), "No matching bindings found for serviceIdentifier");
	});

	it("should determine if the coin has been synchronized", async () => {
		assert.false(subject.hasBeenSynchronized());

		await subject.__construct();

		assert.true(subject.hasBeenSynchronized());

		await subject.__destruct();

		assert.false(subject.hasBeenSynchronized());
	});

	it("should get the network", () => {
		assert.instance(subject.network(), Network);
	});

	it("should get the networks", () => {
		assert.instance(subject.networks(), NetworkRepository);
	});

	it("should get the manifest", () => {
		assert.instance(subject.manifest(), Manifest);
	});

	it("should get the config", () => {
		assert.instance(subject.config(), ConfigRepository);
	});

	each("should throw if coin has not been fully set up", async ({ dataset }) => {
		assert.throws(() => subject[dataset]());
	}, methods);

	each("should not throw if coin has not been fully set up", async ({ dataset }) => {
		await subject.__construct();

		assert.object(subject[dataset]());
	}, methods);
});
