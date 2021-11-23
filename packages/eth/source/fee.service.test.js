import { assert, loader, test } from "@payvo/sdk-test";
import {nock} from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service";

let subject;

test.before.each(async () => {
	subject = await createService(FeeService);
});

test.after.each(() => nock.cleanAll());

test.before(() => nock.disableNetConnect());

test("should fetch all available fees", async () => {
	nock.fake("https://ethgas.watch").get("/api/gas").reply(200, loader.json(`test/fixtures/client/fees.json`));

	const result = await subject.all();

	assert.containKeys(result, [
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

	assert.equal(result.transfer, {
		min: "148",
		avg: "175",
		max: "199",
		static: "216",
	});
});

test.run();
