import { Request } from "@payvo/sdk-http-fetch";
import nock from "nock";

import { Blockfolio } from "./blockfolio.js";

let subject: Blockfolio;

beforeAll(() => nock.disableNetConnect());

beforeEach(() => (subject = new Blockfolio(new Request())));

afterEach(() => nock.cleanAll());

describe("Blockfolio", () => {
	describe("#findByCoin", () => {
		it("should retrieve the feed and findByCoin it", async () => {
			nock("https://news.payvo.com")
				.get("/api")
				.query(true)
				.reply(200, (await import("../test/fixtures/blockfolio.json")).default);

			const result = await subject.findByCoin({ coins: ["ARK"] });

			expect(result).toBeObject();
			expect(result.data).toBeArray();
			expect(result.meta).toBeObject();
		});
	});
});
