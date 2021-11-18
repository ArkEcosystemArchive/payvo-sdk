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

let profile: IProfile;
let subject: IReadWriteWallet;

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

    const profileRepository = container.get<IProfileRepository>(Identifiers.ProfileRepository);
    profileRepository.flush();
    profile = profileRepository.create("John Doe");

    subject = await profile.walletFactory().fromMnemonicWithBIP39({
        coin: "ARK",
        network: "ark.devnet",
        mnemonic: identity.mnemonic,
    });
});

test.after.each(() => jest.restoreAllMocks());

test("should have a coin", () => {
    assert.is(subject.coin() instanceof Coins.Coin);
});

test("should have a network", () => {
    assert.is(subject.network().toObject()).toMatchSnapshot();
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
    const live = jest.spyOn(subject.network(), "isLive").mockReturnValue(true);
    const test = jest.spyOn(subject.network(), "isTest").mockReturnValue(false);

    wallet.data().set(WalletData.Balance, { available: 1e8, fees: 1e8 });

    assert.is(wallet.convertedBalance()), "number");
assert.is(wallet.convertedBalance(), 0);

await container.get<IExchangeRateService>(Identifiers.ExchangeRateService).syncAll(profile, "DARK");
assert.is(wallet.convertedBalance(), 0.00005048);

live.mockRestore();
test.mockRestore();
});

test("should not have a converted balance if it is a live wallet but has no exchange rate", async () => {
    const live = jest.spyOn(subject.network(), "isLive").mockReturnValue(true);
    const test = jest.spyOn(subject.network(), "isTest").mockReturnValue(false);

    assert.is(subject.convertedBalance(), 0);

    live.mockRestore();
    test.mockRestore();
});

test("should not have a converted balance if it is a test wallet", async () => {
    const live = jest.spyOn(subject.network(), "isLive").mockReturnValue(false);
    const test = jest.spyOn(subject.network(), "isTest").mockReturnValue(true);

    assert.is(subject.convertedBalance(), 0);

    live.mockRestore();
    test.mockRestore();
});

test("should have a nonce", () => {
    assert.is(subject.nonce(), BigNumber.make("111932"));

    subject.data().set(WalletData.Sequence, undefined);

    assert.is(subject.nonce().toNumber(), 0);
});

test("should have a manifest service", () => {
    assert.is(subject.manifest() instanceof Coins.Manifest);
});

test("should have a config service", () => {
    assert.is(subject.config() instanceof Coins.ConfigRepository);
});

test("should have a client service", () => {
    assert.is(subject.client(), "object");
});

test("should have a address service", () => {
    assert.is(subject.addressService(), "object");
});

test("should have a extended address service", () => {
    assert.is(subject.extendedAddressService(), "object");
});

test("should have a key pair service", () => {
    assert.is(subject.keyPairService(), "object");
});

test("should have a private key service", () => {
    assert.is(subject.privateKeyService(), "object");
});

test("should have a public key service", () => {
    assert.is(subject.publicKeyService(), "object");
});

test("should have a wif service", () => {
    assert.is(subject.wifService(), "object");
});

test("should have a ledger service", () => {
    assert.is(subject.ledger(), "object");
});

test("should have a ledger model", () => {
    assert.is(subject.balance(), 558270.93444556);

    subject.data().set(WalletData.LedgerModel, WalletLedgerModel.NanoS);
    assert.is(subject.data().get(WalletData.LedgerModel), WalletLedgerModel.NanoS);
    assert.is(subject.isLedgerNanoS(), true);
    assert.is(subject.isLedgerNanoX(), false);

    subject.data().set(WalletData.LedgerModel, WalletLedgerModel.NanoX);
    assert.is(subject.data().get(WalletData.LedgerModel), WalletLedgerModel.NanoX);
    assert.is(subject.isLedgerNanoX(), true);
    assert.is(subject.isLedgerNanoS(), false);
});

test("should have a link service", () => {
    assert.is(subject.link(), "object");
});

test("should have a message service", () => {
    assert.is(subject.message(), "object");
});

test("should have a signatory service", () => {
    assert.is(subject.signatory(), "object");
});

test("should have a list of supported transaction types", () => {
    assert.is(subject.transactionTypes()).toBeArray();
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
    const usernameSpy = jest.spyOn(subject, "username").mockReturnValue(undefined);

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
    assert.is(subject.avatar()).toMatchInlineSnapshot(
        `"<svg version=\\"1.1\\" xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"picasso\\" width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill=\\"rgb(244, 67, 54)\\" width=\\"100\\" height=\\"100\\"/><circle r=\\"45\\" cx=\\"80\\" cy=\\"40\\" fill=\\"rgb(139, 195, 74)\\"/><circle r=\\"40\\" cx=\\"10\\" cy=\\"30\\" fill=\\"rgb(0, 188, 212)\\"/><circle r=\\"60\\" cx=\\"30\\" cy=\\"50\\" fill=\\"rgb(255, 193, 7)\\"/></svg>"`,
    );

    subject.data().set(WalletSetting.Avatar, "my-avatar");

    assert.is(subject.avatar(), "my-avatar"`);
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
    assert.is(subject.secondPublicKey()), "undefined");

subject = new Wallet(UUID.random(), {}, profile);

assert.is(() => subject.secondPublicKey()).toThrow(
    "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
);
});

test("should have a username", async () => {
    assert.is(subject.username(), "arkx");

    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.username()).toThrow(
        "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
    );
});

test("should respond on whether it is a delegate or not", async () => {
    assert.is(subject.isDelegate(), true);

    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.isDelegate()).toThrow(
        "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
    );
});

test("should respond on whether it is a resigned delegate or not", async () => {
    assert.is(subject.isResignedDelegate(), false);

    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.isResignedDelegate()).toThrow(
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

    assert.is(subject.isKnown(), false);
});

test("should respond on whether it is owned by exchange", () => {
    if (container.has(Identifiers.KnownWalletService)) {
        container.unbind(Identifiers.KnownWalletService);
    }

    container.constant(Identifiers.KnownWalletService, {
        isExchange: (a, b) => false,
    });

    assert.is(subject.isOwnedByExchange(), false);
});

test("should respond on whether it is owned by a team", () => {
    if (container.has(Identifiers.KnownWalletService)) {
        container.unbind(Identifiers.KnownWalletService);
    }

    container.constant(Identifiers.KnownWalletService, {
        isTeam: (a, b) => false,
    });

    assert.is(subject.isOwnedByTeam(), false);
});

test("should respond on whether it is ledger", () => {
    assert.is(subject.isLedger(), false);
});

test("should respond on whether it is multi signature or not", async () => {
    assert.is(subject.isMultiSignature(), false);

    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.isMultiSignature()).toThrow(
        "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
    );
});

test("should respond on whether it is second signature or not", async () => {
    assert.is(subject.isSecondSignature(), false);

    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.isSecondSignature()).toThrow(
        "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
    );
});

test("should have a transaction service", () => {
    assert.is(subject.transaction(), "object");
});

test("should return whether it has synced with network", async () => {
    subject = new Wallet(UUID.random(), {}, profile);
    subject.data().set(WalletData.ImportMethod, WalletImportMethod.Address);

    assert.is(subject.hasSyncedWithNetwork(), false);

    await subject.mutator().coin("ARK", "ark.devnet");
    await subject.mutator().identity(identity.mnemonic);

    assert.is(subject.hasSyncedWithNetwork(), true);
});

test("should return explorer link", () => {
    assert.is(subject.explorerLink(), "https://dexplorer.ark.io/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
});

test("should turn into an object", () => {
    subject.data().set("key", "value");

    subject.data().set(WalletData.DerivationPath, "1");
    subject.data().set(WalletFlag.Starred, true);

    const actual = subject.toObject();

    assert.is(actual).toContainAllKeys(["id", "data", "settings"]);
    assert.is(actual.id), "string");
assert.is(actual.data[WalletData.Address], "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
assert.is(actual.data[WalletData.Coin], "ARK");
assert.is(actual.data[WalletData.Network], "ark.devnet");
assert.is(actual.data[WalletData.PublicKey],
    "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
);
assert.is(actual.data, {
    ADDRESS: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
    BALANCE: {
        available: "55827093444556",
        fees: "55827093444556",
    },
    BIP38_ENCRYPTED_KEY: undefined,
    BROADCASTED_TRANSACTIONS: {},
    COIN: "ARK",
    DERIVATION_PATH: "1",
    DERIVATION_TYPE: "bip39",
    IMPORT_METHOD: "BIP39.MNEMONIC",
    NETWORK: "ark.devnet",
    PUBLIC_KEY: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
    SEQUENCE: "111932",
    SIGNED_TRANSACTIONS: {},
    STARRED: true,
    VOTES: [],
    VOTES_USED: 0,
    VOTES_AVAILABLE: 0,
    PENDING_MULTISIGNATURE_TRANSACTIONS: {},
    STATUS: "COLD",
});
assert.is(actual.settings, "object");
assert.is(actual.settings.AVATAR), "string");
});

test("should have a primary key", () => {
    assert.is(subject.primaryKey(), subject.address());
});

test("should throw if the primary key is accessed before the wallet has been synchronized", async () => {
    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.primaryKey()).toThrow(
        "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
    );
});

test("should have an underlying `WalletData` instance", () => {
    assert.is(subject.toData().primaryKey(), subject.address());
});

test("should throw if the underlying `WalletData` instance is accessed before the wallet has been synchronized", async () => {
    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(() => subject.toData().primaryKey()).toThrow(
        "This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.",
    );
});

test("should return whether it can vote or not", () => {
    subject.data().set(WalletData.VotesAvailable, 0);

    assert.is(subject.canVote(), false);

    subject.data().set(WalletData.VotesAvailable, 2);

    assert.is(subject.canVote(), true);
});

test("should construct a coin instance", async () => {
    const mockConstruct = jest.spyOn(subject.getAttributes().get<Coins.Coin>("coin"), "__construct");

    await subject.connect();

    assert.is(mockConstruct).toHaveBeenCalledTimes(1);
});

test("should throw if a connection is tried to be established but no coin has been set", async () => {
    subject = await profile.walletFactory().fromMnemonicWithBIP39({
        coin: "ARK",
        network: "ark.devnet",
        mnemonic: identity.mnemonic,
    });

    jest.spyOn(subject, "hasCoin").mockReturnValue(false);

    await assert.is(subject.connect()).toReject();
});

test("should determine if the wallet has a coin attached to it", async () => {
    assert.is(subject.hasCoin(), true);

    subject = new Wallet(UUID.random(), {}, profile);

    assert.is(subject.hasCoin(), false);
});

test("should determine if the wallet has been fully restored", async () => {
    subject = await profile.walletFactory().fromMnemonicWithBIP39({
        coin: "ARK",
        network: "ark.devnet",
        mnemonic: identity.mnemonic,
    });

    subject.markAsPartiallyRestored();

    assert.is(subject.hasBeenFullyRestored(), false);

    subject.markAsFullyRestored();

    assert.is(subject.hasBeenFullyRestored(), true);
});

test("should determine if the wallet has been partially restored", async () => {
    subject = await profile.walletFactory().fromMnemonicWithBIP39({
        coin: "ARK",
        network: "ark.devnet",
        mnemonic: identity.mnemonic,
    });

    assert.is(subject.hasBeenPartiallyRestored(), false);

    subject.markAsPartiallyRestored();

    assert.is(subject.hasBeenPartiallyRestored(), true);
});

test("should determine if the wallet can perform write actions", () => {
    subject.data().set(WalletData.ImportMethod, WalletImportMethod.Address);

    assert.is(subject.canWrite(), false);

    subject.data().set(WalletData.ImportMethod, WalletImportMethod.PublicKey);

    assert.is(subject.canWrite(), false);

    subject.data().set(WalletData.ImportMethod, WalletImportMethod.PrivateKey);

    assert.is(subject.canWrite(), true);
});

test("should determine if the wallet acts with mnemonic", () => {
    assert.is(subject.actsWithMnemonic()), "boolean");
});

test("should determine if the wallet acts with address", () => {
    assert.is(subject.actsWithAddress()), "boolean");
});

test("should determine if the wallet acts with public key", () => {
    assert.is(subject.actsWithPublicKey()), "boolean");
});

test("should determine if the wallet acts with private key", () => {
    assert.is(subject.actsWithPrivateKey()), "boolean");
});

test("should determine if the wallet acts with address with ledger path", () => {
    assert.is(subject.actsWithAddressWithDerivationPath()), "boolean");
});

test("should determine if the wallet acts with mnemonic with encryption", () => {
    assert.is(subject.actsWithMnemonicWithEncryption()), "boolean");
});

test("should determine if the wallet acts with wif", () => {
    assert.is(subject.actsWithWif()), "boolean");
});

test("should determine if the wallet acts with wif with encryption", () => {
    assert.is(subject.actsWithWifWithEncryption()), "boolean");
});

test("should determine if the wallet acts with a secret", () => {
    assert.is(subject.actsWithSecret()), "boolean");
});

test("should determine if the wallet acts with a secret with encryption", () => {
    assert.is(subject.actsWithSecretWithEncryption()), "boolean");
});

test("should have a signing key instance", () => {
    assert.is(subject.signingKey() instanceof WalletImportFormat);
});

test("should have a confirmation key instance", () => {
    assert.is(subject.confirmKey() instanceof WalletImportFormat);
});

test("should determine if wallet is is a cold wallet", async () => {
    assert.is(subject.isCold()), "boolean");
});

test("should unset cold wallet status if outgoing transaction is found", async () => {
    subject = await profile.walletFactory().fromAddress({
        coin: "ARK",
        network: "ark.devnet",
        address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8",
    });

    assert.is(subject.isCold(), true);

    await subject.transactionIndex().all();

    assert.is(subject.isCold(), false);
});

test("should determine if a wallet uses an encryption paassword", () => {
    assert.is(subject.usesPassword(), false);

    subject.signingKey().set(identity.mnemonic, "password");

    assert.is(subject.usesPassword(), true);
});

test("should have a signatory factory", () => {
    assert.is(subject.signatoryFactory() instanceof SignatoryFactory);
});
