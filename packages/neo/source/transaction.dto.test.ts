import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

describe("ConfirmedTransactionData", async ({ assert, it, beforeEach }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({
			txid: "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24",
			time: 1588930966,
			block_height: 4259222,
			asset: "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
			amount: 1,
			address_to: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF",
			address_from: "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF",
		});
	});

	it("should succeed", async (context) => {
		assert.instance(context.subject, ConfirmedTransactionData);
		assert.is(context.subject.id(), "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24");
		assert.is(context.subject.type(), "transfer");
		assert.instance(context.subject.timestamp(), DateTime);
		assert.equal(context.subject.confirmations(), BigNumber.ZERO);
		assert.is(context.subject.sender(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
		assert.is(context.subject.recipient(), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
		assert.equal(context.subject.amount(), BigNumber.make(1));
		assert.equal(context.subject.fee(), BigNumber.ZERO);
		assert.undefined(context.subject.memo());
	});
});
