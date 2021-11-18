import { jest } from "@jest/globals";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import CryptoConfiguration from "../test/fixtures/client/cryptoConfiguration.json";
import Fixture from "../test/fixtures/client/transaction.json";
import MultipaymentFixtures from "../test/fixtures/client/transactions.json";
import VoteFixtures from "../test/fixtures/client/votes.json";
import { createService, requireModule } from "../test/mocking.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

let subject: ConfirmedTransactionData;

beforeEach(async () => {
    subject = await createService(ConfirmedTransactionData);
    subject.configure(Fixture.data);
});

describe("ConfirmedTransactionData", () => {
    test("#id", () => {
        assert.is(subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
    });

    test("#blockId", () => {
        assert.is(subject.blockId(), "13114381566690093367");
    });

    test("#timestamp", () => {
        assert.is(subject.timestamp() instanceof DateTime);
        assert.is(subject.timestamp()?.toUNIX(), Fixture.data.timestamp.unix);
        assert.is(subject.timestamp()?.toISOString(), Fixture.data.timestamp.human);
    });

    test("#confirmations", () => {
        assert.is(subject.confirmations()).toEqual(BigNumber.make(4636121));
    });

    test("#sender", () => {
        assert.is(subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
    });

    test("#recipient", () => {
        assert.is(subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
    });

    test("#recipients", async () => {
        assert.is(subject.recipients()).toEqual([]);

        subject = await createService(ConfirmedTransactionData);
        subject.configure(MultipaymentFixtures.data[0]);
        assert.is(subject.recipients()).toBeArrayOfSize(9);
    });

    test("#amount", async () => {
        assert.is(subject.amount()).toEqual(BigNumber.make("12500000000000000"));

        subject = await createService(ConfirmedTransactionData);
        subject.configure(MultipaymentFixtures.data[0]);
        assert.is(subject.amount()).toEqual(BigNumber.make("12500000000000000"));
    });

    test("#fee", () => {
        assert.is(subject.fee()).toEqual(BigNumber.ZERO);
    });

    test("#asset", () => {
        assert.is(subject.asset()).toEqual({});
    });

    test("#inputs", () => {
        assert.is(subject.inputs()).toEqual([]);
    });

    test("#outputs", () => {
        assert.is(subject.outputs()).toEqual([]);
    });

    test("#isConfirmed", () => {
        assert.is(subject.isConfirmed(), true);
    });

    describe("#isReturn", () => {
        test("should return true for transfers if sender equals recipient", () => {
            jest.spyOn(subject, "isTransfer").mockReturnValueOnce(true);
            jest.spyOn(subject, "isSent").mockReturnValueOnce(true);
            jest.spyOn(subject, "isReceived").mockReturnValueOnce(true);
            jest.spyOn(subject, "recipient").mockReturnValueOnce(subject.sender());

            assert.is(subject.isReturn(), true);
        });

        test("should return false for transfers if sender does not equal recipient", () => {
            jest.spyOn(subject, "isTransfer").mockReturnValueOnce(true);
            jest.spyOn(subject, "isReceived").mockReturnValueOnce(true);
            jest.spyOn(subject, "recipient").mockReturnValueOnce(subject.sender());

            assert.is(subject.isReturn(), false);
        });

        test("should return true for multipayments if sender is included in recipients", () => {
            jest.spyOn(subject, "isTransfer").mockReturnValueOnce(false);
            jest.spyOn(subject, "isMultiPayment").mockReturnValueOnce(true);
            jest.spyOn(subject, "recipients").mockReturnValueOnce([
                { amount: BigNumber.ZERO, address: subject.sender() },
            ]);

            assert.is(subject.isReturn(), true);
        });

        test("should return false for multipayments if sender is not included in recipients", () => {
            jest.spyOn(subject, "isTransfer").mockReturnValueOnce(false);
            jest.spyOn(subject, "isMultiPayment").mockReturnValueOnce(true);
            jest.spyOn(subject, "recipients").mockReturnValueOnce([
                { amount: BigNumber.ZERO, address: subject.recipient() },
            ]);

            assert.is(subject.isReturn(), false);
        });

        test("should return false if transaction type is not 'transfer' or 'multiPayment'", () => {
            jest.spyOn(subject, "isTransfer").mockReturnValueOnce(false);
            jest.spyOn(subject, "isMultiPayment").mockReturnValueOnce(false);

            assert.is(subject.isReturn(), false);
        });
    });

    test("#isSent", () => {
        assert.is(subject.isSent(), false);
    });

    test("#isReceived", () => {
        assert.is(subject.isReceived(), false);
    });

    test("#isTransfer", () => {
        assert.is(subject.isTransfer(), true);
    });

    test("#isSecondSignature", () => {
        assert.is(subject.isSecondSignature(), false);
    });

    test("#isDelegateRegistration", () => {
        assert.is(subject.isDelegateRegistration(), false);
    });

    test("#isVoteCombination", async () => {
        assert.is(subject.isVoteCombination(), false);

        const data = VoteFixtures.data[0];
        subject = await createService(ConfirmedTransactionData);
        subject.configure({ ...data, asset: { votes: [...data.asset.votes, "-X"] } });
        assert.is(subject.isVoteCombination(), true);
    });

    test("#isVote", () => {
        assert.is(subject.isVote(), false);
    });

    test("#isUnvote", () => {
        assert.is(subject.isUnvote(), false);
    });

    test("#isMultiSignatureRegistration", () => {
        assert.is(subject.isMultiSignatureRegistration(), false);
    });

    test("#isIpfs", () => {
        assert.is(subject.isIpfs(), false);
    });

    test("#isMultiPayment", () => {
        assert.is(subject.isMultiPayment(), false);
    });

    test("#isDelegateResignation", () => {
        assert.is(subject.isDelegateResignation(), false);
    });

    test("#isHtlcLock", () => {
        assert.is(subject.isHtlcLock(), false);
    });

    test("#isHtlcClaim", () => {
        assert.is(subject.isHtlcClaim(), false);
    });

    test("#isHtlcRefund", () => {
        assert.is(subject.isHtlcRefund(), false);
    });

    test("#isMagistrate", () => {
        assert.is(subject.isMagistrate(), false);
    });

    test("#toObject", () => {
        assert.is(subject.toObject()), "object");
});

test("#raw", () => {
    assert.is(subject.raw()).toEqual(Fixture.data);
});

test("#type", () => {
    assert.is(subject.type(), "transfer");
});

describe("DelegateRegistrationData", () => {
    beforeEach(async () => {
        subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
    });

    test("#id", () => {
        assert.is(subject.username(), "genesis_1");
    });

    test("#type", () => {
        assert.is(subject.type(), "delegateRegistration");
    });
});

describe("DelegateResignationData", () => {
    beforeEach(async () => {
        CryptoConfiguration.data.genesisBlock.transactions[1].type = 7;
        subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
    });

    test("#type", () => {
        assert.is(subject.type(), "delegateResignation");
    });
});

describe("HtlcClaimData", () => {
    beforeEach(async () => {
        subject.configure({ type: 9, asset: { lock: { lockTransactionId: "1", unlockSecret: "2" } } });
    });

    test("#lockTransactionId", () => {
        assert.is(subject.lockTransactionId(), "1");
    });

    test("#unlockSecret", () => {
        assert.is(subject.unlockSecret(), "2");
    });

    test("#type", () => {
        assert.is(subject.type(), "htlcClaim");
    });
});

describe("HtlcLockData", () => {
    beforeEach(async () => {
        subject.configure({
            type: 8,
            asset: {
                lock: {
                    amount: 1,
                    to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
                    secretHash: "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454",
                    expiration: {
                        type: 1,
                        value: 123456789,
                    },
                },
            },
        });
    });

    test("#secretHash", () => {
        assert.is(subject.secretHash(), "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454");
    });

    test("#expirationType", () => {
        assert.is(subject.expirationType(), 1);
    });

    test("#expirationValue", () => {
        assert.is(subject.expirationValue(), 123456789);
    });

    test("#type", () => {
        assert.is(subject.type(), "htlcLock");
    });
});

describe("HtlcRefundData", () => {
    beforeEach(async () => {
        subject.configure({ type: 10, asset: { refund: { lockTransactionId: "1", unlockSecret: "2" } } });
    });

    test("#lockTransactionId", () => {
        assert.is(subject.lockTransactionId(), "1");
    });

    test("#type", () => {
        assert.is(subject.type(), "htlcRefund");
    });
});

describe("IpfsData", () => {
    beforeEach(async () => {
        subject.configure({ type: 5, asset: { ipfs: "123456789" } });
    });

    test("#lockTransactionId", () => {
        assert.is(subject.hash(), "123456789");
    });

    test("#type", () => {
        assert.is(subject.type(), "ipfs");
    });
});

describe("MultiPaymentData", () => {
    beforeEach(async () => {
        subject.configure({
            type: 6,
            asset: {
                payments: [
                    { to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
                    { to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
                    { to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
                ],
            },
        });
    });

    test("#memo", () => {
        assert.is(subject.memo()), "undefined");
});

test("#payments", () => {
    assert.is(subject.payments()).toBeArrayOfSize(3);
});

test("#type", () => {
    assert.is(subject.type(), "multiPayment");
});
});

describe("MultiSignatureData", () => {
    beforeEach(async () => {
        subject.configure({
            type: 4,
            asset: {
                multiSignature: {
                    min: 1,
                    publicKeys: ["2", "3"],
                },
            },
        });
    });

    test("#publicKeys", () => {
        assert.is(subject.publicKeys()).toBeArrayOfSize(2);
    });

    test("#min", () => {
        assert.is(subject.min()).toEqual(1);
    });

    test("#type", () => {
        assert.is(subject.type(), "multiSignature");
    });
});

describe("SecondSignatureData", () => {
    beforeEach(async () => {
        subject.configure({ type: 1, asset: { signature: { publicKey: "1" } } });
    });

    test("#publicKeys", () => {
        assert.is(subject.secondPublicKey()).toEqual("1");
    });

    test("#type", () => {
        assert.is(subject.type(), "secondSignature");
    });
});

describe("TransferData", () => {
    beforeEach(async () => {
        subject.configure({ vendorField: "X" });
    });

    test("#memo", () => {
        assert.is(subject.memo()).toEqual("X");
    });

    test("#type", () => {
        assert.is(subject.type(), "transfer");
    });
});

describe("VoteData", () => {
    beforeEach(async () => {
        subject.configure({ type: 3, asset: { votes: ["+A", "-B"] } });
    });

    test("#votes", () => {
        assert.is(subject.votes()).toBeArrayOfSize(1);
        assert.is(subject.votes()[0]).toEqual("A");
    });

    test("#unvotes", () => {
        assert.is(subject.unvotes()).toBeArrayOfSize(1);
        assert.is(subject.unvotes()[0]).toEqual("B");
    });

    test.only("#type", () => {
        subject.configure({ type: 3, asset: { votes: ["+A", "-B"] } });

        assert.is(subject.type(), "voteCombination");

        subject.configure({ type: 3, asset: { votes: ["+A"] } });

        assert.is(subject.type(), "vote");

        subject.configure({ type: 3, asset: { votes: ["-B"] } });

        assert.is(subject.type(), "unvote");
    });
});
});
