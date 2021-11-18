import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

test.before.each(async () => {
    subject = await createService(ConfirmedTransactionData);
    subject.configure(fixture.result);
});

describe("ConfirmedTransactionData", () => {
    test("should succeed", async () => {
        assert.is(subject instanceof ConfirmedTransactionData);
        assert.is(subject.id(), "F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF");
        assert.is(subject.type(), "transfer");
        assert.is(subject.timestamp() instanceof DateTime);
        assert.is(subject.confirmations(), BigNumber.ZERO);
        assert.is(subject.sender(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
        assert.is(subject.recipient(), "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH");
        assert.is(subject.amount(), BigNumber.make(100000));
        assert.is(subject.fee(), BigNumber.make(1000));
        assert.is(subject.memo()), "undefined");
});
});
