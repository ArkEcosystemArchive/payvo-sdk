import { HistoricalPriceTransformer } from "./historical-price-transformer.js";

const stubOptions = { type: "day", dateFormat: "DD.MM" };

describe("CryptoCompare", () => {
    describe("HistoricalPriceTransformer", () => {
        it("should transform the given data", async () => {
            const stubResponse = (await import("../../../../test/fixtures/cryptocompare/historical.json")).default;

            const subject = new HistoricalPriceTransformer(stubResponse.Data);

            expect(subject.transform(stubOptions)).toMatchSnapshot();
        });
    });
});
