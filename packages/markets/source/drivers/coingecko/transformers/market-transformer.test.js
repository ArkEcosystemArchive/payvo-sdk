import { MarketTransformer } from "./market-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

describe("MarketTransformer", () => {
	test("should transform the given data", async () => {
		const stubResponse = (await import("../../../../test/fixtures/coingecko/market.json")).default;

		const subject = new MarketTransformer(stubResponse.market_data);

		assert.is(subject.transform(stubOptions)).toMatchSnapshot();
	});

	test("should skip unknown currencies", async () => {
		const stubResponse = (await import("../../../../test/fixtures/coingecko/market.json")).default;

		const subject = new MarketTransformer(stubResponse.market_data);

		assert.is(subject.transform({ ...stubOptions, currencies: { invalid: {} } })).toMatchSnapshot();
	});
});
