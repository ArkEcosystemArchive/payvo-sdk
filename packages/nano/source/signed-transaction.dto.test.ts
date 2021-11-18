import { DateTime } from "@payvo/sdk-intl";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { BigNumber } from "@payvo/sdk-helpers";

let subject: SignedTransactionData;

beforeEach(async () => {
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

describe("SignedTransactionData", () => {
	test("#sender", () => {
		assert.is(subject.sender()).toEqual("123456");
	});

	test("#recipient", () => {
		assert.is(subject.recipient()).toEqual("456789");
	});

	test("#amount", () => {
		assert.is(subject.amount().toHuman()).toEqual(120);
	});

	test("#fee", () => {
		assert.is(subject.fee()).toEqual(BigNumber.ZERO);
	});

	test("#timestamp", () => {
		assert.is(DateTime.make(0).isSame(subject.timestamp()), true);
	});
});
