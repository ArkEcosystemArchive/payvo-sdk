import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service.js";

describe("FeeService", async ({ beforeAll, afterEach, it, assert, nock }) => {
	beforeAll(() => nock.disableNetConnect());

	afterEach(() => nock.cleanAll());

	it("should get the fees", async () => {
		nock.fake("https://btc-test.payvo.com:443")
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00001074,
					max: 0.00180617,
				},
			});

		const result = await (await createService(FeeService, "btc.testnet")).all();

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

		for (const [name, transaction] of Object.entries({
			fees_transfer: result.transfer,
			fees_second_signature: result.secondSignature,
			fees_delegate_registration: result.delegateRegistration,
			fees_vote: result.vote,
			fees_multi_signature: result.multiSignature,
			fees_ipfs: result.ipfs,
			fees_multi_payment: result.multiPayment,
			fees_delegate_resignation: result.delegateResignation,
		})) {
			assert.snapshot(name, {
				min: transaction.min,
				avg: transaction.avg,
				max: transaction.max,
				static: transaction.static,
			});
		}
	});
});
