import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

describe("ConfirmedTransactionData", () => {
    test.before.each(async () => {
        subject = await createService(ConfirmedTransactionData).configure(Fixture.data[0]);
    });

    test("#id", () => {
        assert.is(subject.id(), "827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5");
    });

    test("#blockId", () => {
        assert.is(subject.blockId(), "52bb109394008afc59fae3bc288c0c52e4f50ad1e173afb164c7df40d44ff0ec");
    });

    describe("#type", () => {
        test("vote", () => {
            assert.is(subject.type(), "vote");
        });

        test("unvote", async () => {
            const data = {
                ...Fixture.data[0],
                asset: {
                    votes: [
                        {
                            delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
                            amount: "-29163000000000",
                        },
                    ],
                },
            };

            assert.is((await createService(ConfirmedTransactionData).configure(data)).type(), "unvote");
        });

        test("voteCombination", async () => {
            const data = {
                ...Fixture.data[0],
                asset: {
                    votes: [
                        {
                            delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
                            amount: "29163000000000",
                        },
                        {
                            delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
                            amount: "-29163000000000",
                        },
                    ],
                },
            };

            assert.is((await createService(ConfirmedTransactionData).configure(data)).type(), "voteCombination");
        });
    });

    test("#timestamp", () => {
        assert.is(subject.timestamp() instanceof DateTime);
        assert.is(subject.timestamp()?.toUNIX(), 1625409490);
        assert.is(subject.timestamp()?.toISOString(), "2021-07-04T14:38:10.000Z");
    });

    test("#confirmations", () => {
        assert.is(subject.confirmations(), BigNumber.make(35754));
    });

    test("#sender", () => {
        assert.is(subject.sender(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
    });

    test("#recipient", () => {
        assert.is(subject.recipient(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
    });

    test("#recipients", () => {
        assert.is(subject.recipients()).toBeArray();
    });

    describe("#amount", () => {
        test("returns transaction amount", () => {
            assert.is(subject.amount(), BigNumber.make("1"));
        });

        test("returns sum of unlock objects amounts if type is unlockToken", async () => {
            subject = await createService(ConfirmedTransactionData).configure({
                ...Fixture.data[0],
                moduleAssetName: "dpos:unlockToken",
                asset: {
                    unlockObjects: [
                        {
                            delegateAddress: "lskc579agejjw3fo9nvgg85r8vo6sa5xojtw9qscj",
                            amount: "2000000000",
                            unvoteHeight: 14548930,
                        },
                        {
                            delegateAddress: "8c955e70d0da3e0424abc4c0683280232f41c48b",
                            amount: "3000000000",
                            unvoteHeight: 14548929,
                        },
                    ],
                },
            });

            assert.is(subject.amount() instanceof BigNumber);
            assert.is(subject.amount().toString(), "5000000000"`);
        });
    });

    test("#fee", () => {
        assert.is(subject.fee(), BigNumber.make("10000000"));
    });

    test("#memo", () => {
        assert.is(subject.memo(), "Account initialization");
    });

    test("#isConfirmed", () => {
        assert.is(subject.isConfirmed(), true);
    });

    test("#toObject", () => {
        assert.is(subject.toObject(), "object");
});

test("#raw", () => {
    assert.is(subject.raw(), Fixture.data[0]);
});

test("#votes", () => {
    assert.is(subject.votes(), ["lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"]);
});

test("#unvotes", async () => {
    assert.is(
        (
            await createService(ConfirmedTransactionData).configure({
                ...Fixture.data[0],
                asset: {
                    votes: [
                        {
                            delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
                            amount: "-29163000000000",
                        },
                    ],
                },
            })
        ).unvotes(),
    , ["lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"]);
});
});
