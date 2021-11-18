import { assert, loader, test } from "@payvo/sdk-test";

import { MarketTransformer } from "./market-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM", token: "ARK" };

test("should transform the given data", async () => {
	const stubResponse = loader.json("test/fixtures/cryptocompare/market.json");

	const subject = new MarketTransformer(stubResponse.RAW.ARK);

	assert.object(subject.transform(stubOptions));
});

test.run();
