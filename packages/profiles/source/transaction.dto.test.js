import "reflect-metadata";

import { Contracts } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { data as secondWallet } from "../test/fixtures/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json";
import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { IExchangeRateService, IProfile, IReadWriteWallet, ProfileSetting } from "./contracts";
import { Profile } from "./profile";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";

const createSubject = (wallet, properties, klass) => {
    let meta: Contracts.TransactionDataMeta = "some meta";

    return new klass(wallet, {
        id: () => "transactionId",
        blockId: () => "transactionBlockId",
        bridgechainId: () => "bridgechainId",
        type: () => "some type",
        timestamp: () => undefined,
        confirmations: () => BigNumber.make(20),
        sender: () => "sender",
        recipient: () => "recipient",
        memo: () => "memo",
        recipients: () => [],
        amount: () => BigNumber.make(18e8, 8),
        fee: () => BigNumber.make(2e8, 8),
        asset: () => ({}),
        inputs: () => [],
        outputs: () => [],
        isSent: () => true,
        toObject: () => ({}),
        getMeta: (): Contracts.TransactionDataMeta => meta,
        setMeta: (key: string, value: Contracts.TransactionDataMeta): void => {
            meta = value;
        },
        ...(properties || {}),
    });
};

let subject: any;
let profile: IProfile;
let wallet: IReadWriteWallet;

let liveSpy: jest.SpyInstance;
let testSpy: jest.SpyInstance;

test.before(async () => {
    bootContainer();

    nock.disableNetConnect();

    nock(/.+/)
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
        .get("/api/delegates")
        .reply(200, require("../test/fixtures/client/delegates-1.json"))
        .get("/api/delegates?page=2")
        .reply(200, require("../test/fixtures/client/delegates-2.json"))
        .get("/api/ipfs/QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9c")
        .reply(200, { data: "ipfs-content" })
        // CryptoCompare
        .get("/data/dayAvg")
        .query(true)
        .reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
        .get("/data/histoday")
        .query(true)
        .reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
        .persist();
});

test.before.each(async () => {
    profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

    profile.settings().set(ProfileSetting.Name, "John Doe");
    profile.settings().set(ProfileSetting.ExchangeCurrency, "BTC");
    profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

    wallet = await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

    liveSpy = jest.spyOn(wallet.network(), "isLive").mockReturnValue(true);
    testSpy = jest.spyOn(wallet.network(), "isTest").mockReturnValue(false);
});

test.after.each(() => {
    liveSpy.mockRestore();
    testSpy.mockRestore();
});

describe("Transaction", () => {
    test.before.each(() => (subject = createSubject(wallet, undefined, ExtendedConfirmedTransactionData));

    test("should have an explorer link", () => {
        assert.is(subject.explorerLink(), "https://dexplorer.ark.io/transaction/transactionId");
    });

    test("should have an explorer block link", () => {
        assert.is(subject.explorerLinkForBlock(), "https://dexplorer.ark.io/block/transactionBlockId");
    });

    test("should have an explorer block link for undefined block", () => {
        subject = createSubject(
            wallet,
            {
                ...subject,
                blockId: () => undefined,
            },
            ExtendedConfirmedTransactionData,
        );

        assert.is(subject.explorerLinkForBlock()), "undefined");
});

test("should have a type", () => {
    assert.is(subject.type(), "some type");
});

test("should have a timestamp", () => {
    assert.is(subject.timestamp()), "undefined");
    });

test("should have confirmations", () => {
    assert.is(subject.confirmations()).toStrictEqual(BigNumber.make(20));
});

test("should have a sender", () => {
    assert.is(subject.sender(), "sender");
});

test("should have a recipient", () => {
    assert.is(subject.recipient(), "recipient");
});

test("should have a recipients", () => {
    assert.is(subject.recipients() instanceof Array);
    assert.is(subject.recipients().length, 0);
});

test("should have an amount", () => {
    assert.is(subject.amount()).toStrictEqual(18);
});

test("should have a converted amount", async () => {
    subject = createSubject(
        wallet,
        {
            timestamp: () => DateTime.make(),
            amount: () => BigNumber.make(10e8, 8),
        },
        ExtendedConfirmedTransactionData,
    );

    await container.get<IExchangeRateService>(Identifiers.ExchangeRateService).syncAll(profile, "DARK");

    assert.is(subject.convertedAmount(), 0.0005048);
});

test("should have a default converted amount", () => {
    assert.is(subject.convertedAmount()).toStrictEqual(0);
});

test("should have a fee", () => {
    assert.is(subject.fee()).toStrictEqual(2);
});

test("should have a converted fee", async () => {
    subject = createSubject(
        wallet,
        {
            timestamp: () => DateTime.make(),
            fee: () => BigNumber.make(10e8, 8),
        },
        ExtendedConfirmedTransactionData,
    );

    await container.get<IExchangeRateService>(Identifiers.ExchangeRateService).syncAll(profile, "DARK");

    assert.is(subject.convertedFee(), 0.0005048);
});

test("should have a default converted fee", () => {
    assert.is(subject.convertedFee()).toStrictEqual(0);
});

test("#toObject", () => {
    subject = createSubject(
        wallet,
        {
            toObject: () => ({
                key: "value",
            }),
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.toObject(),
		Object {
		  "key": "value",
		}
	`);
});

test("#memo", () => {
    subject = createSubject(
        wallet,
        {
            memo: () => "memo",
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.memo(), "memo");
});

test("#inputs", () => {
    subject = createSubject(
        wallet,
        {
            inputs: () => [{}, {}, {}],
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.inputs()).toHaveLength(3);
});

test("#outputs", () => {
    subject = createSubject(
        wallet,
        {
            outputs: () => [{}, {}, {}],
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.outputs()).toHaveLength(3);
});

test("should not throw if transaction type does not have memo", () => {
    const subject = createSubject(
        wallet,
        {
            memo: undefined,
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(() => subject.memo()).not.toThrow();
    assert.is(subject.memo()), "undefined");
    });

test("#hasPassed", () => {
    subject = createSubject(
        wallet,
        {
            hasPassed: () => true,
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.hasPassed(), true);
});

test("coin", () => {
    assert.is(subject.coin(), wallet.coin());
});

test("#hasFailed", () => {
    subject = createSubject(
        wallet,
        {
            hasFailed: () => true,
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.hasFailed(), true);
});

test("#isReturn", () => {
    subject = createSubject(
        wallet,
        {
            isReturn: () => true,
        },
        ExtendedConfirmedTransactionData,
    );

    assert.is(subject.isReturn(), true);
});

test("#getMeta | #setMeta", () => {
    const getMeta = jest.fn();
    const setMeta = jest.fn();

    subject = createSubject(wallet, { getMeta, setMeta }, ExtendedConfirmedTransactionData);

    subject.getMeta("key");
    subject.setMeta("key", "value");

    assert.is(getMeta).toHaveBeenCalled();
    assert.is(setMeta).toHaveBeenCalled();
});

test("should not have a memo", () => {
    assert.is(subject.memo(), "memo");
});

test("should have a total for sent", () => {
    assert.is(subject.total()).toStrictEqual(20);
});

test("should have a total for unsent", () => {
    // @ts-ignore
    subject = new ExtendedConfirmedTransactionData(wallet, {
        amount: () => BigNumber.make(18e8, 8),
        fee: () => BigNumber.make(2e8, 8),
        isSent: () => false,
        isMultiPayment: () => false,
    });
    assert.is(subject.total()).toStrictEqual(18);
});

test("should calculate total amount of the multi payments for unsent", () => {
    // @ts-ignore
    subject = new ExtendedConfirmedTransactionData(wallet, {
        amount: () => BigNumber.make(18e8, 8),
        fee: () => BigNumber.make(2e8, 8),
        isSent: () => false,
        isMultiPayment: () => true,
        recipients: () => [
            {
                address: wallet.address(),
                amount: BigNumber.make(5e8, 8),
            },
            {
                address: secondWallet.address,
                amount: BigNumber.make(6e8, 8),
            },
            {
                address: wallet.address(),
                amount: BigNumber.make(7e8, 8),
            },
        ],
    });

    assert.is(subject.amount()).toStrictEqual(18);
    assert.is(subject.total()).toStrictEqual(12);
});

test("should have a converted total", async () => {
    subject = createSubject(
        wallet,
        {
            timestamp: () => DateTime.make(),
            amount: () => BigNumber.make(10e8, 8),
            fee: () => BigNumber.make(5e8, 8),
        },
        ExtendedConfirmedTransactionData,
    );

    await container.get<IExchangeRateService>(Identifiers.ExchangeRateService).syncAll(profile, "DARK");

    assert.is(subject.convertedTotal(), 0.0007572);
});

test("should have a default converted total", () => {
    assert.is(subject.convertedTotal()).toStrictEqual(0);
});

test("should have meta", () => {
    assert.is(subject.getMeta("someKey")).toStrictEqual("some meta");
});

test("should change meta", () => {
    subject.setMeta("someKey", "another meta");
    assert.is(subject.getMeta("someKey")).toStrictEqual("another meta");
});

const data = [
    ["isMagistrate"],
    ["isDelegateRegistration"],
    ["isDelegateResignation"],
    ["isHtlcClaim"],
    ["isHtlcLock"],
    ["isHtlcRefund"],
    ["isIpfs"],
    ["isMultiPayment"],
    ["isMultiSignatureRegistration"],
    ["isSecondSignature"],
    ["isTransfer"],
    ["isVote"],
    ["isUnvote"],
    ["hasPassed"],
    ["hasFailed"],
    ["isConfirmed"],
    ["isSent"],
    ["isReceived"],
    ["isTransfer"],
    ["isVoteCombination"],
];

const dummyTransactionData = {
    isMagistrate: () => false,
    isDelegateRegistration: () => false,
    isDelegateResignation: () => false,
    isHtlcClaim: () => false,
    isHtlcLock: () => false,
    isHtlcRefund: () => false,
    isIpfs: () => false,
    isMultiPayment: () => false,
    isMultiSignatureRegistration: () => false,
    isSecondSignature: () => false,
    isTransfer: () => false,
    isVote: () => false,
    isUnvote: () => false,
    hasPassed: () => false,
};

it.each(data)(`should delegate %p correctly`, (functionName) => {
    // @ts-ignore
    const transactionData = new ExtendedConfirmedTransactionData(wallet, {
        ...dummyTransactionData,
        [String(functionName)]: () => true,
    });
    assert.is(transactionData[functionName.toString()]()).toBeTruthy();
});
});

describe("DelegateRegistrationData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                username: () => "username",
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#username", () => {
        assert.is(subject.username(), "username");
    });
});

describe("DelegateResignationData", () => {
    test.before.each(() => (subject = createSubject(wallet, undefined, ExtendedConfirmedTransactionData));

    test("#id", () => {
        assert.is(subject.id(), "transactionId");
    });
});

describe("HtlcClaimData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                lockTransactionId: () => "lockTransactionId",
                unlockSecret: () => "unlockSecret",
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#lockTransactionId", () => {
        assert.is(subject.lockTransactionId(), "lockTransactionId");
    });

    test("#unlockSecret", () => {
        assert.is(subject.unlockSecret(), "unlockSecret");
    });
});

describe("HtlcLockData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                secretHash: () => "secretHash",
                expirationType: () => 5,
                expirationValue: () => 3,
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#secretHash", () => {
        assert.is(subject.secretHash(), "secretHash");
    });

    test("#expirationType", () => {
        assert.is(subject.expirationType(), 5);
    });

    test("#expirationValue", () => {
        assert.is(subject.expirationValue(), 3);
    });
});

describe("HtlcRefundData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                lockTransactionId: () => "lockTransactionId",
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#lockTransactionId", () => {
        assert.is(subject.lockTransactionId(), "lockTransactionId");
    });
});

describe("IpfsData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                hash: () => "hash",
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#hash", () => {
        assert.is(subject.hash(), "hash");
    });
});

describe("MultiPaymentData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                payments: () => [{ recipientId: "recipientId", amount: BigNumber.make(1000, 8).times(1e8) }],
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#payments", () => {
        assert.is(subject.payments(), [{ recipientId: "recipientId", amount: 1000 }]);
    });
});

describe("MultiSignatureData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                publicKeys: () => ["1", "2", "3"],
                min: () => 5,
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#publicKeys", () => {
        assert.is(subject.publicKeys(), ["1", "2", "3"]);
    });

    test("#min", () => {
        assert.is(subject.min(), 5);
    });
});

describe("SecondSignatureData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                secondPublicKey: () => "secondPublicKey",
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#secondPublicKey", () => {
        assert.is(subject.secondPublicKey(), "secondPublicKey");
    });
});

describe("TransferData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                memo: () => "memo",
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#memo", () => {
        assert.is(subject.memo(), "memo");
    });
});

describe("VoteData", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                votes: () => ["vote"],
                unvotes: () => ["unvote"],
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("#votes", () => {
        assert.is(subject.votes(), ["vote"]);
    });

    test("#unvotes", () => {
        assert.is(subject.unvotes(), ["unvote"]);
    });
});

describe("Type Specific", () => {
    test.before.each(() => {
        subject = createSubject(
            wallet,
            {
                asset: () => ({ key: "value" }),
            },
            ExtendedConfirmedTransactionData,
        );
    });

    test("should return the asset", () => {
        assert.is(subject.asset(), { key: "value" });
    });
});
