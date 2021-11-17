import { CURRENCIES } from "@payvo/sdk-intl";
import { Request } from "@payvo/sdk-http-fetch";
import nock from "nock";

import { CoinGecko } from "./index.js";

const BASE_URL_COINGECKO = "https://api.coingecko.com/api/v3";
const token = "ARK";
const currency = "USD";

let subject: CoinGecko;

beforeEach(async () => {
	subject = new CoinGecko(new Request());

	nock(BASE_URL_COINGECKO)
		.get("/coins/list")
		.reply(200, [
			{
				id: "ark",
				symbol: "ark",
				name: "ark",
			},
			{
				id: "dark",
				symbol: "dark",
				name: "dark",
			},
		]);

	nock(BASE_URL_COINGECKO)
		.get("/simple/price")
		.query(true)
		.reply(200, {
			ark: {
				btc: 0.0000207,
			},
		});

	nock(BASE_URL_COINGECKO)
		.get("/coins/ark")
		.reply(200, (await import("../../../test/fixtures/coingecko/market.json")).default);

	nock(BASE_URL_COINGECKO)
		.get("/coins/ark/market_chart")
		.query(true)
		.reply(200, (await import("../../../test/fixtures/coingecko/historical.json")).default);

	nock(BASE_URL_COINGECKO)
		.get("/coins/ark/history")
		.query(true)
		.reply(200, (await import("../../../test/fixtures/coingecko/daily-average.json")).default);
});

describe("CoinGecko", () => {
	it("should return ticker values", async () => {
		const response = await subject.marketData(token);
		const entries = Object.keys(response);
		expect(entries).not.toBeEmpty();
		expect(entries).toIncludeAllMembers(Object.keys(CURRENCIES));
		expect(response.USD.price).toBe(0.176829);
	});

	describe("verifyToken", () => {
		it("should return true if found", async () => {
			expect(await subject.verifyToken("ark")).toBe(true);
		});

		it("should return false if not found", async () => {
			expect(await subject.verifyToken("not-ark")).toBe(false);
		});
	});

	it("should return historic day values", async () => {
		const response = await subject.historicalPrice({
			token,
			currency,
			days: 24,
			type: "hour",
			dateFormat: "HH:mm",
		});
		expect(response).toBeObject();
		expect(response).toContainKeys(["labels", "datasets"]);
	});

	it("should return daily average", async () => {
		const response = await subject.dailyAverage({
			token,
			currency,
			timestamp: Date.now(),
		});
		expect(response).toBe(10.2219);
	});

	it("should return the current price", async () => {
		const response = await subject.currentPrice({
			token,
			currency: "BTC",
		});
		expect(response).toBe(0.0000207);
	});
});
