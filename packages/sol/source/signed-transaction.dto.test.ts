import { DateTime } from "@payvo/sdk-intl";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject: SignedTransactionData;

test.before.each(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			sender: "0xdeadbeef",
			recipient: "0xfoobar",
			amount: "120000000000",
			fee: "6",
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
		assert.is(subject.fee().toNumber(), 6);
	});

	test("#timestamp", () => {
		assert.is(DateTime.make(0).isSame(subject.timestamp()), true);
	});
});
