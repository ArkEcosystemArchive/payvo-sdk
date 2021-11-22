import { assert, test } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { BigNumber } from "@payvo/sdk-helpers";

let subject;

test.before.each(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			fromAddress: "123456",
			toAddress: "456789",
			amountRaw: "120000000000000000000000000000000",
			timestamp: "1970-01-01T00:00:00.000Z",
		},
		"",
	);
});

test("#sender", () => {
	assert.is(subject.sender(), "123456");
});

test("#recipient", () => {
	assert.is(subject.recipient(), "456789");
});

test("#amount", () => {
	assert.is(subject.amount().toHuman(), 120);
});

test("#fee", () => {
	assert.equal(subject.fee(), BigNumber.ZERO);
});

test("#timestamp", () => {
	assert.true(DateTime.make(0).isSame(subject.timestamp()));
});

test.run();