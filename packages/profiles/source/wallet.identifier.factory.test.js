import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { IProfile, IProfileRepository, IReadWriteWallet } from "./contracts";
import { WalletIdentifierFactory } from "./wallet.identifier.factory";

let profile;

test.before(() => {
	bootContainer();
	nock.disableNetConnect();
});

test.before.each(async () => {
	nock.cleanAll();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/D7seWn8JLVwX4nHd9hh2Lf7gvZNiRJ7qLk")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
		.reply(200, require("../test/fixtures/client/wallet-2.json"));

	const profileRepository = container.get(Identifiers.ProfileRepository);
	profileRepository.flush();
	profile = profileRepository.create("John Doe");
});

test("should not create wallet identifier when unknown method", async () => {
	const wallet = await profile.walletFactory().fromAddress({
		coin: "ARK",
		network: "ark.devnet",
		address: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
		method: undefined,
	});
});

test("should create wallet identifier for address", async () => {
	const wallet = await profile.walletFactory().fromAddress({
		coin: "ARK",
		network: "ark.devnet",
		address: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
		method: undefined,
	});
});

describe("should create wallet identifier with mnenonic", () => {
	test("should work", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
		});

		assert.is(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	test("should work for network that uses extended public key", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP44({
			coin: "BTC",
			network: "btc.livenet",
			mnemonic: identity.mnemonic,
			levels: { account: 0 },
		});

		assert.is(await WalletIdentifierFactory.make(wallet), {
			type: "extendedPublicKey",
			value: "xpub6CVZnKBTDKtVdkizs2fwFrb5WDjsc4MzCqmFSHEU1jYvuugQaQBzVzF5A7E9AVr793Lj5KPtFdyNcmA42RtFeko8JDZ2nUpciHRQFMGdcvM",
			method: "bip44",
		});
	});
});

describe("should create wallet identifier with mnenonic with password", () => {
	test("should work", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
			password: "password",
		});

		assert.is(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	test("should work for network that uses extended public key", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP44({
			coin: "BTC",
			network: "btc.livenet",
			mnemonic: identity.mnemonic,
			password: "password",
			levels: { account: 0 },
		});

		assert.is(await WalletIdentifierFactory.make(wallet), {
			type: "extendedPublicKey",
			value: "xpub6CVZnKBTDKtVdkizs2fwFrb5WDjsc4MzCqmFSHEU1jYvuugQaQBzVzF5A7E9AVr793Lj5KPtFdyNcmA42RtFeko8JDZ2nUpciHRQFMGdcvM",
			method: "bip44",
		});
	});
});

test("should create wallet identifier with public key", async () => {
	const wallet = await profile.walletFactory().fromPublicKey({
		coin: "ARK",
		network: "ark.devnet",
		publicKey: identity.publicKey,
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		method: "bip39",
	});
});

test("should create wallet identifier with private key", async () => {
	const wallet = await profile.walletFactory().fromPrivateKey({
		coin: "ARK",
		network: "ark.devnet",
		privateKey: identity.privateKey,
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		method: "bip39",
	});
});

test("should create wallet identifier with secret", async () => {
	const wallet = await profile.walletFactory().fromSecret({
		coin: "ARK",
		network: "ark.devnet",
		secret: "secret",
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "D7seWn8JLVwX4nHd9hh2Lf7gvZNiRJ7qLk",
		method: "bip39",
	});
});

test("should create wallet identifier with secret with encryption", async () => {
	const wallet = await profile.walletFactory().fromSecret({
		coin: "ARK",
		network: "ark.devnet",
		secret: "secret",
		password: "password",
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "D7seWn8JLVwX4nHd9hh2Lf7gvZNiRJ7qLk",
		method: "bip39",
	});
});

test("should create wallet identifier with wif", async () => {
	const wallet = await profile.walletFactory().fromWIF({
		coin: "ARK",
		network: "ark.devnet",
		wif: "SHA89yQdW3bLFYyCvEBpn7ngYNR8TEojGCC1uAJjT5esJPm1NiG3",
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		method: "bip39",
	});
});

test("should create wallet identifier with wif with encryption", async () => {
	const wallet = await profile.walletFactory().fromWIF({
		coin: "ARK",
		network: "ark.devnet",
		wif: "6PYRydorcUPgUAtyd8KQCPd3YHo3vBAmSkBmwFcbEj7W4wBWoQ4JjxLj2d",
		password: "password",
	});

	assert.is(await WalletIdentifierFactory.make(wallet), {
		type: "address",
		value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		method: "bip39",
	});
});

test.run();
