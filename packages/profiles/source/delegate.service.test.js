import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { nock } from "@payvo/sdk-test";
import { UUID } from "@payvo/sdk-cryptography";

import { bootContainer } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { Profile } from "./profile";
import { Wallet } from "./wallet";
import { DelegateService } from "./delegate.service";
import { IReadWriteWallet } from "./contracts";

let subject;

test.before(() => {
	bootContainer();

	nock.disableNetConnect();
});

let wallet;
let profile;

test.before.each(async () => {
	nock.fake(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/delegates")
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../test/fixtures/client/delegates-2.json"))
		.persist();

	profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
	subject = new DelegateService();

	wallet = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});
});

test("should sync the delegates", async () => {
	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	await subject.sync(profile, "ARK", "ark.devnet");

	assert.array(subject.all("ARK", "ark.devnet"));
	assert.length(subject.all("ARK", "ark.devnet"), 200);
});

test("should sync the delegates only one page", async () => {
	nock.cleanAll();
	nock.fake(/.+/).get("/api/delegates").reply(200, require("../test/fixtures/client/delegates-single-page.json"));

	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	await subject.sync(profile, "ARK", "ark.devnet");

	assert.array(subject.all("ARK", "ark.devnet"));
	assert.length(subject.all("ARK", "ark.devnet"), 10);
});

test("should sync the delegates when network does not support FastDelegateSync", async () => {
	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	Mockery.stub(profile.coins().set("ARK", "ark.devnet").network(), "meta").returnValue({
		fastDelegateSync: false,
	});

	await subject.sync(profile, "ARK", "ark.devnet");

	assert.array(subject.all("ARK", "ark.devnet"));
	assert.length(subject.all("ARK", "ark.devnet"), 200);
});

test("should sync the delegates of all coins", async () => {
	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	await subject.syncAll(profile);

	assert.array(subject.all("ARK", "ark.devnet"));
	assert.length(subject.all("ARK", "ark.devnet"), 200);
});

test("#findByAddress", async () => {
	await subject.syncAll(profile);
	assert.truthy(subject.findByAddress("ARK", "ark.devnet", "DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve"));
	assert.throws(() => subject.findByAddress("ARK", "ark.devnet", "unknown"), /No delegate for/);
});

test("#findByPublicKey", async () => {
	await subject.syncAll(profile);
	assert.truthy(
		subject.findByPublicKey(
			"ARK",
			"ark.devnet",
			"033a5474f68f92f254691e93c06a2f22efaf7d66b543a53efcece021819653a200",
		),
	);
	assert.throws(() => subject.findByPublicKey("ARK", "ark.devnet", "unknown"), /No delegate for/);
});

test("#findByUsername", async () => {
	await subject.syncAll(profile);
	assert.truthy(subject.findByUsername("ARK", "ark.devnet", "alessio"));
	assert.throws(() => subject.findByUsername("ARK", "ark.devnet", "unknown"), /No delegate for/);
});

test("should return an empty array if there are no public keys", async () => {
	const mappedDelegates = subject.map(wallet, []);

	assert.array(mappedDelegates);
	assert.length(mappedDelegates, 0);
});

test("should map the public keys to read-only wallets", async () => {
	const delegates = require("../test/fixtures/client/delegates-1.json").data;
	const addresses = delegates.map((delegate) => delegate.address);
	const publicKeys = delegates.map((delegate) => delegate.publicKey);
	const usernames = delegates.map((delegate) => delegate.username);

	await subject.sync(profile, wallet.coinId(), wallet.networkId());

	const mappedDelegates = subject.map(wallet, publicKeys);

	assert.array(mappedDelegates);
	assert.length(mappedDelegates, 100);

	for (let i = 0; i < delegates.length; i++) {
		assert.is(mappedDelegates[i].address(), addresses[i]);
		assert.is(mappedDelegates[i].publicKey(), publicKeys[i]);
		assert.is(mappedDelegates[i].username(), usernames[i]);
	}
});

test("should skip public keys for which it does not find a delegate", async () => {
	const delegates = require("../test/fixtures/client/delegates-1.json").data;
	const addresses = delegates.map((delegate) => delegate.address);
	const publicKeys = delegates.map((delegate) => delegate.publicKey);
	const usernames = delegates.map((delegate) => delegate.username);

	await subject.sync(profile, wallet.coinId(), wallet.networkId());

	const mappedDelegates = subject.map(wallet, publicKeys.concat(["pubkey"]));

	assert.array(mappedDelegates);
	assert.length(mappedDelegates, 100);

	for (let i = 0; i < delegates.length; i++) {
		assert.is(mappedDelegates[i].address(), addresses[i]);
		assert.is(mappedDelegates[i].publicKey(), publicKeys[i]);
		assert.is(mappedDelegates[i].username(), usernames[i]);
	}
});

test.run();
