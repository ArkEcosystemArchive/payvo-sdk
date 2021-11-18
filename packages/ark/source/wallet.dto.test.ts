import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";

let subject: WalletData;

describe("WalletData", () => {
    const WalletDataFixture = {
        mainnet: {
            address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
            publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
            nonce: "111932",
            balance: "55827093444556",
            isDelegate: true,
            isResigned: false,
            vote: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
            username: "arkx",
        },
        devnet: {
            address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
            publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
            nonce: "111932",
            balance: "55827093444556",
            attributes: {
                delegate: {
                    username: "arkx",
                    voteBalance: "57037342430760",
                    forgedFees: "124364463486",
                    forgedRewards: "16899000000000",
                    producedBlocks: 84709,
                    lastBlock: {
                        id: "682a1c53eb9e6fcf285d1b6819de08f88bd15b083a612c3fe32aa870001dbf22",
                        height: 4269235,
                        timestamp: 91907944,
                        generatorPublicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
                    },
                    resigned: false,
                },
                vote: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
                entities: {
                    df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da: {
                        type: 0,
                        subType: 0,
                        data: {
                            name: "business2reg",
                            ipfsData: "QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV",
                        },
                    },
                    "9d25ddf8e59d8595a74d7fe74fdee3380660d60333c453b1a352326d80ba4b43": {
                        type: 3,
                        subType: 1,
                        data: {
                            name: "coreplugin2",
                            ipfsData: "QmXCuXaBuWZGqES7tDW6AHFCGj8zEzFG48P1BHWSU1fqq3",
                        },
                    },
                    "03e44853b26f450d5aba78e3fad390faa8ae9aa6995b1fa80b8d191516b52f1e": {
                        type: 3,
                        subType: 2,
                        data: {
                            name: "desktopplugin2",
                            ipfsData: "QmNgvK9AAh7XVHubzJE3F33K4GJubFcQm9AUPBy1vFCEsV",
                        },
                    },
                },
                multiSignature: {
                    publicKeys: [
                        "0276e139773e7f7cfae7dbc8cb9afa37a52ffa8d4614482f9b9fe7eeab0f2447b6",
                        "0272a9fb36e7a7d212aedfab53b2cdd48c8b620583d1927e03104122e6792482db",
                        "0262faf4f0add64aecd44d2f7223198aec5116e3c1dcd80aa4fff193aa490b3e5f",
                    ],
                    min: 1,
                },
            },
        },
    };

    describe.each(["mainnet", "devnet"])("%s", (network) => {
        beforeEach(async () => {
            subject = (await createService(WalletData)).fill(WalletDataFixture[network]);
        });

        test("#primaryKey", () => {
            assert.is(subject.primaryKey(), "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");
        });

        test("#address", () => {
            assert.is(subject.address(), "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");
        });

        test("#publicKey", () => {
            assert.is(subject.publicKey(), "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec");
        });

        test("#balance", () => {
            assert.is(subject.balance().available).toEqual(BigNumber.make("55827093444556"));
        });

        test("#nonce", () => {
            assert.is(subject.nonce()).toEqual(BigNumber.make("111932"));
        });

        test("#secondPublicKey", () => {
            assert.is(subject.secondPublicKey()), "undefined");
    });

    test("#username", () => {
        assert.is(subject.username(), "arkx");
    });

    test("#rank", () => {
        assert.is(subject.rank()), "undefined");
});

test("#votes", () => {
    assert.is(subject.votes()).toEqual(network === "devnet" ? BigNumber.make(0) : undefined);
});

test("#isDelegate", async () => {
    assert.is(subject.isDelegate(), true);

    subject = (await createService(WalletData)).fill({ ...WalletDataFixture.mainnet, isResigned: true });
    assert.is(subject.isDelegate(), false);
});

test("#isResignedDelegate", () => {
    assert.is(subject.isResignedDelegate(), false);
});

test("#isMultiSignature", () => {
    assert.is(subject.isMultiSignature()).toEqual(network === "devnet");
});

test("#isSecondSignature", () => {
    assert.is(subject.isSecondSignature(), false);
});

test("#toObject", () => {
    assert.is(subject.toObject()), "object");
    });
});

test("#multiSignature", async () => {
    const devnetSubject = (await createService(WalletData)).fill(WalletDataFixture.devnet);
    const mainnetSubject = (await createService(WalletData)).fill(WalletDataFixture.mainnet);

    assert.is(() => mainnetSubject.multiSignature()).toThrow(/does not have/);
    assert.is(devnetSubject.multiSignature()).toEqual(WalletDataFixture.devnet.attributes.multiSignature);
});
});
