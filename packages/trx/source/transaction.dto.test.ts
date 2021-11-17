import { Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

let subject: ConfirmedTransactionData;

beforeAll(() => nock.disableNetConnect());

describe("transaction", () => {
	describe("blockId", () => {
		it("should parse blockId correctly", async () => {
			subject = await createService(ConfirmedTransactionData).configure(
				requireModule(`../test/fixtures/client/transactions.json`).data[1],
			);
			expect(subject.blockId()).toBeString();
			expect(subject.blockId()).toBe("14742837");
		});
	});

	describe("memo", () => {
		it("should parse memo correctly", async () => {
			subject = await createService(ConfirmedTransactionData).configure(
				requireModule(`../test/fixtures/client/transactions.json`).data[1],
			);
			expect(subject.memo()).toBe("Mariano");
		});

		it("should parse missing memo correctly", async () => {
			subject = await createService(ConfirmedTransactionData).configure(
				requireModule(`../test/fixtures/client/transactions.json`).data[0],
			);
			expect(subject.memo()).toBeUndefined();
		});
	});
});
