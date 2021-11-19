import { assert, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { ARK } from "../../../ark/distribution";
import { Request } from "../../../http-fetch";
import { Network, NetworkRepository } from "../networks/index";
import { CoinFactory } from "./coin-factory";
import { ConfigRepository } from "./config";
import { Manifest } from "./manifest";

let subject;

test.before.each(async () => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/blockchain")
		.reply(200, loader.json("test/testnet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, loader.json("test/testnet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, loader.json("test/testnet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, loader.json("test/testnet/syncing.json"))
		.persist();

	// @ts-ignore
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

	assert.is(() => subject.address()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.bigNumber()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.client()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.dataTransferObject()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedAddress()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedPublicKey()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.fee()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.keyPair()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.knownWallet()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.ledger()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.link()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.message()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.multiSignature()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.privateKey()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.publicKey()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.signatory()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.transaction()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.walletDiscovery()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.wif()).not.toThrow(/No matching bindings found for serviceIdentifier/);
});

test("#__destruct", async () => {
	await subject.__construct();

	assert.is(() => subject.address()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.bigNumber()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.client()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.dataTransferObject()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedAddress()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedPublicKey()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.fee()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.keyPair()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.knownWallet()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.ledger()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.link()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.message()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.multiSignature()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.privateKey()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.publicKey()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.signatory()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.transaction()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.walletDiscovery()).not.toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.wif()).not.toThrow(/No matching bindings found for serviceIdentifier/);

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
	assert.is(subject.hasBeenSynchronized(), false);

	await subject.__construct();

	assert.is(subject.hasBeenSynchronized(), true);

	await subject.__destruct();

	assert.is(subject.hasBeenSynchronized(), false);
});

test("#network", () => {
	assert.is(subject.network() instanceof Network);
});

test("#networks", () => {
	assert.is(subject.networks() instanceof NetworkRepository);
});

test("#manifest", () => {
	assert.is(subject.manifest() instanceof Manifest);
});

test("#config", () => {
	assert.is(subject.config() instanceof ConfigRepository);
});

describe.each([
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
])("#%s", (method) => {
	test("should throw if coin has not been fully set up", async () => {
		assert.is(() => subject[method]()).toThrow();
	});

	test("should not throw if coin has not been fully set up", async () => {
		await subject.__construct();

		assert.is(subject[method](), "object");
	});
});
