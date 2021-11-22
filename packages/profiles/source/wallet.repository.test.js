import { assert, describe, Mockery, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { ProfileSetting } from "./contracts";
import { Profile } from "./profile";
import { Wallet } from "./wallet";
import { WalletData } from "./wallet.enum";
import { WalletFactory } from "./wallet.factory";
import { WalletRepository } from "./wallet.repository";

const generate = async (coin, network) => {
	const { wallet } = await factory.generate({ coin, network });

	subject.push(wallet);

	return wallet;
};

const importByMnemonic = async (mnemonic, coin, network, bip) => {
	const wallet = await factory[
		{
			39: "fromMnemonicWithBIP39",
			44: "fromMnemonicWithBIP44",
			49: "fromMnemonicWithBIP49",
			84: "fromMnemonicWithBIP84",
		}[bip]
	]({
		coin,
		levels: {
			39: {},
			44: { account: 0 },
			49: { account: 0 },
			84: { account: 0 },
		}[bip],
		mnemonic,
		network,
	});

	subject.push(wallet);

	return wallet;
};

const createEnv = async () => {
	nock.cleanAll();

	nock("https://ark-test.payvo.com:443", { encodedQueryParams: true })
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get(/\/api\/wallets\/D.*/)
		.reply(404, `{"statusCode":404,"error":"Not Found","message":"Wallet not found"}`)
		.persist();

	nock("https://platform.ark.io:443", { encodedQueryParams: true })
		.get("/api/eth/wallets/0xF3D149CFDAAC1ECA70CFDCE04702F34CCEAD43E2")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.persist();

	const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });

	profile.settings().set(ProfileSetting.Name, "John Doe");

	subject = new WalletRepository(profile);
	factory = new WalletFactory(profile);

	const wallet = await importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39);
	subject.update(wallet.id(), { alias: "Alias" });
};

let subject;
let factory;

test.before(() => {
	bootContainer();
});

test.before.each(async () => {
	await createEnv();
});

test.before(() => nock.disableNetConnect());

test("#all", () => {
	assert.object(subject.all());
});

test("#first", () => {
	assert.object(subject.first());
});

test("#last", () => {
	assert.object(subject.last());
});

test("#allByCoin", async () => {
	await importByMnemonic(
		"upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
		"ARK",
		"ark.devnet",
		39,
	);

	assert.object(subject.allByCoin());
	assert.object(subject.allByCoin().DARK);
});

test("#filterByAddress", () => {
	const wallets = subject.filterByAddress(identity.address);

	assert.array(wallets);

	for (const wallet of wallets) {
		assert.instance(wallet, Wallet);
	}
});

test("#findByAddressWithNetwork", () => {
	assert.instance(subject.findByAddressWithNetwork(identity.address, "ark.devnet"), Wallet);
});

test("#findByPublicKey", () => {
	assert.instance(subject.findByPublicKey(identity.publicKey), Wallet);
});

test("#findByCoin", () => {
	assert.length(subject.findByCoin("ARK"), 1);
});

test("#findByCoinWithNetwork", () => {
	assert.length(subject.findByCoinWithNetwork("ARK", "ark.devnet"), 1);
});

test("#has", async () => {
	const wallet = subject.first();

	assert.true(subject.has(wallet.id()));
	assert.false(subject.has("whatever"));
});

test("#forget", async () => {
	const wallet = subject.first();

	assert.true(subject.has(wallet.id()));

	subject.forget(wallet.id());

	assert.false(subject.has(wallet.id()));
});

test("#findByAlias", async () => {
	await generate("ARK", "ark.devnet");

	assert.instance(subject.findByAlias("Alias"), Wallet);
	assert.undefined(subject.findByAlias("Not Exist"));
});

test("#push", async () => {
	subject.flush();

	await assert.resolves(() => importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39));
	await assert.rejects(() => importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39));

	const wallet = subject.first();

	Mockery.stub(wallet, "networkId").returnValueOnce("ark.mainnet");

	await assert.resolves(() => importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39));
});

test("#update", async () => {
	assert.throws(() => subject.update("invalid", { alias: "My Wallet" }), "Failed to find");

	const wallet = await generate("ARK", "ark.devnet");

	subject.update(wallet.id(), { alias: "My New Wallet" });

	assert.is(subject.findById(wallet.id()).alias(), "My New Wallet");

	subject.update(wallet.id(), {});

	assert.is(subject.findById(wallet.id()).alias(), "My New Wallet");

	const newWallet = await generate("ARK", "ark.devnet");

	assert.throws(
		() => subject.update(newWallet.id(), { alias: "My New Wallet" }),
		"The wallet with alias [My New Wallet] already exists.",
	);
});

// describe("#fill", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(async () => {
// 		await createEnv();
// 	});

// 	test("should fill the wallet", async () => {
// 		const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
// 		profile.settings().set(ProfileSetting.Name, "John Doe");

// 		const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
// 			coin: "ARK",
// 			mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
// 			network: "ark.devnet",
// 		});

// 		assert.is(
// 			await subject.fill({
// 				[newWallet.id()]: {
// 					data: newWallet.data().all(),
// 					id: newWallet.id(),
// 					settings: newWallet.settings().all(),
// 				},
// 			}),
// 		);

// 		assert.equal(subject.findById(newWallet.id()), newWallet);
// 	});

// 	test("should fail to fill the wallet if the coin doesn't exist", async () => {
// 		const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
// 		profile.settings().set(ProfileSetting.Name, "John Doe");

// 		const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
// 			coin: "ARK",
// 			mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
// 			network: "ark.devnet",
// 		});

// 		newWallet.data().set(WalletData.Coin, "invalid");

// 		assert.is(
// 			await subject.fill({
// 				[newWallet.id()]: {
// 					data: newWallet.data().all(),
// 					id: newWallet.id(),
// 					settings: newWallet.settings().all(),
// 				},
// 			}),
// 		);

// 		assert.true(subject.findById(newWallet.id()).isMissingCoin());
// 		assert.true(subject.findById(newWallet.id()).isMissingNetwork());
// 	});

// 	test("should fail to fill the wallet if the network doesn't exist", async () => {
// 		const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
// 		profile.settings().set(ProfileSetting.Name, "John Doe");

// 		const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
// 			coin: "ARK",
// 			mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
// 			network: "ark.devnet",
// 		});

// 		newWallet.data().set(WalletData.Network, "invalid");

// 		assert.is(
// 			await subject.fill({
// 				[newWallet.id()]: {
// 					data: newWallet.data().all(),
// 					id: newWallet.id(),
// 					settings: newWallet.settings().all(),
// 				},
// 			}),
// 		);

// 		assert.false(subject.findById(newWallet.id()).isMissingCoin());
// 		assert.true(subject.findById(newWallet.id()).isMissingNetwork());
// 	});
// });

// describe("#sortBy", ({ afterEach, beforeEach, test }) => {
// 	let walletARK;
// 	let walletBTC;
// 	let walletLSK;

// 	beforeEach(async () => {
// 		await createEnv();

// 		subject.flush();

// 		walletARK = await importByMnemonic(
// 			"wood summer suggest unlock device trust else basket minimum hire lady cute",
// 			"ARK",
// 			"ark.devnet",
// 			39,
// 		);
// 		walletBTC = await importByMnemonic(
// 			"brisk grab cash invite labor frozen scrap endorse fault fence prison brisk",
// 			"BTC",
// 			"btc.testnet",
// 			44,
// 		);
// 		walletLSK = await importByMnemonic(
// 			"print alert reflect tree draw assault mean lift burst pattern rain subway",
// 			"LSK",
// 			"lsk.mainnet",
// 			39,
// 		);
// 	});

// 	test("should sort by coin", async () => {
// 		const wallets = subject.sortBy("coin");

// 		assert.is(wallets[0].address(), walletBTC.address()); // BTC
// 		assert.is(wallets[1].address(), walletARK.address()); // DARK
// 		assert.is(wallets[2].address(), walletLSK.address()); // LSK
// 	});

// 	test("should sort by coin desc", async () => {
// 		const wallets = subject.sortBy("coin", "desc");

// 		assert.is(wallets[0].address(), walletLSK.address()); // LSK
// 		assert.is(wallets[1].address(), walletARK.address()); // DARK
// 		assert.is(wallets[2].address(), walletBTC.address()); // BTC
// 	});

// 	test("should sort by address", async () => {
// 		const wallets = subject.sortBy("address");

// 		assert.is(wallets[0].address(), walletARK.address());
// 		assert.is(wallets[1].address(), walletLSK.address());
// 		assert.is(wallets[2].address(), walletBTC.address());
// 	});

// 	test("should sort by type", async () => {
// 		walletARK.toggleStarred();
// 		walletLSK.toggleStarred();

// 		const wallets = subject.sortBy("type");

// 		assert.is(wallets[0].address(), walletBTC.address());
// 		assert.is(wallets[1].address(), walletARK.address());
// 		assert.is(wallets[2].address(), walletLSK.address());
// 	});

// 	test("should sort by balance", async () => {
// 		const wallets = subject.sortBy("balance");

// 		assert.is(wallets[0].address(), walletARK.address());
// 		assert.is(wallets[1].address(), walletBTC.address());
// 		assert.is(wallets[2].address(), walletLSK.address());
// 	});

// 	test("should export toObject", async () => {
// 		const wallets = subject.toObject();

// 		assert.instance(wallets, Object);
// 	});
// });

// describe("restore", function ({ afterEach, beforeEach, test }) {
// 	let profile;
// 	let wallet;

// 	beforeEach(async () => {
// 		await createEnv();

// 		profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
// 		profile.settings().set(ProfileSetting.Name, "John Doe");

// 		wallet = await profile.walletFactory().fromMnemonicWithBIP39({
// 			coin: "ARK",
// 			mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
// 			network: "ark.devnet",
// 		});

// 		await subject.fill({
// 			[wallet.id()]: {
// 				data: wallet.data().all(),
// 				id: wallet.id(),
// 				settings: wallet.settings().all(),
// 			},
// 		});
// 	});

// 	test("should restore", async () => {
// 		const newWallet2 = await profile.walletFactory().fromMnemonicWithBIP39({
// 			coin: "ARK",
// 			mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
// 			network: "ark.devnet",
// 		});

// 		await subject.fill({
// 			[wallet.id()]: {
// 				data: wallet.data().all(),
// 				id: wallet.id(),
// 				settings: wallet.settings().all(),
// 			},
// 			[newWallet2.id()]: {
// 				data: newWallet2.data().all(),
// 				id: newWallet2.id(),
// 				settings: newWallet2.settings().all(),
// 			},
// 		});

// 		await subject.restore();

// 		assert.true(subject.findById(wallet.id()).hasBeenFullyRestored());
// 		assert.true(subject.findById(newWallet2.id()).hasBeenFullyRestored());
// 	});

// 	test("should do nothing if the wallet has already been fully restored", async () => {
// 		subject.findById(wallet.id()).markAsFullyRestored();

// 		await subject.restore();

// 		assert.true(subject.findById(wallet.id()).hasBeenFullyRestored());
// 		assert.false(subject.findById(wallet.id()).hasBeenPartiallyRestored());
// 	});

// 	// @TODO: implement callsFakeOnce
// 	skip("should retry if it encounters a failure during restoration", async () => {
// 		// Nasty: we need to mock a failure on the wallet instance the repository has
// 		Mockery.stub(subject.findById(wallet.id()), "mutator").callsFakeOnce(() => {
// 			throw new Error();
// 		});

// 		await subject.restore();

// 		assert.true(subject.findById(wallet.id()).hasBeenFullyRestored());
// 	});
// });

test.run();
