import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ it, assert, loader }) => {
	it("should parse blockId correctly", async () => {
		const subject = await createService(ConfirmedTransactionData).configure(
			loader.json(`test/fixtures/client/transactions.json`).data[1],
		);

		assert.is(subject.blockId(), "14742837");
	});

	it("should parse memo correctly", async () => {
		const subject = await createService(ConfirmedTransactionData).configure(
			loader.json(`test/fixtures/client/transactions.json`).data[1],
		);

		assert.is(subject.memo(), "Mariano");
	});

	it("should parse missing memo correctly", async () => {
		const subject = await createService(ConfirmedTransactionData).configure(
			loader.json(`test/fixtures/client/transactions.json`).data[0],
		);

		assert.undefined(subject.memo());
	});
});
