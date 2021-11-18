import { MarketTransformer } from "./market-transformer";

const stubOptions = { type: "day", dateFormat: "DD.MM", token: "ARK" };

describe("CryptoCompare", () => {
	describe("MarketTransformer", () => {
		it("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/cryptocompare/market.json")).default;

			const subject = new MarketTransformer(stubResponse.RAW.ARK);

			assert.is(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
