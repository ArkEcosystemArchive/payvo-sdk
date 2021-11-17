import "reflect-metadata";

import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer } from "../test/mocking.js";
import { container } from "./container.js";
import { Identifiers } from "./container.models";
import { ReadOnlyWallet } from "./read-only-wallet.js";
import { Wallet } from "./wallet.js";
import { IProfile, IProfileRepository, IReadWriteWallet, WalletData } from "./contracts.js";

let profile: IProfile;
let subject: IReadWriteWallet;

beforeAll(() => bootContainer());

beforeEach(async () => {
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

	const profileRepository = container.get<IProfileRepository>(Identifiers.ProfileRepository);
	profileRepository.flush();
	profile = profileRepository.create("John Doe");

	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});
});

beforeAll(() => nock.disableNetConnect());

it("should return multi signature", async () => {
	expect(() => subject.multiSignature().all()).toThrow("This wallet does not have a multi-signature registered.");

	subject = new Wallet(UUID.random(), {}, profile);

	expect(() => subject.multiSignature().all()).toThrow(
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

it("should return multi-signature participants", async () => {
	const isMultiSignature = jest.spyOn(subject, "isMultiSignature").mockReturnValue(true);
	const multiSignature = jest.spyOn(subject.multiSignature(), "all").mockReturnValue({
		min: 2,
		publicKeys: [
			"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
			"022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce",
		],
	});

	await subject.synchroniser().identity();
	await subject.synchroniser().multiSignature();

	expect(subject.multiSignature().participants()).toHaveLength(2);
	expect(subject.multiSignature().participants()[0]).toBeInstanceOf(ReadOnlyWallet);
	expect(subject.multiSignature().participants()[1]).toBeInstanceOf(ReadOnlyWallet);

	isMultiSignature.mockRestore();
	multiSignature.mockRestore();
});

it("should throw if the wallet does not have a multi-signature registered", async () => {
	subject.data().set(WalletData.MultiSignatureParticipants, {
		min: 2,
		publicKeys: [
			"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
			"022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce",
		],
	});

	await subject.synchroniser().identity();
	await subject.synchroniser().multiSignature();

	expect(() => subject.multiSignature().participants()).toThrow(
		"This wallet does not have a multi-signature registered.",
	);
});

it("should throw if the multi-signature has not been synchronized yet", async () => {
	subject.data().set(WalletData.MultiSignatureParticipants, undefined);

	await subject.synchroniser().identity();

	expect(() => subject.multiSignature().participants()).toThrow(
		"This Multi-Signature has not been synchronized yet. Please call [synchroniser().multiSignature()] before using it.",
	);
});

it("should list all participants with a standard multi signature", async () => {
	jest.spyOn(subject.multiSignature(), "all").mockReturnValue({
		min: 2,
		publicKeys: ["a", "b"],
	});

	expect(subject.multiSignature().publicKeys()).toMatchInlineSnapshot(`
		Array [
		  "a",
		  "b",
		]
	`);
});

it("should list all participants with an advanced multi signature", async () => {
	jest.spyOn(subject.multiSignature(), "all").mockReturnValue({
		numberOfSignatures: 2,
		mandatoryKeys: ["a", "b"],
		optionalKeys: ["c", "d"],
	});

	expect(subject.multiSignature().publicKeys()).toMatchInlineSnapshot(`
		Array [
		  "a",
		  "b",
		  "c",
		  "d",
		]
	`);
});
