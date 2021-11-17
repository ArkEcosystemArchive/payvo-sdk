import { MarketTransformer } from "./market-transformer.js";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

describe("MarketTransformer", () => {
	it("should transform the given data", async () => {
		const stubResponse = (await import("../../../../test/fixtures/coingecko/market.json")).default;

		const subject = new MarketTransformer(stubResponse.market_data);

		expect(subject.transform(stubOptions)).toMatchSnapshot();
	});

	it("should skip unknown currencies", async () => {
		const stubResponse = (await import("../../../../test/fixtures/coingecko/market.json")).default;

		const subject = new MarketTransformer(stubResponse.market_data);

		expect(subject.transform({ ...stubOptions, currencies: { invalid: {} } })).toMatchSnapshot();
	});
});
