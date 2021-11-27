import { describe } from "@payvo/sdk-test";

import { HistoricalPriceTransformer } from "./historical-price-transformer";

describe("HistoricalPriceTransformer", async ({ assert, it, nock, loader }) => {
	it("should transform the given data", async () => {
		const stubOptions = { type: "day", dateFormat: "DD.MM" };
		const stubResponse = loader.json("test/fixtures/cryptocompare/historical.json");

		const subject = new HistoricalPriceTransformer(stubResponse.Data);

		assert.object(subject.transform(stubOptions));
	});
});
