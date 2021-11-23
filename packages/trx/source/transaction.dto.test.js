import { assert, loader, test } from "@payvo/sdk-test";
import {nock} from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

test.before(() => nock.disableNetConnect());

test("should parse blockId correctly", async () => {
	subject = await createService(ConfirmedTransactionData).configure(
		loader.json(`test/fixtures/client/transactions.json`).data[1],
	);

	assert.is(subject.blockId(), "14742837");
});

test("should parse memo correctly", async () => {
	subject = await createService(ConfirmedTransactionData).configure(
		loader.json(`test/fixtures/client/transactions.json`).data[1],
	);

	assert.is(subject.memo(), "Mariano");
});

test("should parse missing memo correctly", async () => {
	subject = await createService(ConfirmedTransactionData).configure(
		loader.json(`test/fixtures/client/transactions.json`).data[0],
	);

	assert.undefined(subject.memo());
});

test.run();
