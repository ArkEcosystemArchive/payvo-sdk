import { describeWithContext } from "@payvo/sdk-test";

import { MarketTransformer } from "./market-transformer";

describeWithContext(
	"MarketTransformer",
	{ stubOptions: { type: "day", dateFormat: "DD.MM" } },
	async ({ assert, it, nock, loader }) => {
		it("should transform the given data", async (context) => {
			const stubResponse = loader.json("test/fixtures/coingecko/market.json");

			const subject = new MarketTransformer(stubResponse.market_data);

			assert.object(subject.transform(context.stubOptions));
		});

		it("should skip unknown currencies", async (context) => {
			const stubResponse = loader.json("test/fixtures/coingecko/market.json");

			const subject = new MarketTransformer(stubResponse.market_data);

			assert.object(subject.transform({ ...context.stubOptions, currencies: { invalid: {} } }));
		});
	},
);
