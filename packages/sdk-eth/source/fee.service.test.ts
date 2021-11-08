import nock from "nock";

import { createService, require } from "../test/mocking";
import { FeeService } from "./fee.service";

let subject: FeeService;

beforeEach(async () => {
	subject = await createService(FeeService);
});

afterEach(() => nock.cleanAll());

beforeAll(() => nock.disableNetConnect());

describe("FeeService", () => {
	it("should fetch all available fees", async () => {
		nock("https://ethgas.watch")
			.get("/api/gas")
			.reply(200, await require(`../test/fixtures/client/fees.json`));

		const result = await subject.all();

		expect(result).toContainAllKeys([
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

		expect(result.transfer).toEqual({
			min: "148",
			avg: "175",
			max: "199",
			static: "216",
		});
	});
});
