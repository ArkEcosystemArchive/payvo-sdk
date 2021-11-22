import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";
import { Coins } from "@payvo/sdk";
import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import {
	IExchangeRateService,
	IProfile,
	IProfileRepository,
	IReadWriteWallet,
	WalletData,
	WalletFlag,
	WalletImportMethod,
	WalletLedgerModel,
	WalletSetting,
} from "./contracts";
import { ExchangeRateService } from "./exchange-rate.service";
import { SignatoryFactory } from "./signatory.factory";
import { Wallet } from "./wallet";
import { WalletImportFormat } from "./wif";

let profile;
let subject;

test.before(() => {
	nock.disableNetConnect();

	bootContainer();
});

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
		.reply(200, () => require("../test/fixtures/client/transactions.json"))
		// CryptoCompare
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	// Make sure we don't persist any data between runs
	if (container.has(Identifiers.ExchangeRateService)) {
		container.unbind(Identifiers.ExchangeRateService);
		container.singleton(Identifiers.ExchangeRateService, ExchangeRateService);
	}

	const profileRepository = container.get(Identifiers.ProfileRepository);
	profileRepository.flush();
	profile = profileRepository.create("John Doe");

	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});
});

// test.after.each(() => jest.restoreAllMocks());

test("should have a coin", () => {
	assert.instance(subject.coin(), Coins.Coin);
});

test("should have a network", () => {
	assert.object(subject.network().toObject());
});

test("should have an address", () => {
	assert.is(subject.address(), identity.address);
});

test("should have a publicKey", () => {
	assert.is(subject.publicKey(), identity.publicKey);
});

test("should have an import method", () => {
	assert.is(subject.importMethod(), WalletImportMethod.BIP39.MNEMONIC);
});

test("should have a derivation method", () => {
	assert.is(subject.derivationMethod(), "bip39");
});

test("should have a balance", () => {
	assert.is(subject.balance(), 558270.93444556);

	subject.data().set(WalletData.Balance, undefined);

	assert.is(subject.balance(), 0);
});

test("should have a converted balance if it is a live wallet", async () => {
	// cryptocompare
	nock(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	const wallet = await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");
	const live = mockery(subject.network(), "isLive").mockReturnValue(true);
	const test = mockery(subject.network(), "isTest").mockReturnValue(false);

	wallet.data().set(WalletData.Balance, { available: 1e8, fees: 1e8 });

	assert.number(wallet.convertedBalance());
	assert.is(wallet.convertedBalance(), 0);

	await container.get(Identifiers.ExchangeRateService).syncAll(profile, "DARK");
	assert.is(wallet.convertedBalance(), 0.00005048);

	live.mockRestore();
	test.mockRestore();
});

test("should not have a converted balance if it is a live wallet but has no exchange rate", async () => {
	const live = mockery(subject.network(), "isLive").mockReturnValue(true);
	const test = mockery(subject.network(), "isTest").mockReturnValue(false);

	assert.is(subject.convertedBalance(), 0);

	live.mockRestore();
	test.mockRestore();
});

test("should not have a converted balance if it is a test wallet", async () => {
	const live = mockery(subject.network(), "isLive").mockReturnValue(false);
	const test = mockery(subject.network(), "isTest").mockReturnValue(true);

	assert.is(subject.convertedBalance(), 0);

	live.mockRestore();
	test.mockRestore();
});

test("should have a nonce", () => {
	assert.equal(subject.nonce(), BigNumber.make("111932"));

	subject.data().set(WalletData.Sequence, undefined);

	assert.is(subject.nonce().toNumber(), 0);
});

test("should have a manifest service", () => {
	assert.instance(subject.manifest(), Coins.Manifest);
});

test("should have a config service", () => {
	assert.instance(subject.config(), Coins.ConfigRepository);
});

test("should have a client service", () => {
	assert.object(subject.client());
});

test("should have a address service", () => {
	assert.object(subject.addressService());
});

test("should have a extended address service", () => {
	assert.object(subject.extendedAddressService());
});

test("should have a key pair service", () => {
	assert.object(subject.keyPairService());
});

test("should have a private key service", () => {
	assert.object(subject.privateKeyService());
});

test("should have a public key service", () => {
	assert.object(subject.publicKeyService());
});

test("should have a wif service", () => {
	assert.object(subject.wifService());
});

test("should have a ledger service", () => {
	assert.object(subject.ledger());
});

test("should have a ledger model", () => {
	assert.is(subject.balance(), 558270.93444556);

	subject.data().set(WalletData.LedgerModel, WalletLedgerModel.NanoS);
	assert.is(subject.data().get(WalletData.LedgerModel), WalletLedgerModel.NanoS);
	assert.true(subject.isLedgerNanoS());
	assert.false(subject.isLedgerNanoX());

	subject.data().set(WalletData.LedgerModel, WalletLedgerModel.NanoX);
	assert.is(subject.data().get(WalletData.LedgerModel), WalletLedgerModel.NanoX);
	assert.true(subject.isLedgerNanoX());
	assert.false(subject.isLedgerNanoS());
});

test("should have a link service", () => {
	assert.object(subject.link());
});

test("should have a message service", () => {
	assert.object(subject.message());
});

test("should have a signatory service", () => {
	assert.object(subject.signatory());
});

test("should have a list of supported transaction types", () => {
	assert.array(subject.transactionTypes());
});

test("should have an exchange currency", () => {
	assert.is(subject.exchangeCurrency(), "BTC");
});

test("should have a display name (alias)", () => {
	subject.mutator().alias("alias");
	assert.is(subject.displayName(), subject.alias());
});

test("should have a display name (username)", () => {
	assert.is(subject.displayName(), subject.username());
});

test("should have a display name (knownName)", () => {
	const usernameSpy = mockery(subject, "username").mockReturnValue(undefined);

	if (container.has(Identifiers.KnownWalletService)) {
		container.unbind(Identifiers.KnownWalletService);
	}

	container.constant(Identifiers.KnownWalletService, {
		name: (a, b) => "knownWallet",
	});

	assert.is(subject.displayName(), subject.knownName());

	usernameSpy.mockRestore();
});

test("should have an avatar", () => {
	assert.string(subject.avatar());

	subject.data().set(WalletSetting.Avatar, "my-avatar");

	assert.is(subject.avatar(), "my-avatar");
});

test("should have a known name", () => {
	if (container.has(Identifiers.KnownWalletService)) {
		container.unbind(Identifiers.KnownWalletService);
	}

	container.constant(Identifiers.KnownWalletService, {
		name: (a, b) => "arkx",
	});

	assert.is(subject.knownName(), "arkx");
});

test("should have a second public key", async () => {
	assert.undefined(subject.secondPublicKey());

	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.secondPublicKey(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should have a username", async () => {
	assert.is(subject.username(), "arkx");

	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.username(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should respond on whether it is a delegate or not", async () => {
	assert.true(subject.isDelegate());

	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.isDelegate(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should respond on whether it is a resigned delegate or not", async () => {
	assert.false(subject.isResignedDelegate());

	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.isResignedDelegate(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should respond on whether it is known", () => {
	if (container.has(Identifiers.KnownWalletService)) {
		container.unbind(Identifiers.KnownWalletService);
	}

	container.constant(Identifiers.KnownWalletService, {
		is: (a, b) => false,
	});

	assert.false(subject.isKnown());
});

test("should respond on whether it is owned by exchange", () => {
	if (container.has(Identifiers.KnownWalletService)) {
		container.unbind(Identifiers.KnownWalletService);
	}

	container.constant(Identifiers.KnownWalletService, {
		isExchange: (a, b) => false,
	});

	assert.false(subject.isOwnedByExchange());
});

test("should respond on whether it is owned by a team", () => {
	if (container.has(Identifiers.KnownWalletService)) {
		container.unbind(Identifiers.KnownWalletService);
	}

	container.constant(Identifiers.KnownWalletService, {
		isTeam: (a, b) => false,
	});

	assert.false(subject.isOwnedByTeam());
});

test("should respond on whether it is ledger", () => {
	assert.false(subject.isLedger());
});

test("should respond on whether it is multi signature or not", async () => {
	assert.false(subject.isMultiSignature());

	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.isMultiSignature(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should respond on whether it is second signature or not", async () => {
	assert.false(subject.isSecondSignature());

	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.isSecondSignature(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should have a transaction service", () => {
	assert.object(subject.transaction());
});

test("should return whether it has synced with network", async () => {
	subject = new Wallet(UUID.random(), {}, profile);
	subject.data().set(WalletData.ImportMethod, WalletImportMethod.Address);

	assert.false(subject.hasSyncedWithNetwork());

	await subject.mutator().coin("ARK", "ark.devnet");
	await subject.mutator().identity(identity.mnemonic);

	assert.true(subject.hasSyncedWithNetwork());
});

test("should return explorer link", () => {
	assert.is(subject.explorerLink(), "https://dexplorer.ark.io/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
});

test("should turn into an object", () => {
	subject.data().set("key", "value");

	subject.data().set(WalletData.DerivationPath, "1");
	subject.data().set(WalletFlag.Starred, true);

	const actual = subject.toObject();

	assert.containKeys(actual, ["id", "data", "settings"]);
	assert.string(actual.id);
	assert.is(actual.data[WalletData.Address], "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
	assert.is(actual.data[WalletData.Coin], "ARK");
	assert.is(actual.data[WalletData.Network], "ark.devnet");
	assert.is(actual.data[WalletData.PublicKey], "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd");
	assert.equal(actual.data, {
		COIN: "ARK",
		NETWORK: "ark.devnet",
		ADDRESS: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		PUBLIC_KEY: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
		BALANCE: { available: "55827093444556", fees: "55827093444556" },
		BROADCASTED_TRANSACTIONS: {},
		DERIVATION_PATH: "1",
		DERIVATION_TYPE: "bip39",
		IMPORT_METHOD: "BIP39.MNEMONIC",
		SEQUENCE: "111932",
		SIGNED_TRANSACTIONS: {},
		PENDING_MULTISIGNATURE_TRANSACTIONS: {},
		VOTES: [],
		VOTES_AVAILABLE: 0,
		VOTES_USED: 0,
		ENCRYPTED_SIGNING_KEY: undefined,
		ENCRYPTED_CONFIRM_KEY: undefined,
		STARRED: true,
		LEDGER_MODEL: undefined,
		STATUS: "COLD",
	});
	assert.object(actual.settings);
	assert.string(actual.settings.AVATAR);
});

test("should have a primary key", () => {
	assert.is(subject.primaryKey(), subject.address());
});

test("should throw if the primary key is accessed before the wallet has been synchronized", async () => {
	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.primaryKey(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should have an underlying `WalletData` instance", () => {
	assert.is(subject.toData().primaryKey(), subject.address());
});

test("should throw if the underlying `WalletData` instance is accessed before the wallet has been synchronized", async () => {
	subject = new Wallet(UUID.random(), {}, profile);

	assert.throws(
		() => subject.toData().primaryKey(),
		"This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
	);
});

test("should return whether it can vote or not", () => {
	subject.data().set(WalletData.VotesAvailable, 0);

	assert.false(subject.canVote());

	subject.data().set(WalletData.VotesAvailable, 2);

	assert.true(subject.canVote());
});

test("should construct a coin instance", async () => {
	const mockConstruct = mockery(subject.getAttributes().get("coin"), "__construct");

	await subject.connect();

	mockConstruct.calledTimes(1);
});

test("should throw if a connection is tried to be established but no coin has been set", async () => {
	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});

	mockery(subject, "hasCoin").mockReturnValue(false);

	await assert.rejects(() => subject.connect());
});

test("should determine if the wallet has a coin attached to it", async () => {
	assert.true(subject.hasCoin());

	subject = new Wallet(UUID.random(), {}, profile);

	assert.false(subject.hasCoin());
});

test("should determine if the wallet has been fully restored", async () => {
	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});

	subject.markAsPartiallyRestored();

	assert.false(subject.hasBeenFullyRestored());

	subject.markAsFullyRestored();

	assert.true(subject.hasBeenFullyRestored());
});

test("should determine if the wallet has been partially restored", async () => {
	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});

	assert.false(subject.hasBeenPartiallyRestored());

	subject.markAsPartiallyRestored();

	assert.true(subject.hasBeenPartiallyRestored());
});

test("should determine if the wallet can perform write actions", () => {
	subject.data().set(WalletData.ImportMethod, WalletImportMethod.Address);

	assert.false(subject.canWrite());

	subject.data().set(WalletData.ImportMethod, WalletImportMethod.PublicKey);

	assert.false(subject.canWrite());

	subject.data().set(WalletData.ImportMethod, WalletImportMethod.PrivateKey);

	assert.true(subject.canWrite());
});

test("should determine if the wallet acts with mnemonic", () => {
	assert.boolean(subject.actsWithMnemonic());
});

test("should determine if the wallet acts with address", () => {
	assert.boolean(subject.actsWithAddress());
});

test("should determine if the wallet acts with public key", () => {
	assert.boolean(subject.actsWithPublicKey());
});

test("should determine if the wallet acts with private key", () => {
	assert.boolean(subject.actsWithPrivateKey());
});

test("should determine if the wallet acts with address with ledger path", () => {
	assert.boolean(subject.actsWithAddressWithDerivationPath());
});

test("should determine if the wallet acts with mnemonic with encryption", () => {
	assert.boolean(subject.actsWithMnemonicWithEncryption());
});

test("should determine if the wallet acts with wif", () => {
	assert.boolean(subject.actsWithWif());
});

test("should determine if the wallet acts with wif with encryption", () => {
	assert.boolean(subject.actsWithWifWithEncryption());
});

test("should determine if the wallet acts with a secret", () => {
	assert.boolean(subject.actsWithSecret());
});

test("should determine if the wallet acts with a secret with encryption", () => {
	assert.boolean(subject.actsWithSecretWithEncryption());
});

test("should have a signing key instance", () => {
	assert.instance(subject.signingKey(), WalletImportFormat);
});

test("should have a confirmation key instance", () => {
	assert.instance(subject.confirmKey(), WalletImportFormat);
});

test("should determine if wallet is is a cold wallet", async () => {
	assert.boolean(subject.isCold());
});

test("should unset cold wallet status if outgoing transaction is found", async () => {
	subject = await profile.walletFactory().fromAddress({
		coin: "ARK",
		network: "ark.devnet",
		address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8",
	});

	assert.true(subject.isCold());

	await subject.transactionIndex().all();

	assert.false(subject.isCold());
});

test("should determine if a wallet uses an encryption paassword", () => {
	assert.false(subject.usesPassword());

	subject.signingKey().set(identity.mnemonic, "password");

	assert.true(subject.usesPassword());
});

test("should have a signatory factory", () => {
	assert.instance(subject.signatoryFactory(), SignatoryFactory);
});

test.run();
