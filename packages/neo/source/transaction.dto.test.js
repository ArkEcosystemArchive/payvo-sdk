import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

describe("ConfirmedTransactionData", async ({ assert, it, beforeEach }) => {
	beforeEach(async () => {
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

	it("should succeed", async () => {
		assert.instance(subject, ConfirmedTransactionData);
		assert.is(subject.id(), "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24");
		assert.is(subject.type(), "transfer");
		assert.instance(subject.timestamp(), DateTime);
		assert.equal(subject.confirmations(), BigNumber.ZERO);
		assert.is(subject.sender(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
		assert.is(subject.recipient(), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
		assert.equal(subject.amount(), BigNumber.make(1));
		assert.equal(subject.fee(), BigNumber.ZERO);
		assert.undefined(subject.memo());
	});
});
