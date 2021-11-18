import { HistoricalPriceTransformer } from "./historical-price-transformer";

describe("CoinGecko", () => {
	describe("HistoricalPriceTransformer", () => {
		test("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/coingecko/historical.json")).default;
			const stubOptions = { type: "day", dateFormat: "DD.MM" };

			const subject = new HistoricalPriceTransformer(stubResponse);

			assert.is(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
