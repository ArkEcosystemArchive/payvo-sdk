import { assert, test } from "@payvo/sdk-test";
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

test("should succeed", async () => {
	assert.instance(subject, ConfirmedTransactionData);
	assert.is(subject.id(), "F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF");
	assert.is(subject.type(), "transfer");
	assert.instance(subject.timestamp(), DateTime);
	assert.equal(subject.confirmations(), BigNumber.ZERO);
	assert.is(subject.sender(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
	assert.is(subject.recipient(), "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH");
	assert.equal(subject.amount(), BigNumber.make(100000));
	assert.equal(subject.fee(), BigNumber.make(1000));
	assert.undefined(subject.memo());
});

test.run();
