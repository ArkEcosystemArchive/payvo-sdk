import { assert, loader, test } from "@payvo/sdk-test";

import { HistoricalVolumeTransformer } from "./historical-volume-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

test("should transform the given data", async () => {
	const stubResponse = loader.json("test/fixtures/cryptocompare/historical.json");

	const subject = new HistoricalVolumeTransformer(stubResponse.Data);

	assert.object(subject.transform(stubOptions));
});

test.run();
