import { describe } from "@payvo/sdk-test";

import { MarketTransformer } from "./market-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM", token: "ARK" };

describe("MarketTransformer", async ({ assert, afterEach, beforeEach, it, loader, nock }) => {
	it("should transform the given data", async () => {
		const stubResponse = loader.json("test/fixtures/coincap/market.json");

		const subject = new MarketTransformer(stubResponse);

		assert.object(subject.transform(stubOptions));
	});

	it("should skip unknown currencies", async () => {
		const stubResponse = loader.json("test/fixtures/coincap/market.json");

		const subject = new MarketTransformer(stubResponse);

		assert.object(subject.transform({ ...stubOptions, currencies: { invalid: {} } }));
	});
});
