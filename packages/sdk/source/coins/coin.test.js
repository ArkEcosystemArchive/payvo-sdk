import "reflect-metadata";

import nock from "nock";

import { ARK } from "../../../ark/distribution";
import { Request } from "../../../http-fetch";
import { Network, NetworkRepository } from "../networks/index";
import { Coin } from "./coin";
import { CoinFactory } from "./coin-factory";
import { ConfigRepository } from "./config";
import { Manifest } from "./manifest";

let subject: Coin;

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
	assert.is(() => subject.address()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.bigNumber()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.client()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.dataTransferObject()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedAddress()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedPublicKey()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.fee()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.keyPair()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.knownWallet()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.ledger()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.link()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.message()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.multiSignature()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.privateKey()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.publicKey()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.signatory()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.transaction()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.walletDiscovery()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.wif()).toThrow(/No matching bindings found for serviceIdentifier/);

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

	assert.is(() => subject.address()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.bigNumber()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.client()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.dataTransferObject()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedAddress()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.extendedPublicKey()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.fee()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.keyPair()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.knownWallet()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.ledger()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.link()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.message()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.multiSignature()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.privateKey()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.publicKey()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.signatory()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.transaction()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.walletDiscovery()).toThrow(/No matching bindings found for serviceIdentifier/);
	assert.is(() => subject.wif()).toThrow(/No matching bindings found for serviceIdentifier/);
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
