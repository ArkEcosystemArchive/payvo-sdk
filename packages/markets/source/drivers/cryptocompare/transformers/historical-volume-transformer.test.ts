import { HistoricalVolumeTransformer } from "./historical-volume-transformer.js";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

describe("CryptoCompare", () => {
    describe("HistoricalVolumeTransformer", () => {
        it("should transform the given data", async () => {
            const stubResponse = (await import("../../../../test/fixtures/cryptocompare/historical.json")).default;

            const subject = new HistoricalVolumeTransformer(stubResponse.Data);

            expect(subject.transform(stubOptions)).toMatchSnapshot();
        });
    });
});
