import { HistoricalPriceTransformer } from "./historical-price-transformer";

describe("CoinGecko", () => {
	describe("HistoricalPriceTransformer", () => {
		it("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/coingecko/historical.json")).default;
			const stubOptions = { type: "day", dateFormat: "DD.MM" };

			const subject = new HistoricalPriceTransformer(stubResponse);

			expect(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
