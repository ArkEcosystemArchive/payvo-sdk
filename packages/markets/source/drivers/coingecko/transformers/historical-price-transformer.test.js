import { describe } from "@payvo/sdk-test";

import { HistoricalPriceTransformer } from "./historical-price-transformer";

describe("HistoricalPriceTransformer", async ({ assert, it, nock, loader }) => {
	it("should transform the given data", async () => {
		const stubResponse = loader.json("test/fixtures/coingecko/historical.json");
		const stubOptions = { type: "day", dateFormat: "DD.MM" };

		const subject = new HistoricalPriceTransformer(stubResponse);

		assert.object(subject.transform(stubOptions));
	});
});
