import { Test } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service";

let subject: FeeService;

test.before.each(async () => {
	subject = await createService(FeeService);
});

test.after.each(() => nock.cleanAll());

test.before(() => nock.disableNetConnect());

describe("FeeService", () => {
	test("should fetch all available fees", async () => {
		nock("https://ethgas.watch").get("/api/gas").reply(200, loader.json(`test/fixtures/client/fees.json`));

		const result = await subject.all();

		assert
			.is(result)
			.toContainAllKeys([
				"transfer",
				"secondSignature",
				"delegateRegistration",
				"vote",
				"multiSignature",
				"ipfs",
				"multiPayment",
				"delegateResignation",
				"htlcLock",
				"htlcClaim",
				"htlcRefund",
			]);

		assert.is(result.transfer, {
			min: "148",
			avg: "175",
			max: "199",
			static: "216",
		});
	});
});
