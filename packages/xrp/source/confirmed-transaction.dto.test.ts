import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(fixture.result);
		context.subject.withDecimals(6);
	});

	it("should succeed", async (context) => {
		assert.instance(context.subject, ConfirmedTransactionData);
		assert.is(context.subject.id(), "F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF");
		assert.is(context.subject.type(), "transfer");
		assert.instance(context.subject.timestamp(), DateTime);
		assert.equal(context.subject.confirmations(), BigNumber.ZERO);
		assert.is(context.subject.sender(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
		assert.is(context.subject.recipient(), "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH");
		assert.equal(context.subject.amount(), BigNumber.make(1000));
		assert.equal(context.subject.fee(), BigNumber.make(10000000));
		assert.undefined(context.subject.memo());
	});
});
