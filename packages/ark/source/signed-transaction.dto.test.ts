import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject: SignedTransactionData;

beforeAll(async () => {
    subject = await createService(SignedTransactionData);

    subject.configure(
        "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
        {
            id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
            amount: "12500000000000000",
            fee: "0",
            timestamp: "1970-01-01T00:00:00.000Z",
            senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
            recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
        },
        "",
    );
});

describe("SignedTransactionData", () => {
    test("#id", () => {
        assert.is(subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
    });

    test("#sender", () => {
        assert.is(subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
    });

    test("#recipient", () => {
        assert.is(subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
    });

    test("#amount", () => {
        assert.is(subject.amount()).toEqual(BigNumber.make("12500000000000000"));
    });

    test("#amount for MultiPayment", () => {
        subject.configure(
            "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
            {
                id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
                type: 6,
                fee: "0",
                asset: {
                    payments: [
                        {
                            recipientId: "",
                            amount: "12500000000000000",
                        },
                        {
                            recipientId: "",
                            amount: "12500000000000000",
                        },
                    ],
                },
                timestamp: "1970-01-01T00:00:00.000Z",
                senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
                recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
            },
            "",
        );

        assert.is(subject.amount()).toEqual(BigNumber.make("25000000000000000"));
    });

    test("#fee", () => {
        assert.is(subject.fee()).toEqual(BigNumber.ZERO);
    });

    test("#timestamp", () => {
        assert.is(DateTime.make(0).isSame(subject.timestamp()), true);
    });

    test("#timestamp missing", async () => {
        const subject = await createService(SignedTransactionData);
        subject.configure("", {}, "");
        assert.is(subject.timestamp() instanceof DateTime);
    });

    test("#isTransfer", () => {
        assert.is(subject.isTransfer()), "boolean");
});

test("#isSecondSignature", () => {
    assert.is(subject.isSecondSignature()), "boolean");
    });

test("#isDelegateRegistration", () => {
    assert.is(subject.isDelegateRegistration()), "boolean");
    });

test("#isVoteCombination", () => {
    assert.is(subject.isVoteCombination()), "boolean");
    });

test("#isVote", () => {
    assert.is(subject.isVote()), "boolean");
    });

test("#isUnvote", () => {
    assert.is(subject.isUnvote()), "boolean");
    });

test("#isMultiSignatureRegistration", () => {
    assert.is(subject.isMultiSignatureRegistration()), "boolean");
    });

test("#isIpfs", () => {
    assert.is(subject.isIpfs()), "boolean");
    });

test("#isMultiPayment", () => {
    assert.is(subject.isMultiPayment()), "boolean");
    });

test("#isDelegateResignation", () => {
    assert.is(subject.isDelegateResignation()), "boolean");
    });

test("#isHtlcLock", () => {
    assert.is(subject.isHtlcLock()), "boolean");
    });

test("#isHtlcClaim", () => {
    assert.is(subject.isHtlcClaim()), "boolean");
    });

test("#isHtlcRefund", () => {
    assert.is(subject.isHtlcRefund()), "boolean");
    });

test("#isMagistrate", () => {
    assert.is(subject.isMagistrate()), "boolean");
    });

test("#usesMultiSignature", () => {
    assert.is(subject.usesMultiSignature()), "boolean");
    });
});
