import { assert, fixture, nock, test } from "@payvo/sdk-test";
import { CURRENCIES } from "@payvo/sdk-intl";
import { Request } from "@payvo/sdk-http-fetch";

import { CoinCap } from "./index";

const BASE_URL_COINCAP = "https://api.coincap.io/v2";
const token = "ARK";
const currency = "USD";

let subject;

test.before.each(async () => {
	subject = new CoinCap(new Request());

	nock(BASE_URL_COINCAP)
		.get("/assets")
		.query(true)
		.reply(200, fixture.load("test/fixtures/coincap/assets.json"));

	nock(BASE_URL_COINCAP)
		.get("/assets/ark")
		.reply(200, {
			data: {
				id: "ark",
				rank: "97",
				symbol: "ARK",
				name: "Ark",
				supply: "118054742.0000000000000000",
				maxSupply: null,
				marketCapUsd: "25606314.3186528481730628",
				volumeUsd24Hr: "200149.6642060181260072",
				priceUsd: "0.2169020395525734",
				changePercent24Hr: "4.0498226198624989",
				vwap24Hr: "0.2168174454697512",
			},
			timestamp: 1581339180902,
		});

	nock(BASE_URL_COINCAP)
		.get("/rates")
		.reply(200, fixture.load("test/fixtures/coincap/rates.json"));

	nock(BASE_URL_COINCAP)
		.get("/assets/ark/history")
		.query(true)
		.reply(200, fixture.load("test/fixtures/coincap/historical.json"))
		.persist();

	nock(BASE_URL_COINCAP)
		.get("/assets/ark/history")
		.query((queryObject) => queryObject.interval === "h1")
		.reply(200, fixture.load("test/fixtures/coincap/daily-average.json"))
		.persist();
});

test("should return ticker values", async () => {
	const response = await subject.marketData(token);
	const entries = Object.keys(response);
	assert.notEmpty(entries);
	assert.includeAllMembers(entries, Object.keys(CURRENCIES));

	assert.is(response.USD.price, 0.2169020395525734);
});

test("#verifyToken", async () => {
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
	assert.is(response, 0.21617083497138478);
});

test("should return the current price", async () => {
	const response = await subject.currentPrice({
		token,
		currency,
	});
	assert.is(response, 0.21617083497138478);
});

test.run();
