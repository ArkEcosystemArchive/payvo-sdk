import { describeWithContext } from "@payvo/sdk-test";

import { MarketTransformer } from "./market-transformer";

describeWithContext(
	"MarketTransformer",
	{ stubOptions: { type: "day", dateFormat: "DD.MM", token: "ARK" } },
	async ({ assert, it, nock, loader }) => {
		it("should transform the given data", async (context) => {
			const stubResponse = loader.json("test/fixtures/coincap/market.json");

			const subject = new MarketTransformer(stubResponse);

			assert.object(subject.transform(context.stubOptions));
		});

		it("should skip unknown currencies", async (context) => {
			const stubResponse = loader.json("test/fixtures/coincap/market.json");

			const subject = new MarketTransformer(stubResponse);

			const stubOptions = { type: "day", dateFormat: "DD.MM", token: "ARK" };
			assert.object(subject.transform({ ...context.stubOptions, currencies: { invalid: {} } }));
		});
	},
);
