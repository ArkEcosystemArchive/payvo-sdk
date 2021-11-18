import { assert, fixture, test } from "@payvo/sdk-test";

import { HistoricalPriceTransformer } from "./historical-price-transformer";

		test("should transform the given data", async () => {
			const stubResponse = fixture.load("test/fixtures/coingecko/historical.json");
			const stubOptions = { type: "day", dateFormat: "DD.MM" };

			const subject = new HistoricalPriceTransformer(stubResponse);

			assert.object(subject.transform(stubOptions));
		});

		test.run();
