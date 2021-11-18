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
			id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			amount: "125000000000",
			fee: "0",
			timestamp: "1970-01-01T00:00:00.000Z",
			sender: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
			recipient: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#sender", () => {
		assert.is(subject.sender()).toEqual("0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4");
	});

	test("#recipient", () => {
		assert.is(subject.recipient()).toEqual("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	test("#amount", () => {
		assert.is(subject.amount().toHuman()).toEqual(125);
	});

	test("#fee", () => {
		assert.is(subject.fee()).toEqual(BigNumber.ZERO);
	});

	test("#timestamp", () => {
		assert.is(subject.timestamp()).toEqual(DateTime.make(0));
	});
});
