import nock from "nock";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service";

const matchSnapshot = (transaction): void =>
	assert
		.is({
			min: transaction.min.toString(),
			avg: transaction.avg.toString(),
			max: transaction.max.toString(),
			static: transaction.static.toString(),
		})
		.toMatchSnapshot();

test.after.each(() => nock.cleanAll());

test.before(() => nock.disableNetConnect());

describe("FeeService", () => {
	test("should get the fees", async () => {
		nock("https://btc-test.payvo.com:443")
			.get("/api/fees")
			.reply(200, {
				data: {
					min: 0.00001074,
					avg: 0.00001074,
					max: 0.00180617,
				},
			});

		const result = await (await createService(FeeService, "btc.testnet")).all();

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

		matchSnapshot(result.transfer);
		matchSnapshot(result.secondSignature);
		matchSnapshot(result.delegateRegistration);
		matchSnapshot(result.vote);
		matchSnapshot(result.multiSignature);
		matchSnapshot(result.ipfs);
		matchSnapshot(result.multiPayment);
		matchSnapshot(result.delegateResignation);
		matchSnapshot(result.htlcLock);
		matchSnapshot(result.htlcClaim);
		matchSnapshot(result.htlcRefund);
	});
});
