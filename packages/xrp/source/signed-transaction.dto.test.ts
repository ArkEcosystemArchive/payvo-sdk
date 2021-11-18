import { DateTime } from "@payvo/sdk-intl";
import { Exceptions } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject: SignedTransactionData;

test.before.each(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			timestamp: "1970-01-01T00:00:00.000Z",
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#sender", () => {
		assert.is(() => subject.sender()).toThrowError(Exceptions.NotImplemented);
	});

	test("#recipient", () => {
		assert.is(() => subject.recipient()).toThrowError(Exceptions.NotImplemented);
	});

	test("#amount", () => {
		assert.is(() => subject.amount()).toThrowError(Exceptions.NotImplemented);
	});

	test("#fee", () => {
		assert.is(() => subject.fee()).toThrowError(Exceptions.NotImplemented);
	});

	test("#timestamp", () => {
		assert.is(DateTime.make(0).isSame(subject.timestamp()), true);
	});
});
