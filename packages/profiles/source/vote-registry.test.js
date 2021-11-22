import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { Wallet } from "./wallet";
import { IProfile, IProfileRepository, IReadWriteWallet, WalletData } from "./contracts";
import { IDelegateService } from "./delegate.service.contract";

let profile;
let subject;

test.before(() => bootContainer());

test.before.each(async () => {
	nock.cleanAll();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))

		// default wallet
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet-non-resigned.json"))
		.get("/api/wallets/030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd")
		.reply(200, require("../test/fixtures/client/wallet-non-resigned.json"))

		// second wallet
		.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
		.reply(200, require("../test/fixtures/client/wallet-2.json"))
		.get("/api/wallets/022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce")
		.reply(200, require("../test/fixtures/client/wallet-2.json"))

		// Musig wallet
		.get("/api/wallets/DML7XEfePpj5qDFb1SbCWxLRhzdTDop7V1")
		.reply(200, require("../test/fixtures/client/wallet-musig.json"))
		.get("/api/wallets/02cec9caeb855e54b71e4d60c00889e78107f6136d1f664e5646ebcb2f62dae2c6")
		.reply(200, require("../test/fixtures/client/wallet-musig.json"))

		.get("/api/delegates")
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../test/fixtures/client/delegates-2.json"))
		.get("/api/transactions/3e0b2e5ed00b34975abd6dee0ca5bd5560b5bd619b26cf6d8f70030408ec5be3")
		.query(true)
		.reply(200, () => {
			const response = require("../test/fixtures/client/transactions.json");
			return { data: response.data[0] };
		})
		.get("/api/transactions/bb9004fa874b534905f9eff201150f7f982622015f33e076c52f1e945ef184ed")
		.query(true)
		.reply(200, () => {
			const response = require("../test/fixtures/client/transactions.json");
			return { data: response.data[1] };
		})
		.get("/api/transactions")
		.query(true)
		.reply(200, require("../test/fixtures/client/transactions.json"))
		// CryptoCompare
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	const profileRepository = container.get(Identifiers.ProfileRepository);
	profileRepository.flush();
	profile = profileRepository.create("John Doe");

	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});
});

test.before(() => nock.disableNetConnect());

test("should return current votes", async () => {
	assert.throws(
		() => subject.voting().available(),
		"The voting data has not been synced. Please call [synchroniser().votes()] before accessing votes.",
	);

	await container.get(Identifiers.DelegateService).sync(profile, "ARK", "ark.devnet");
	await subject.synchroniser().votes();

	assert.length(subject.voting().current(), 1);
	assert.is(subject.voting().current()[0].wallet?.address(), "DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve");
	assert.is(subject.voting().current()[0].wallet?.username(), "alessio");
});

test("should return votes available", () => {
	assert.throws(
		() => subject.voting().available(),
		"The voting data has not been synced. Please call [synchroniser().votes()] before accessing votes.",
	);

	subject.data().set(WalletData.VotesAvailable, 2);

	assert.is(subject.voting().available(), 2);
});

test("should return votes used", () => {
	assert.throws(
		() => subject.voting().used(),
		"The voting data has not been synced. Please call [synchroniser().votes()] before accessing votes.",
	);

	subject.data().set(WalletData.VotesUsed, 2);

	assert.is(subject.voting().used(), 2);
});

test.run();
