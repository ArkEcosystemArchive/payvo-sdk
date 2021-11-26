import { describeWithContext } from "@payvo/sdk-test";
import { Request } from "@payvo/sdk-http-fetch";

import { CryptoCompare } from "./index";

describeWithContext(
	"CryptoCompare",
	{
		basePath: "https://min-api.cryptocompare.com",
		token: "ARK",
		currency: "USD",
	},
	async ({ assert, beforeEach, it, loader, nock }) => {
		beforeEach(async (context) => {
			context.subject = new CryptoCompare(new Request());

			nock.fake(context.basePath)
				.get("/data/pricemultifull")
				.query(true)
				.reply(200, loader.json("test/fixtures/cryptocompare/market.json"));

			nock.fake(context.basePath)
				.get(/\/data\/histo.+/)
				.reply(200, loader.json("test/fixtures/cryptocompare/historical.json"));
		});

		it("should return ticker values", async (context) => {
			const response = await context.subject.marketData(context.token);
			const entries = Object.keys(response);
			assert.not.empty(entries);
			assert.includeAllMembers(entries, [
				"BTC",
				"ETH",
				"LTC",
				"AUD",
				"BRL",
				"CAD",
				"CHF",
				"CNY",
				"EUR",
				"GBP",
				"HKD",
				"IDR",
				"INR",
				"JPY",
				"KRW",
				"MXN",
				"RUB",
				"USD",
			]);
			assert.is(response.USD.price, 0.178045896);
		});

		it("verifyToken", async (context) => {
			nock.fake(context.basePath).get("/data/price").query(true).reply(200, {
				BTC: 0.00002073,
			});

			assert.true(await context.subject.verifyToken("ark"));

			nock.fake(context.basePath).get("/data/price").query(true).reply(200, {
				Response: "Error",
			});

			assert.false(await context.subject.verifyToken("not-ark"));
		});

		it("should return historic day values", async (context) => {
			const response = await context.subject.historicalPrice({
				token: context.token,
				currency: context.currency,
				days: 24,
				type: "hour",
				dateFormat: "HH:mm",
			});
			assert.object(response);
			assert.containKeys(response, ["labels", "datasets"]);
		});

		it("should return the current price", async (context) => {
			nock.fake(context.basePath)
				.get("/data/price")
				.query(true)
				.reply(200, loader.json("test/fixtures/cryptocompare/price.json"));

			const response = await context.subject.currentPrice({
				token: context.token,
				currency: context.currency,
			});
			assert.is(response, 1.635);
		});
	},
);
