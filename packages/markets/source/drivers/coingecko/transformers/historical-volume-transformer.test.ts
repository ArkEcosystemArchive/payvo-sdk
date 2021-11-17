import { HistoricalVolumeTransformer } from "./historical-volume-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

describe("CoinGecko", () => {
	describe("HistoricalVolumeTransformer", () => {
		it("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/coingecko/historical-volume.json")).default;

			const subject = new HistoricalVolumeTransformer(stubResponse);

			expect(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
