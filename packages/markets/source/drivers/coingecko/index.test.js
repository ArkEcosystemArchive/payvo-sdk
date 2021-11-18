import { assert, loader, nock, test } from "@payvo/sdk-test";
import { CURRENCIES } from "@payvo/sdk-intl";
import { Request } from "@payvo/sdk-http-fetch";

import { CoinGecko } from "./index";

const BASE_URL_COINGECKO = "https://api.coingecko.com/api/v3";
const token = "ARK";
const currency = "USD";

let subject;

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

	nock(BASE_URL_COINGECKO).get("/coins/ark").reply(200, loader.json("test/fixtures/coingecko/market.json"));

	nock(BASE_URL_COINGECKO)
		.get("/coins/ark/market_chart")
		.query(true)
		.reply(200, loader.json("test/fixtures/coingecko/historical.json"));

	nock(BASE_URL_COINGECKO)
		.get("/coins/ark/history")
		.query(true)
		.reply(200, loader.json("test/fixtures/coingecko/daily-average.json"));
});

test("should return ticker values", async () => {
	const response = await subject.marketData(token);
	const entries = Object.keys(response);
	assert.notEmpty(entries);
	assert.includeAllMembers(entries, Object.keys(CURRENCIES));
	assert.is(response.USD.price, 0.176829);
});

test("verifyToken", async () => {
	assert.true(await subject.verifyToken("ark"));
	assert.false(await subject.verifyToken("not-ark"));
});

test("should return historic day values", async () => {
	const response = await subject.historicalPrice({
		token,
		currency,
		days: 24,
		type: "hour",
		dateFormat: "HH:mm",
	});
	assert.object(response);
	assert.containKeys(response, ["labels", "datasets"]);
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

test.run();
