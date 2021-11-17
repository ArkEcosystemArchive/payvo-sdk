import { MarketTransformer } from "./market-transformer.js";

const stubOptions = { type: "day", dateFormat: "DD.MM", token: "ARK" };

describe("CryptoCompare", () => {
	describe("MarketTransformer", () => {
		it("should transform the given data", async () => {
			const stubResponse = (await import("../../../../test/fixtures/cryptocompare/market.json")).default;

			const subject = new MarketTransformer(stubResponse.RAW.ARK);

			expect(subject.transform(stubOptions)).toMatchSnapshot();
		});
	});
});
