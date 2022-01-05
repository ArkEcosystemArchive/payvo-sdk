import { describeWithContext } from "@payvo/sdk-test";
import { CURRENCIES } from "@payvo/sdk-intl";
import { Request } from "@payvo/sdk-fetch";

import { CoinGecko } from "./index";

describeWithContext(
	"CoinGecko",
	{
		basePath: "https://api.coingecko.com/api/v3",
		token: "ARK",
		currency: "USD",
	},
	async ({ assert, beforeEach, it, loader, nock }) => {
		beforeEach(async (context) => {
			context.subject = new CoinGecko(new Request());

			nock.fake(context.basePath)
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

			nock.fake(context.basePath)
				.get("/simple/price")
				.query(true)
				.reply(200, {
					ark: {
						btc: 0.0000207,
					},
				});

			nock.fake(context.basePath)
				.get("/coins/ark")
				.reply(200, loader.json("test/fixtures/coingecko/market.json"));

			nock.fake(context.basePath)
				.get("/coins/ark/market_chart")
				.query(true)
				.reply(200, loader.json("test/fixtures/coingecko/historical.json"));

			nock.fake(context.basePath)
				.get("/coins/ark/history")
				.query(true)
				.reply(200, loader.json("test/fixtures/coingecko/daily-average.json"));
		});

		it("should return ticker values", async (context) => {
			const response = await context.subject.marketData(context.token);
			const entries = Object.keys(response);
			assert.not.empty(entries);
			assert.includeAllMembers(entries, Object.keys(CURRENCIES));
			assert.is(response.USD.price, 0.176829);
		});

		it("verifyToken", async (context) => {
			assert.true(await context.subject.verifyToken("ark"));
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

		it("should return daily average", async (context) => {
			const response = await context.subject.dailyAverage({
				token: context.token,
				currency: context.currency,
				timestamp: Date.now(context),
			});
			assert.is(response, 10.2219);
		});

		it("should return the current price", async (context) => {
			const response = await context.subject.currentPrice({
				token: context.token,
				currency: "BTC",
			});
			assert.is(response, 0.0000207);
		});
	},
);
