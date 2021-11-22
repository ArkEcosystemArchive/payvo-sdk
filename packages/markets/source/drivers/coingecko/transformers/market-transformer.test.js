import { assert, loader, test } from "@payvo/sdk-test";

import { MarketTransformer } from "./market-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

test("should transform the given data", async () => {
	const stubResponse = loader.json("test/fixtures/coingecko/market.json");

	const subject = new MarketTransformer(stubResponse.market_data);

	assert.object(subject.transform(stubOptions));
});

test("should skip unknown currencies", async () => {
	const stubResponse = loader.json("test/fixtures/coingecko/market.json");

	const subject = new MarketTransformer(stubResponse.market_data);

	assert.object(subject.transform({ ...stubOptions, currencies: { invalid: {} } }));
});

test.run();