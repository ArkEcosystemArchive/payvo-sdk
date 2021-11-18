import "reflect-metadata";

import { Signatories } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer } from "../test/mocking.js";
import { IProfile, IReadWriteWallet, ProfileSetting, WalletData } from "./contracts.js";
import { Profile } from "./profile.js";
import { TransactionService } from "./wallet-transaction.service.js";
import { ExtendedSignedTransactionData } from "./signed-transaction.dto.js";

const deriveIdentity = async (
    signingKey: string,
): Promise<{
    signingKey: string;
    address: string;
    publicKey: string;
    privateKey: string;
}> => ({
    signingKey,
    address: (await wallet.addressService().fromMnemonic(signingKey)).address,
    publicKey: (await wallet.publicKeyService().fromMnemonic(signingKey)).publicKey,
    privateKey: (await wallet.privateKeyService().fromMnemonic(signingKey)).privateKey,
});

let profile: IProfile;
let wallet: IReadWriteWallet;
let subject: TransactionService;

beforeAll(() => {
    bootContainer();

    nock.disableNetConnect();
});

beforeEach(() => {
    nock("https://ark-test.payvo.com:443")
        .get("/api/blockchain")
        .reply(200, require("../test/fixtures/client/blockchain.json"))
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
        .reply(200, require("../test/fixtures/client/wallet.json"))
        .get("/api/wallets/030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd")
        .reply(200, require("../test/fixtures/client/wallet.json"))
        // second wallet
        .get("/api/wallets/022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce")
        .reply(200, require("../test/fixtures/client/wallet-2.json"))
        .get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
        .reply(200, require("../test/fixtures/client/wallet-2.json"))
        // Musig wallet
        .get("/api/wallets/DML7XEfePpj5qDFb1SbCWxLRhzdTDop7V1")
        .reply(200, require("../test/fixtures/client/wallet-musig.json"))
        .get("/api/wallets/02cec9caeb855e54b71e4d60c00889e78107f6136d1f664e5646ebcb2f62dae2c6")
        .reply(200, require("../test/fixtures/client/wallet-musig.json"))
        .get("/transaction/a7245dcc720d3e133035cff04b4a14dbc0f8ff889c703c89c99f2f03e8f3c59d")
        .query(true)
        .reply(200, require("../test/fixtures/client/musig-transaction.json"))
        .get("/transaction/bb9004fa874b534905f9eff201150f7f982622015f33e076c52f1e945ef184ed")
        .query(true)
        .reply(200, () => ({ data: require("../test/fixtures/client/transactions.json").data[1] }))
        .persist();

    nock("https://lsk-test.payvo.com:443")
        .get("/api/v2/accounts")
        .query({ address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h" })
        .reply(404, { error: true, message: "Data not found" })
        .get("/api/v2/fees")
        .reply(200, {
            data: {
                feeEstimatePerByte: {
                    low: 0,
                    medium: 0,
                    high: 0,
                },
                baseFeeById: {
                    "5:0": "1000000000",
                },
                baseFeeByName: {
                    "dpos:registerDelegate": "1000000000",
                },
                minFeePerByte: 1000,
            },
            meta: {
                lastUpdate: 1630294530,
                lastBlockHeight: 14467510,
                lastBlockId: "0ccc6783e26b8fbf030d9d23c6df35c2db58395b2d7aab9b61a703798425be40",
            },
        })
        .persist();

    profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
    profile.settings().set(ProfileSetting.Name, "John Doe");
});

afterEach(() => {
    nock.cleanAll();
});

describe("ARK", () => {
    beforeEach(async () => {
        wallet = await profile.walletFactory().fromMnemonicWithBIP39({
            coin: "ARK",
            network: "ark.devnet",
            mnemonic: identity.mnemonic,
        });

        subject = new TransactionService(wallet);
    });

    it("should sync", async () => {
        const musig = require("../test/fixtures/client/musig-transaction.json");
        nock("https://ark-test.payvo.com:443").get("/transactions").query(true).reply(200, [musig]).persist();
        await assert.is(subject.sync()).toResolve();
    });

    describe("signatures", () => {
        it("should add signature", async () => {
            nock("https://ark-test-musig.payvo.com:443")
                .post("/", {
                    publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
                    state: "pending",
                })
                .reply(200, {
                    result: [
                        {
                            data: {
                                id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
                                signatures: [],
                            },
                            multisigAsset: {},
                        },
                    ],
                })
                .post("/", {
                    publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
                    state: "ready",
                })
                .reply(200, {
                    result: [
                        {
                            data: {
                                id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
                                signatures: [],
                            },
                            multisigAsset: {},
                        },
                    ],
                })
                .post("/", {
                    id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
                })
                .reply(200, {
                    result: {
                        data: { signatures: [] },
                        multisigAsset: {},
                    },
                })
                .post("/", ({ method }) => method === "store")
                .reply(200, {
                    result: {
                        id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
                    },
                })
                .persist();

            const identity1 = await deriveIdentity(
                "citizen door athlete item name various drive onion foster audit board myself",
            );
            const identity2 = await deriveIdentity(
                "upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
            );

            const id = await subject.signMultiSignature({
                nonce: "1",
                signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
                data: {
                    publicKeys: [identity1.publicKey, identity2.publicKey],
                    min: 1,
                    senderPublicKey: "0205d9bbe71c343ac9a6a83a4344fd404c3534fc7349827097d0835d160bc2b896",
                },
            });

            await subject.sync();
            await subject.addSignature(id, new Signatories.Signatory(new Signatories.MnemonicSignatory(identity2)));

            assert.is(subject.transaction(id)).toBeDefined();
        });

        it("should sign second signature", async () => {
            const input = {
                nonce: "1",
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                        address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                        publicKey: "publicKey",
                        privateKey: "privateKey",
                    }),
                ),
                data: {
                    mnemonic: "this is a top secret second mnemonic",
                },
            };
            const id = await subject.signSecondSignature(input);

            assert.is(id), "string");
        assert.is(subject.signed()).toContainKey(id);
        assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
    });

    it("should sign multi signature registration", async () => {
        const identity1 = await deriveIdentity(
            "upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
        );
        const identity2 = await deriveIdentity(
            "citizen door athlete item name various drive onion foster audit board myself",
        );
        const identity3 = await deriveIdentity(
            "nuclear anxiety mandate board property fade chief mule west despair photo fiber",
        );

        const id = await subject.signMultiSignature({
            nonce: "1",
            signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
            data: {
                publicKeys: [identity1.publicKey, identity2.publicKey, identity3.publicKey],
                min: 2,
                senderPublicKey: identity1.publicKey,
            },
        });

        assert.is(id), "string");
    assert.is(subject.waitingForOtherSignatures()).toContainKey(id);
    assert.is(subject.waitingForOtherSignatures()[id] instanceof ExtendedSignedTransactionData);
    assert.is(subject.canBeSigned(id), false);
});

it("should sign ipfs", async () => {
    const input = {
        nonce: "1",
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            hash: "QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w",
        },
    };
    const id = await subject.signIpfs(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
        });

it("should sign multi payment", async () => {
    const input = {
        nonce: "1",
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            payments: [
                { to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
                { to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
                { to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
            ],
        },
    };
    const id = await subject.signMultiPayment(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
        });

it("should sign delegate resignation", async () => {
    const input = {
        nonce: "1",
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
    };
    const id = await subject.signDelegateResignation(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
        });

it("should sign htlc lock", async () => {
    const input = {
        nonce: "1",
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
            secretHash: "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454",
            expiration: {
                type: 1,
                value: 1607523002,
            },
        },
    };
    const id = await subject.signHtlcLock(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
        });

it("should sign htlc claim", async () => {
    const input = {
        nonce: "1",
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            lockTransactionId: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
            unlockSecret: "c27f1ce845d8c29eebc9006be932b604fd06755521b1a8b0be4204c65377151a",
        },
    };
    const id = await subject.signHtlcClaim(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
        });

it("should sign htlc refund", async () => {
    const input = {
        nonce: "1",
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            lockTransactionId: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
        },
    };
    const id = await subject.signHtlcRefund(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
        });
    });

it("#transaction lifecycle", async () => {
    const realHash = "819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef";

    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };
    const id = await subject.signTransfer(input);
    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id)).toBeDefined();
assert.is(subject.waitingForOurSignature()).not.toContainKey(id);
assert.is(subject.waitingForOtherSignatures()).not.toContainKey(id);
assert.is(subject.hasBeenSigned(id), true);
assert.is(subject.hasBeenBroadcasted(id), false);
assert.is(subject.hasBeenConfirmed(id), false);

nock("https://ark-test.payvo.com:443")
    .post("/api/transactions")
    .reply(201, {
        data: {
            accept: [realHash],
            broadcast: [],
            excess: [],
            invalid: [],
        },
        errors: {},
    })
    .get(`/api/transactions/${realHash}`)
    .reply(200, { data: { confirmations: 51 } });

await assert.is(subject.broadcast(id)).resolves.toEqual({
    accepted: [realHash],
    rejected: [],
    errors: {},
});

assert.is(subject.signed()).toContainKey(id);
assert.is(subject.broadcasted()).toContainKey(id);
assert.is(subject.isAwaitingConfirmation(id), true);
assert.is(subject.hasBeenSigned(id), true);
assert.is(subject.hasBeenBroadcasted(id), true);
assert.is(subject.hasBeenConfirmed(id), false);
assert.is(subject.transaction(id)).toBeDefined();

await subject.confirm(id);

//@ts-ignore
await assert.is(subject.confirm(null)).toReject();

assert.is(subject.signed()).not.toContainKey(id);
assert.is(subject.broadcasted()).not.toContainKey(id);
assert.is(subject.isAwaitingConfirmation(id), false);
    });

it("#pending", async () => {
    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };
    const id = await subject.signTransfer(input);
    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
assert.is(subject.pending()).toContainKey(id);
    });

it("should fail when using malformed transaction ID", async () => {
    //@ts-ignore
    assert.is(() => subject.transaction()).toThrow();
});

it("should fail retrieving public key if wallet is lacking a public key", async () => {
    const walletPublicKeyMock = jest.spyOn(wallet, "publicKey").mockReturnValue(undefined);
    //@ts-ignore
    assert.is(() => subject.getPublicKey()).toThrow();
    walletPublicKeyMock.mockRestore();
});

it("#dump", async () => {
    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };

    const id = await subject.signTransfer(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);

assert.is(wallet.data().get(WalletData.SignedTransactions)), "undefined");
subject.dump();
assert.is(wallet.data().get(WalletData.SignedTransactions)).toContainKey(id);
    });

it("#restore", async () => {
    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };

    const id = await subject.signTransfer(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);

assert.is(wallet.data().get(WalletData.SignedTransactions)), "undefined");

subject.dump();
subject.restore();

assert.is(wallet.data().get(WalletData.SignedTransactions)).toContainKey(id);

const mockedUndefinedStorage = jest.spyOn(wallet.data(), "get").mockReturnValue(undefined);
subject.restore();
mockedUndefinedStorage.mockRestore();
assert.is(wallet.data().get(WalletData.SignedTransactions)).toContainKey(id);
    });

it("sign a multisig transaction awaiting other signatures", async () => {
    nock("https://ark-test.payvo.com:443")
        .post("/")
        .reply(200, { result: [require("../test/fixtures/client/musig-transaction.json")] })
        .post("/")
        .reply(200, { result: [] })
        .persist();

    const identity1 = await deriveIdentity(
        "upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
    );
    const identity2 = await deriveIdentity(
        "citizen door athlete item name various drive onion foster audit board myself",
    );

    const id = await subject.signMultiSignature({
        nonce: "1",
        signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
        data: {
            publicKeys: [identity1.publicKey, identity2.publicKey],
            min: 2,
            senderPublicKey: identity1.publicKey,
        },
    });

    assert.is(subject.transaction(id)).toBeDefined();
    assert.is(subject.pending()).toContainKey(id);
    assert.is(subject.waitingForOtherSignatures()).toContainKey(id);
    assert.is(subject.isAwaitingSignatureByPublicKey(id, identity1.publicKey), false);
    assert.is(subject.isAwaitingSignatureByPublicKey(id, identity2.publicKey), true);
});

it("should sync multisig transaction awaiting our signature", async () => {
    nock("https://ark-test-musig.payvo.com:443")
        .post("/")
        .reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-our.json")] })
        .post("/")
        .reply(200, { result: [] })
        .persist();

    const id = "a7245dcc720d3e133035cff04b4a14dbc0f8ff889c703c89c99f2f03e8f3c59d";

    await subject.sync();
    assert.is(subject.waitingForOurSignature()).toContainKey(id);
});

it("should await signature by public ip", async () => {
    nock("https://ark-test-musig.payvo.com:443")
        .post("/")
        .reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-signature.json")] })
        .post("/")
        .reply(200, { result: [] })
        .persist();

    const id = "46343c36bf7497b68e14d4c0fd713e41a737841b6a858fa41ef0eab6c4647938";

    await subject.sync();
    const mockNeedsWalletSignature = jest
        .spyOn(wallet.coin().multiSignature(), "needsWalletSignature")
        .mockReturnValue(true);

    assert.is(
        subject.isAwaitingSignatureByPublicKey(
            id,
            "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
        ),
        , true);

    mockNeedsWalletSignature.mockRestore();
});

it("transaction should not await any signatures", async () => {
    nock("https://ark-test.payvo.com:443")
        .post("/")
        .reply(200, { result: [] })
        .post("/")
        .reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-none.json")] })
        .persist();

    const id = "46343c36bf7497b68e14d4c0fd713e41a737841b6a858fa41ef0eab6c4647938";

    await subject.sync();
    assert.is(() =>
        subject.isAwaitingSignatureByPublicKey(
            id,
            "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
        ),
    ).toThrow();
});

it("should broadcast transaction", async () => {
    nock("https://ark-test.payvo.com:443")
        .post("/api/transactions")
        .reply(201, {
            data: {
                accept: ["819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef"],
                broadcast: [],
                excess: [],
                invalid: [],
            },
            errors: {},
        })
        .get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
        .reply(200, { data: { confirmations: 1 } });

    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };

    const id = await subject.signTransfer(input);
    assert.is(subject.transaction(id)).toBeDefined();
    await subject.broadcast(id);
    assert.is(subject.broadcasted()).toContainKey(id);
    assert.is(subject.transaction(id)).toBeDefined();
});

it("should broadcast a transfer and confirm it", async () => {
    nock("https://ark-test.payvo.com:443")
        .post("/api/transactions")
        .reply(201, {
            data: {
                accept: ["819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef"],
                broadcast: [],
                excess: [],
                invalid: [],
            },
            errors: {},
        })
        .get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
        .reply(200, { data: { confirmations: 51 } });

    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };

    const id = await subject.signTransfer(input);
    assert.is(subject.transaction(id)).toBeDefined();
    await subject.broadcast(id);
    assert.is(subject.broadcasted()).toContainKey(id);
    await subject.confirm(id);
    assert.is(subject.transaction(id)).toBeDefined();
    assert.is(subject.hasBeenConfirmed(id), true);
});

it("should broadcast multisignature transaction", async () => {
    nock("https://ark-test-musig.payvo.com:443")
        .post("/")
        .reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-none.json")] })
        .post("/")
        .reply(200, { result: [] });

    nock("https://ark-test.payvo.com:443")
        .post("/transaction")
        .reply(201, {
            data: {
                accept: ["4b867a3aa16a1a298cee236a3a907b8bc50e139199525522bfa88b5a9bb11a78"],
                broadcast: [],
                excess: [],
                invalid: [],
            },
            errors: {},
        })
        .persist();

    const identity1 = await deriveIdentity(
        "upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
    );
    const identity2 = await deriveIdentity(
        "citizen door athlete item name various drive onion foster audit board myself",
    );

    const id = await subject.signMultiSignature({
        nonce: "1",
        signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
        data: {
            publicKeys: [identity1.publicKey, identity2.publicKey],
            min: 2,
        },
    });

    const mockedFalseMultisignatureRegistration = jest
        .spyOn(subject.transaction(id), "isMultiSignatureRegistration")
        .mockReturnValue(false);
    assert.is(subject.transaction(id)).toBeDefined();
    assert.is(subject.pending()).toContainKey(id);
    assert.is(subject.transaction(id).usesMultiSignature(), true);

    await subject.broadcast(id);
    assert.is(subject.waitingForOtherSignatures()).toContainKey(id);

    const mockedFalseMultisignature = jest
        .spyOn(subject.transaction(id), "isMultiSignatureRegistration")
        .mockReturnValue(false);
    await subject.broadcast(id);
    assert.is(subject.transaction(id)).toBeDefined();

    mockedFalseMultisignatureRegistration.mockRestore();
    mockedFalseMultisignature.mockRestore();
});

it("should broadcast multisignature registration", async () => {
    nock("https://ark-test-musig.payvo.com:443")
        .post("/")
        .reply(200, { result: [require("../test/fixtures/client/musig-transaction.json")] });

    nock("https://ark-test.payvo.com:443")
        .post("/")
        .reply(200, { result: [] })
        .post("/transaction")
        .reply(201, {
            data: {
                accept: ["5d7b213905c3bf62bc233b7f1e211566b1fd7aecad668ed91bb8202b3f35d890"],
                broadcast: [],
                excess: [],
                invalid: [],
            },
            errors: {},
        })
        .persist();

    const identity1 = await deriveIdentity(
        "upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
    );
    const identity2 = await deriveIdentity(
        "citizen door athlete item name various drive onion foster audit board myself",
    );

    const id = await subject.signMultiSignature({
        nonce: "1",
        signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
        data: {
            publicKeys: [identity1.publicKey, identity2.publicKey],
            min: 2,
        },
    });

    assert.is(subject.transaction(id)).toBeDefined();
    assert.is(subject.pending()).toContainKey(id);
    assert.is(subject.transaction(id).usesMultiSignature(), true);
    assert.is(subject.transaction(id).isMultiSignatureRegistration(), true);

    await subject.broadcast(id);
    assert.is(subject.waitingForOtherSignatures()).toContainKey(id);
});

it("#confirm", async () => {
    nock("https://ark-test.payvo.com:443")
        .post("/api/transactions")
        .reply(201, {
            data: {
                accept: ["819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef"],
                broadcast: [],
                excess: [],
                invalid: [],
            },
            errors: {},
        })
        .get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
        .reply(200, { data: { confirmations: 0 } });

    const input = {
        signatory: new Signatories.Signatory(
            new Signatories.MnemonicSignatory({
                signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                publicKey: "publicKey",
                privateKey: "privateKey",
            }),
        ),
        data: {
            amount: 1,
            to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
        },
    };

    const id = await subject.signTransfer(input);
    await assert.is(subject.broadcast(id)).resolves.toMatchInlineSnapshot(`
					Object {
					  "accepted": Array [
					    "819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef",
					  ],
					  "errors": Object {},
					  "rejected": Array [],
					}
				`);

    assert.is(subject.transaction(id)).toBeDefined();

    // Uncofirmed
    await subject.confirm(id);
    assert.is(subject.isAwaitingConfirmation(id), true);

    // Invalid id
    //@ts-ignore
    await assert.is(subject.confirm(null)).toReject();

    // Handle wallet client error. Should return false
    const walletClientTransactionMock = jest.spyOn(wallet.client(), "transaction").mockImplementation(() => {
        throw new Error("transaction error");
    });

    await assert.is(subject.confirm(id)).resolves, false);
walletClientTransactionMock.mockRestore();

// Confirmed
nock.cleanAll();
nock("https://ark-test.payvo.com:443")
    .get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
    .reply(200, { data: { confirmations: 51 } });

await subject.confirm(id);
assert.is(subject.isAwaitingConfirmation(id), false);
});

it("should throw if a transaction is retrieved that does not exist", async () => {
    assert.is(() => subject.transaction("id")).toThrow(/could not be found/);
});
});

describe("Shared", () => {
    it.each([
        {
            coin: "ARK",
            network: "ark.devnet",
            input: {
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                        address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                        publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                        privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                    }),
                ),
                data: {
                    amount: 1,
                    to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                },
            },
        },
        {
            coin: "LSK",
            network: "lsk.testnet",
            input: {
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                        address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                        publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                        privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                    }),
                ),
                data: {
                    amount: 1,
                    to: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                },
            },
        },
    ])("should create a transfer for %s", async ({ coin, network, input }) => {
        const subject = new TransactionService(
            await profile.walletFactory().fromMnemonicWithBIP39({
                coin,
                network,
                mnemonic: identity.mnemonic,
            }),
        );

        const id = await subject.signTransfer(input);

        assert.is(id), "string");
    assert.is(subject.signed()).toContainKey(id);
    assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
    assert.is(subject.transaction(id).sender(), input.signatory.address());
    assert.is(subject.transaction(id).recipient(), input.data.to);
    assert.is(subject.transaction(id).isTransfer(), true);
    assert.is(subject.transaction(id).isSecondSignature(), false);
    assert.is(subject.transaction(id).isDelegateRegistration(), false);
    assert.is(subject.transaction(id).isVoteCombination(), false);
    assert.is(subject.transaction(id).isVote(), false);
    assert.is(subject.transaction(id).isUnvote(), false);
    assert.is(subject.transaction(id).isMultiSignatureRegistration(), false);
    assert.is(subject.transaction(id).isIpfs(), false);
    assert.is(subject.transaction(id).isMultiPayment(), false);
    assert.is(subject.transaction(id).isDelegateResignation(), false);
    assert.is(subject.transaction(id).isHtlcLock(), false);
    assert.is(subject.transaction(id).isHtlcClaim(), false);
    assert.is(subject.transaction(id).isHtlcRefund(), false);
    assert.is(subject.transaction(id).isMagistrate(), false);
    assert.is(subject.transaction(id).usesMultiSignature(), false);
});

it.each([
    {
        coin: "ARK",
        network: "ark.devnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                    publicKey: "publicKey",
                    privateKey: "privateKey",
                }),
            ),
            data: {
                username: "johndoe",
            },
        },
    },
    {
        coin: "LSK",
        network: "lsk.testnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                    privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                }),
            ),
            data: {
                username: "johndoe",
            },
        },
    },
])("should create a delegate registration for %s", async ({ coin, network, input }) => {
    const subject = new TransactionService(
        await profile.walletFactory().fromMnemonicWithBIP39({
            coin,
            network,
            mnemonic: identity.mnemonic,
        }),
    );

    const id = await subject.signDelegateRegistration(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
assert.is(subject.transaction(id).sender(), input.signatory.address());
assert.is(subject.transaction(id).recipient()), "undefined");
assert.is(subject.transaction(id).isTransfer(), false);
assert.is(subject.transaction(id).isSecondSignature(), false);
assert.is(subject.transaction(id).isDelegateRegistration(), true);
assert.is(subject.transaction(id).isVoteCombination(), false);
assert.is(subject.transaction(id).isVote(), false);
assert.is(subject.transaction(id).isUnvote(), false);
assert.is(subject.transaction(id).isMultiSignatureRegistration(), false);
assert.is(subject.transaction(id).isIpfs(), false);
assert.is(subject.transaction(id).isMultiPayment(), false);
assert.is(subject.transaction(id).isDelegateResignation(), false);
assert.is(subject.transaction(id).isHtlcLock(), false);
assert.is(subject.transaction(id).isHtlcClaim(), false);
assert.is(subject.transaction(id).isHtlcRefund(), false);
assert.is(subject.transaction(id).isMagistrate(), false);
assert.is(subject.transaction(id).usesMultiSignature(), false);
    });

it.each([
    {
        coin: "ARK",
        network: "ark.devnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                    publicKey: "publicKey",
                    privateKey: "privateKey",
                }),
            ),
            data: {
                votes: [
                    {
                        id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
                        amount: 0,
                    },
                ],
                unvotes: [],
            },
        },
    },
    {
        coin: "LSK",
        network: "lsk.testnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                    privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                }),
            ),
            data: {
                votes: [
                    {
                        amount: 10,
                        id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    },
                ],
                unvotes: [],
            },
        },
    },
])("should create a vote for %s", async ({ coin, network, input }) => {
    const subject = new TransactionService(
        await profile.walletFactory().fromMnemonicWithBIP39({
            coin,
            network,
            mnemonic: identity.mnemonic,
        }),
    );

    const id = await subject.signVote(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
assert.is(subject.transaction(id).sender(), input.signatory.address());
assert.is(subject.transaction(id).recipient()), "undefined");
assert.is(subject.transaction(id).isTransfer(), false);
assert.is(subject.transaction(id).isSecondSignature(), false);
assert.is(subject.transaction(id).isDelegateRegistration(), false);
assert.is(subject.transaction(id).isVoteCombination(), false);
assert.is(subject.transaction(id).isVote(), true);
assert.is(subject.transaction(id).isUnvote(), false);
assert.is(subject.transaction(id).isMultiSignatureRegistration(), false);
assert.is(subject.transaction(id).isIpfs(), false);
assert.is(subject.transaction(id).isMultiPayment(), false);
assert.is(subject.transaction(id).isDelegateResignation(), false);
assert.is(subject.transaction(id).isHtlcLock(), false);
assert.is(subject.transaction(id).isHtlcClaim(), false);
assert.is(subject.transaction(id).isHtlcRefund(), false);
assert.is(subject.transaction(id).isMagistrate(), false);
assert.is(subject.transaction(id).usesMultiSignature(), false);
    });

it.each([
    {
        coin: "ARK",
        network: "ark.devnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                    publicKey: "publicKey",
                    privateKey: "privateKey",
                }),
            ),
            data: {
                votes: [],
                unvotes: [
                    {
                        id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
                        amount: 0,
                    },
                ],
            },
        },
    },
    {
        coin: "LSK",
        network: "lsk.testnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                    privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                }),
            ),
            data: {
                votes: [],
                unvotes: [
                    {
                        amount: 10,
                        id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    },
                ],
            },
        },
    },
])("should create an unvote for %s", async ({ coin, network, input }) => {
    const subject = new TransactionService(
        await profile.walletFactory().fromMnemonicWithBIP39({
            coin,
            network,
            mnemonic: identity.mnemonic,
        }),
    );

    const id = await subject.signVote(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
assert.is(subject.transaction(id).sender(), input.signatory.address());
assert.is(subject.transaction(id).recipient()), "undefined");
assert.is(subject.transaction(id).isTransfer(), false);
assert.is(subject.transaction(id).isSecondSignature(), false);
assert.is(subject.transaction(id).isDelegateRegistration(), false);
assert.is(subject.transaction(id).isVoteCombination(), false);
assert.is(subject.transaction(id).isVote(), false);
assert.is(subject.transaction(id).isUnvote(), true);
assert.is(subject.transaction(id).isMultiSignatureRegistration(), false);
assert.is(subject.transaction(id).isIpfs(), false);
assert.is(subject.transaction(id).isMultiPayment(), false);
assert.is(subject.transaction(id).isDelegateResignation(), false);
assert.is(subject.transaction(id).isHtlcLock(), false);
assert.is(subject.transaction(id).isHtlcClaim(), false);
assert.is(subject.transaction(id).isHtlcRefund(), false);
assert.is(subject.transaction(id).isMagistrate(), false);
assert.is(subject.transaction(id).usesMultiSignature(), false);
    });

it.each([
    {
        coin: "ARK",
        network: "ark.devnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                    publicKey: "publicKey",
                    privateKey: "privateKey",
                }),
            ),
            data: {
                votes: [
                    {
                        id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
                        amount: 0,
                    },
                ],
                unvotes: [
                    {
                        id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
                        amount: 0,
                    },
                ],
            },
        },
    },
    {
        coin: "LSK",
        network: "lsk.testnet",
        input: {
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                    address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                    privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                }),
            ),
            data: {
                votes: [
                    {
                        amount: 10,
                        id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    },
                ],
                unvotes: [
                    {
                        amount: 10,
                        id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                    },
                ],
            },
        },
    },
])("should create a vote combination for %s", async ({ coin, network, input }) => {
    const subject = new TransactionService(
        await profile.walletFactory().fromMnemonicWithBIP39({
            coin,
            network,
            mnemonic: identity.mnemonic,
        }),
    );

    const id = await subject.signVote(input);

    assert.is(id), "string");
assert.is(subject.signed()).toContainKey(id);
assert.is(subject.transaction(id) instanceof ExtendedSignedTransactionData);
assert.is(subject.transaction(id).sender(), input.signatory.address());
assert.is(subject.transaction(id).recipient()), "undefined");
assert.is(subject.transaction(id).isTransfer(), false);
assert.is(subject.transaction(id).isSecondSignature(), false);
assert.is(subject.transaction(id).isDelegateRegistration(), false);
assert.is(subject.transaction(id).isVoteCombination(), true);
assert.is(subject.transaction(id).isVote(), true);
assert.is(subject.transaction(id).isUnvote(), true);
assert.is(subject.transaction(id).isMultiSignatureRegistration(), false);
assert.is(subject.transaction(id).isIpfs(), false);
assert.is(subject.transaction(id).isMultiPayment(), false);
assert.is(subject.transaction(id).isDelegateResignation(), false);
assert.is(subject.transaction(id).isHtlcLock(), false);
assert.is(subject.transaction(id).isHtlcClaim(), false);
assert.is(subject.transaction(id).isHtlcRefund(), false);
assert.is(subject.transaction(id).isMagistrate(), false);
assert.is(subject.transaction(id).usesMultiSignature(), false);
    });
});
