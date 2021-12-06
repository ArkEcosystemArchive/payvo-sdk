import { Coins } from "@payvo/sdk";
import { ADA } from "@payvo/sdk-ada";
import { ARK } from "@payvo/sdk-ark";
import { BTC } from "@payvo/sdk-btc";
import { ETH } from "@payvo/sdk-eth";
import { LSK } from "@payvo/sdk-lsk";
import { Request } from "@payvo/sdk-fetch";
import { nock } from "@payvo/sdk-test";

import { container } from "../source/container";
import { Profile } from "../source";
import { StubStorage } from "./stubs/storage";
import { IProfile, IReadWriteWallet } from "../source/contracts";
import { WalletFactory } from "../source/wallet.factory";
import { DriverFactory } from "../source/driver";

export const bootContainer = (): void => {
    container.flush();

    DriverFactory.make(container, {
        coins: { ADA, ARK, BTC, ETH, LSK },
        storage: new StubStorage(),
        httpClient: new Request(),
        ledgerTransportFactory: async () => { },
    });
};

const coins: Record<string, Coins.Coin> = {};

export const makeCoin = async (coin: string, network: string): Promise<Coins.Coin> => {
    const cacheKey = `${coin}.${network}`;

    if (coins[cacheKey]) {
        return coins[cacheKey];
    }

    coins[cacheKey] = Coins.CoinFactory.make({ ARK }[coin]!, {
        network,
        httpClient: new Request(),
    });

    await coins[cacheKey].__construct();

    return coins[cacheKey];
};

export const knock = (): void => {
    nock.fake(/.+/)
        .get("/api/node/configuration")
        .reply(200, require("./fixtures/client/configuration.json"))
        .get("/api/node/configuration/crypto")
        .reply(200, require("./fixtures/client/cryptoConfiguration.json"))
        .get("/api/node/syncing")
        .reply(200, require("./fixtures/client/syncing.json"))
        .get("/api/peers")
        .reply(200, require("./fixtures/client/peers.json"))
        .get("/api/node/fees")
        .query(true)
        .reply(200, require("./fixtures/client/node-fees.json"))
        .get("/api/transactions/fees")
        .query(true)
        .reply(200, require("./fixtures/client/transaction-fees.json"))
        .get("/api/delegates")
        .query(true)
        .reply(200, require("./fixtures/client/delegates-2.json"));
};

export const makeProfile = (data: object = {}): IProfile =>
    new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "", ...data });

export const importByMnemonic = async (
    profile: IProfile,
    mnemonic: string,
    coin: string,
    network: string,
): Promise<IReadWriteWallet> => {
    const factory: WalletFactory = new WalletFactory(profile);

    const wallet = await factory.fromMnemonicWithBIP39({
        coin,
        network,
        mnemonic,
    });

    profile.wallets().push(wallet);

    return wallet;
};

export const importByAddressWithDerivationPath = async (
    profile: IProfile,
    address: string,
    coin: string,
    network: string,
    path: string,
): Promise<IReadWriteWallet> => {
    const factory: WalletFactory = new WalletFactory(profile);

    const wallet = await factory.fromAddressWithDerivationPath({
        coin,
        network,
        address,
        path,
    });

    profile.wallets().push(wallet);

    return wallet;
};

export const generateWallet = async (profile: IProfile, coin: string, network: string): Promise<IReadWriteWallet> => {
    const factory: WalletFactory = new WalletFactory(profile);

    const { wallet } = await factory.generate({
        coin,
        network,
    });

    profile.wallets().push(wallet);

    return wallet;
};
