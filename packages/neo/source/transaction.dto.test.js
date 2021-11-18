import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService, requireModule } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

test.before.each(async () => {
    subject = await createService(ConfirmedTransactionData);
    subject.configure({
        txid: "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24",
        time: 1588930966,
        block_height: 4259222,
        asset: "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        amount: 1,
        address_to: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF",
        address_from: "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF",
    });
});

describe("ConfirmedTransactionData", () => {
    test("should succeed", async () => {
        assert.is(subject instanceof ConfirmedTransactionData);
        assert.is(subject.id(), "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24");
        assert.is(subject.type(), "transfer");
        assert.is(subject.timestamp() instanceof DateTime);
        assert.is(subject.confirmations(), BigNumber.ZERO);
        assert.is(subject.sender(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
        assert.is(subject.recipient(), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
        assert.is(subject.amount(), BigNumber.make(1));
        assert.is(subject.fee(), BigNumber.ZERO);
        assert.is(subject.memo()), "undefined");
});
});
