import { DateTime } from "@payvo/sdk-intl";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject: SignedTransactionData;

beforeEach(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			sender: "0xdeadbeef",
			receiver: "0xfoobar",
			value: "120000000000000000000",
			timestamp: "1970-01-01T00:00:00.000Z",
			gasUsed: 2,
			gasPrice: 3,
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#sender", () => {
		assert.is(subject.sender()).toEqual("0xdeadbeef");
	});

	test("#recipient", () => {
		assert.is(subject.recipient()).toEqual("0xfoobar");
	});

	test("#amount", () => {
		assert.is(subject.amount().toHuman()).toEqual(120);
	});

	test("#fee", () => {
		assert.is(subject.fee().toNumber()).toEqual(6);
	});

	test("#timestamp", () => {
		assert.is(DateTime.make(0).isSame(subject.timestamp()), true);
	});
});
