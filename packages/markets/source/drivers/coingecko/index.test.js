import { CURRENCIES } from "@payvo/sdk-intl";
import { Request } from "@payvo/sdk-http-fetch";
import nock from "nock";

import { CoinGecko } from "./index";

const BASE_URL_COINGECKO = "https://api.coingecko.com/api/v3";
const token = "ARK";
const currency = "USD";

let subject: CoinGecko;

test.before.each(async () => {
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
	test("should return ticker values", async () => {
		const response = await subject.marketData(token);
		const entries = Object.keys(response);
		assert.is(entries).not.toBeEmpty();
		assert.is(entries).toIncludeAllMembers(Object.keys(CURRENCIES));
		assert.is(response.USD.price, 0.176829);
	});

	describe("verifyToken", () => {
		test("should return true if found", async () => {
			assert.is(await subject.verifyToken("ark"), true);
		});

		test("should return false if not found", async () => {
			assert.is(await subject.verifyToken("not-ark"), false);
		});
	});

	test("should return historic day values", async () => {
		const response = await subject.historicalPrice({
			token,
			currency,
			days: 24,
			type: "hour",
			dateFormat: "HH:mm",
		});
		assert.is(response, "object");
		assert.is(response).toContainKeys(["labels", "datasets"]);
	});

	test("should return daily average", async () => {
		const response = await subject.dailyAverage({
			token,
			currency,
			timestamp: Date.now(),
		});
		assert.is(response, 10.2219);
	});

	test("should return the current price", async () => {
		const response = await subject.currentPrice({
			token,
			currency: "BTC",
		});
		assert.is(response, 0.0000207);
	});
});
