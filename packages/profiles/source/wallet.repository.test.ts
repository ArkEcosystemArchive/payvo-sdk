import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer } from "../test/mocking.js";
import { IProfile, IReadWriteWallet, IWalletData, ProfileSetting } from "./contracts.js";
import { Profile } from "./profile.js";
import { Wallet } from "./wallet.js";
import { WalletData } from "./wallet.enum";
import { WalletFactory } from "./wallet.factory";
import { WalletRepository } from "./wallet.repository";

jest.setTimeout(60_000);

const generate = async (coin: string, network: string): Promise<IReadWriteWallet> => {
    const { wallet } = await factory.generate({ coin, network });

    subject.push(wallet);

    return wallet;
};

const importByMnemonic = async (mnemonic: string, coin: string, network: string, bip): Promise<IReadWriteWallet> => {
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

let subject: WalletRepository;
let factory: WalletFactory;

beforeAll(() => bootContainer());

test.before.each(async () => {
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
});

beforeAll(() => nock.disableNetConnect());

test("#all", () => {
    assert.is(subject.all()), "object");
});

test("#first", () => {
    assert.is(subject.first()), "object");
});

test("#last", () => {
    assert.is(subject.last()), "object");
});

test("#allByCoin", async () => {
    await importByMnemonic(
        "upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
        "ARK",
        "ark.devnet",
        39,
    );

    assert.is(subject.allByCoin()), "object");
assert.is(subject.allByCoin().DARK), "object");
});

test("#filterByAddress", () => {
    const wallets = subject.filterByAddress(identity.address);

    assert.is(wallets).toBeArray();

    for (const wallet of wallets) {
        assert.is(wallet instanceof Wallet);
    }
});

test("#findByAddressWithNetwork", () => {
    assert.is(subject.findByAddressWithNetwork(identity.address, "ark.devnet") instanceof Wallet);
});

test("#findByPublicKey", () => {
    assert.is(subject.findByPublicKey(identity.publicKey) instanceof Wallet);
});

test("#findByCoin", () => {
    assert.is(subject.findByCoin("ARK")).toHaveLength(1);
});

test("#findByCoinWithNetwork", () => {
    assert.is(subject.findByCoinWithNetwork("ARK", "ark.devnet")).toHaveLength(1);
});

test("#has", async () => {
    const wallet = subject.first();

    assert.is(subject.has(wallet.id()), true);
    assert.is(subject.has("whatever"), false);
});

test("#forget", async () => {
    const wallet = subject.first();

    assert.is(subject.has(wallet.id()), true);

    subject.forget(wallet.id());

    assert.is(subject.has(wallet.id()), false);
});

test("#findByAlias", async () => {
    await generate("ARK", "ark.devnet");

    assert.is(subject.findByAlias("Alias") instanceof Wallet);
    assert.is(subject.findByAlias("Not Exist")), "undefined");
});

test("#push", async () => {
    subject.flush();

    await assert.is(importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39)).toResolve();
    await assert.is(importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39)).toReject();

    const wallet = subject.first();

    jest.spyOn(wallet, "networkId").mockReturnValueOnce("ark.mainnet");

    await assert.is(importByMnemonic(identity.mnemonic, "ARK", "ark.devnet", 39)).toResolve();
});

test("#update", async () => {
    assert.is(() => subject.update("invalid", { alias: "My Wallet" })).toThrowError("Failed to find");

    const wallet = await generate("ARK", "ark.devnet");

    subject.update(wallet.id(), { alias: "My New Wallet" });

    assert.is(subject.findById(wallet.id()).alias(), "My New Wallet");

    subject.update(wallet.id(), {});

    assert.is(subject.findById(wallet.id()).alias(), "My New Wallet");

    const newWallet = await generate("ARK", "ark.devnet");

    assert.is(() => subject.update(newWallet.id(), { alias: "My New Wallet" })).toThrowError(
        "The wallet with alias [My New Wallet] already exists.",
    );
});

describe("#fill", () => {
    it("should fill the wallet", async () => {
        const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
        profile.settings().set(ProfileSetting.Name, "John Doe");

        const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
            coin: "ARK",
            mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
            network: "ark.devnet",
        });

        assert.is(
            // @ts-ignore
            await subject.fill({
                [newWallet.id()]: {
                    data: newWallet.data().all(),
                    id: newWallet.id(),
                    settings: newWallet.settings().all(),
                },
            }),
        );

        assert.is(subject.findById(newWallet.id())).toStrictEqual(newWallet);
    });

    it("should fail to fill the wallet if the coin doesn't exist", async () => {
        const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
        profile.settings().set(ProfileSetting.Name, "John Doe");

        const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
            coin: "ARK",
            mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
            network: "ark.devnet",
        });

        newWallet.data().set(WalletData.Coin, "invalid");

        assert.is(
            // @ts-ignore
            await subject.fill({
                [newWallet.id()]: {
                    data: newWallet.data().all(),
                    id: newWallet.id(),
                    settings: newWallet.settings().all(),
                },
            }),
        );

        assert.is(subject.findById(newWallet.id()).isMissingCoin(), true);
        assert.is(subject.findById(newWallet.id()).isMissingNetwork(), true);
    });

    it("should fail to fill the wallet if the network doesn't exist", async () => {
        const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
        profile.settings().set(ProfileSetting.Name, "John Doe");

        const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
            coin: "ARK",
            mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
            network: "ark.devnet",
        });

        newWallet.data().set(WalletData.Network, "invalid");

        assert.is(
            // @ts-ignore
            await subject.fill({
                [newWallet.id()]: {
                    data: newWallet.data().all(),
                    id: newWallet.id(),
                    settings: newWallet.settings().all(),
                },
            }),
        );

        assert.is(subject.findById(newWallet.id()).isMissingCoin(), false);
        assert.is(subject.findById(newWallet.id()).isMissingNetwork(), true);
    });
});

describe("#sortBy", () => {
    let walletARK: IReadWriteWallet;
    let walletBTC: IReadWriteWallet;
    let walletLSK: IReadWriteWallet;

    test.before.each(async () => {
        subject.flush();

        walletARK = await importByMnemonic(
            "wood summer suggest unlock device trust else basket minimum hire lady cute",
            "ARK",
            "ark.devnet",
            39,
        );
        walletBTC = await importByMnemonic(
            "brisk grab cash invite labor frozen scrap endorse fault fence prison brisk",
            "BTC",
            "btc.testnet",
            44,
        );
        walletLSK = await importByMnemonic(
            "print alert reflect tree draw assault mean lift burst pattern rain subway",
            "LSK",
            "lsk.mainnet",
            39,
        );
    });

    it("should sort by coin", async () => {
        const wallets = subject.sortBy("coin");

        assert.is(wallets[0].address(), walletBTC.address()); // BTC
        assert.is(wallets[1].address(), walletARK.address()); // DARK
        assert.is(wallets[2].address(), walletLSK.address()); // LSK
    });

    it("should sort by coin desc", async () => {
        const wallets = subject.sortBy("coin", "desc");

        assert.is(wallets[0].address(), walletLSK.address()); // LSK
        assert.is(wallets[1].address(), walletARK.address()); // DARK
        assert.is(wallets[2].address(), walletBTC.address()); // BTC
    });

    it("should sort by address", async () => {
        const wallets = subject.sortBy("address");

        assert.is(wallets[0].address(), walletARK.address());
        assert.is(wallets[1].address(), walletLSK.address());
        assert.is(wallets[2].address(), walletBTC.address());
    });

    it("should sort by type", async () => {
        walletARK.toggleStarred();
        walletLSK.toggleStarred();

        const wallets = subject.sortBy("type");

        assert.is(wallets[0].address(), walletBTC.address());
        assert.is(wallets[1].address(), walletARK.address());
        assert.is(wallets[2].address(), walletLSK.address());
    });

    it("should sort by balance", async () => {
        const wallets = subject.sortBy("balance");

        assert.is(wallets[0].address(), walletARK.address());
        assert.is(wallets[1].address(), walletBTC.address());
        assert.is(wallets[2].address(), walletLSK.address());
    });

    it("should export toObject", async () => {
        const wallets: Record<string, IWalletData> = subject.toObject();

        assert.is(wallets instanceof Object);
    });

    describe("restore", function () {
        let profile: IProfile;
        let wallet: IReadWriteWallet;

        test.before.each(async () => {
            profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
            profile.settings().set(ProfileSetting.Name, "John Doe");

            wallet = await profile.walletFactory().fromMnemonicWithBIP39({
                coin: "ARK",
                mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
                network: "ark.devnet",
            });

            // @ts-ignore
            await subject.fill({
                [wallet.id()]: {
                    data: wallet.data().all(),
                    id: wallet.id(),
                    settings: wallet.settings().all(),
                },
            });
        });

        it("should restore", async () => {
            const newWallet2 = await profile.walletFactory().fromMnemonicWithBIP39({
                coin: "ARK",
                mnemonic: "obvious office stock bind patient jazz off neutral figure truth start limb",
                network: "ark.devnet",
            });

            // @ts-ignore
            await subject.fill({
                [wallet.id()]: {
                    data: wallet.data().all(),
                    id: wallet.id(),
                    settings: wallet.settings().all(),
                },
                [newWallet2.id()]: {
                    data: newWallet2.data().all(),
                    id: newWallet2.id(),
                    settings: newWallet2.settings().all(),
                },
            });

            await subject.restore();

            assert.is(subject.findById(wallet.id()).hasBeenFullyRestored(), true);
            assert.is(subject.findById(newWallet2.id()).hasBeenFullyRestored(), true);
        });

        it("should do nothing if the wallet has already been fully restored", async () => {
            subject.findById(wallet.id()).markAsFullyRestored();

            await subject.restore();

            assert.is(subject.findById(wallet.id()).hasBeenFullyRestored(), true);
            assert.is(subject.findById(wallet.id()).hasBeenPartiallyRestored(), false);
        });

        it("should retry if it encounters a failure during restoration", async () => {
            // Nasty: we need to mock a failure on the wallet instance the repository has
            jest.spyOn(subject.findById(wallet.id()), "mutator").mockImplementationOnce(() => {
                throw new Error();
            });

            await subject.restore();

            assert.is(subject.findById(wallet.id()).hasBeenFullyRestored(), true);
        });
    });
});
