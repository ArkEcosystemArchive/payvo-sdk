import { assert, describe, test } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

describe("AddressService", async ({ assert, beforeEach, it }) => {
beforeEach(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			sender: "zil1ua64tlepq090nw8dttzxyaa9q5zths8w4m9qun",
			recipient: "zil1ua64tlepq090nw8dttzxyaa9q5zths8w4m9123",
			amount: "120000000000000",
			fee: "25",
			timestamp: "1970-01-01T00:00:00.000Z",
		},
		"",
	);
});

it("#sender", () => {
	assert.is(subject.sender(), "zil1ua64tlepq090nw8dttzxyaa9q5zths8w4m9qun");
});

it("#recipient", () => {
	assert.is(subject.recipient(), "zil1ua64tlepq090nw8dttzxyaa9q5zths8w4m9123");
});

it("#amount", () => {
	assert.is(subject.amount().toHuman(), 120);
});

it("#fee", () => {
	assert.is(subject.fee().toString(), "25");
});

it("#timestamp", () => {
	assert.true(DateTime.make(0).isSame(subject.timestamp()));
});
});
