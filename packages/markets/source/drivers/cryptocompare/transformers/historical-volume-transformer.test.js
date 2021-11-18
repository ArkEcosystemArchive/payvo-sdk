import { HistoricalVolumeTransformer } from "./historical-volume-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

describe("CryptoCompare", () => {
	describe("HistoricalVolumeTransformer", () => {
		test("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/cryptocompare/historical.json")).default;

			const subject = new HistoricalVolumeTransformer(stubResponse.Data);

			assert.is(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
