import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service.js";

describe("FeeService", async ({ beforeEach, afterEach, beforeAll, it, assert, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(FeeService);
	});

	afterEach(() => nock.cleanAll());

	beforeAll(() => nock.disableNetConnect());

	it("should fetch all available fees", async (context) => {
		nock.fake("https://ethgas.watch").get("/api/gas").reply(200, loader.json(`test/fixtures/client/fees.json`));

		const result = await context.subject.all();

		assert.containKeys(result, [
			"transfer",
			"secondSignature",
			"delegateRegistration",
			"vote",
			"multiSignature",
			"ipfs",
			"multiPayment",
			"delegateResignation",
		]);

		assert.equal(result.transfer, {
			min: "148",
			avg: "175",
			max: "199",
			static: "216",
		});
	});
});
