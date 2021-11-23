import { assert, test } from "@payvo/sdk-test";
import { nock } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service";

const matchSnapshot = (name, transaction) =>
	assert.snapshot(name, {
		min: transaction.min,
		avg: transaction.avg,
		max: transaction.max,
		static: transaction.static,
	});

test.after.each(() => nock.cleanAll());

test.before(() => nock.disableNetConnect());

test("should get the fees", async () => {
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
		"htlcLock",
		"htlcClaim",
		"htlcRefund",
	]);

	matchSnapshot("fees_transfer", result.transfer);
	matchSnapshot("fees_second_signature", result.secondSignature);
	matchSnapshot("fees_delegate_registration", result.delegateRegistration);
	matchSnapshot("fees_vote", result.vote);
	matchSnapshot("fees_multi_signature", result.multiSignature);
	matchSnapshot("fees_ipfs", result.ipfs);
	matchSnapshot("fees_multi_payment", result.multiPayment);
	matchSnapshot("fees_delegate_resignation", result.delegateResignation);
	matchSnapshot("fees_htlc_lock", result.htlcLock);
	matchSnapshot("fees_htlc_claim", result.htlcClaim);
	matchSnapshot("fees_htlc_refund", result.htlcRefund);
});

test.run();
