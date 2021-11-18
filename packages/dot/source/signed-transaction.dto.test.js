import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

test.before.each(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			signature: {
				signer: "0xdeadbeef",
			},
			method: {
				args: {
					dest: "0xfoobar",
					value: "1200000000000",
				},
			},
			timestamp: "1970-01-01T00:00:00.000Z",
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#sender", () => {
		assert.is(subject.sender(), "0xdeadbeef");
	});

	test("#recipient", () => {
		assert.is(subject.recipient(), "0xfoobar");
	});

	test("#amount", () => {
		assert.is(subject.amount().toHuman(), 120);
	});

	test("#fee", () => {
		assert.is(subject.fee().toNumber(), 0);
	});

	test("#timestamp", () => {
		assert.is(DateTime.make(0).isSame(subject.timestamp()), true);
	});
});
