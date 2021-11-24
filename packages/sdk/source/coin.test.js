import { assert, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { nock } from "@payvo/sdk-test";

import { ARK } from "../../ark/distribution";
import { Request } from "../../http-fetch/distribution";
import { Network, NetworkRepository } from "./networks";
import { CoinFactory } from "./coin-factory";
import { ConfigRepository } from "./config";
import { Manifest } from "./manifest";

let subject;

test.before.each(async () => {


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

test.after.each(() => nock.cleanAll());

test("#construct", async () => {
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

test("#__destruct", async () => {
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

test("#hasBeenSynchronized", async () => {
	assert.false(subject.hasBeenSynchronized());

	await subject.__construct();

	assert.true(subject.hasBeenSynchronized());

	await subject.__destruct();

	assert.false(subject.hasBeenSynchronized());
});

test("#network", () => {
	assert.instance(subject.network(), Network);
});

test("#networks", () => {
	assert.instance(subject.networks(), NetworkRepository);
});

test("#manifest", () => {
	assert.instance(subject.manifest(), Manifest);
});

test("#config", () => {
	assert.instance(subject.config(), ConfigRepository);
});

for (const method of [
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
]) {
	test("should throw if coin has not been fully set up", async () => {
		assert.throws(() => subject[method]());
	});

	test("should not throw if coin has not been fully set up", async () => {
		await subject.__construct();

		assert.object(subject[method]());
	});
}

test.run();
