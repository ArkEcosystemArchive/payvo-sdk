import "reflect-metadata";

import { describe } from "@payvo/sdk-test";
import BIP38 from "bip38";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { WalletIdentifierFactory } from "./wallet.identifier.factory";

let profile;

describe("WalletIdentifierFactory", ({ afterAll, afterEach, beforeAll, beforeEach, loader, nock, assert, test, stub, it }) => {
	beforeAll(() => {
		bootContainer();
	});

	beforeEach(async () => {
		nock.fake()
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

	it("should not create wallet identifier when unknown method", async () => {
		const wallet = await profile.walletFactory().fromAddress({
			coin: "ARK",
			network: "ark.devnet",
			address: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
			method: undefined,
		});
	});

	it("should create wallet identifier for address", async () => {
		const wallet = await profile.walletFactory().fromAddress({
			coin: "ARK",
			network: "ark.devnet",
			address: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w",
			method: undefined,
		});
	});

	it("should create wallet identifier with mnenonic", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	it("should create wallet identifier with mnenonic for network that uses extended public key", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP44({
			coin: "BTC",
			network: "btc.livenet",
			mnemonic: identity.mnemonic,
			levels: { account: 0 },
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "extendedPublicKey",
			value: "xpub6CVZnKBTDKtVdkizs2fwFrb5WDjsc4MzCqmFSHEU1jYvuugQaQBzVzF5A7E9AVr793Lj5KPtFdyNcmA42RtFeko8JDZ2nUpciHRQFMGdcvM",
			method: "bip44",
		});
	});

	it("should create wallet identifier with mnenonic with password", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
			password: "password",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	it("should create wallet identifier with mnenonic with password for network that uses extended public key", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP44({
			coin: "BTC",
			network: "btc.livenet",
			mnemonic: identity.mnemonic,
			password: "password",
			levels: { account: 0 },
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "extendedPublicKey",
			value: "xpub6CVZnKBTDKtVdkizs2fwFrb5WDjsc4MzCqmFSHEU1jYvuugQaQBzVzF5A7E9AVr793Lj5KPtFdyNcmA42RtFeko8JDZ2nUpciHRQFMGdcvM",
			method: "bip44",
		});
	});

	it("should create wallet identifier with public key", async () => {
		const wallet = await profile.walletFactory().fromPublicKey({
			coin: "ARK",
			network: "ark.devnet",
			publicKey: identity.publicKey,
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	it("should create wallet identifier with private key", async () => {
		const wallet = await profile.walletFactory().fromPrivateKey({
			coin: "ARK",
			network: "ark.devnet",
			privateKey: identity.privateKey,
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	it("should create wallet identifier with secret", async () => {
		const wallet = await profile.walletFactory().fromSecret({
			coin: "ARK",
			network: "ark.devnet",
			secret: "secret",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D7seWn8JLVwX4nHd9hh2Lf7gvZNiRJ7qLk",
			method: "bip39",
		});
	});

	it("should create wallet identifier with secret with encryption", async () => {
		const wallet = await profile.walletFactory().fromSecret({
			coin: "ARK",
			network: "ark.devnet",
			secret: "secret",
			password: "password",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D7seWn8JLVwX4nHd9hh2Lf7gvZNiRJ7qLk",
			method: "bip39",
		});
	});

	it("should create wallet identifier with wif", async () => {
		const wallet = await profile.walletFactory().fromWIF({
			coin: "ARK",
			network: "ark.devnet",
			wif: "SHA89yQdW3bLFYyCvEBpn7ngYNR8TEojGCC1uAJjT5esJPm1NiG3",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});
	});

	it("should create wallet identifier with wif with encryption", async () => {
		const stubEncrypt = stub(BIP38, "encrypt").returnValue("6PYRydorcUPgUAtyd8KQCPd3YHo3vBAmSkBmwFcbEj7W4wBWoQ4JjxLj2d");
		const stubDecrypt = stub(BIP38, "decrypt").returnValue({
			privateKey: Buffer.from("e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617", "hex"),
			compressed: true
		});

		const wallet = await profile.walletFactory().fromWIF({
			coin: "ARK",
			network: "ark.devnet",
			wif: "6PYRydorcUPgUAtyd8KQCPd3YHo3vBAmSkBmwFcbEj7W4wBWoQ4JjxLj2d",
			password: "password",
		});

		assert.equal(await WalletIdentifierFactory.make(wallet), {
			type: "address",
			value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			method: "bip39",
		});

		stubEncrypt.restore();
		stubDecrypt.restore();
	});
});
