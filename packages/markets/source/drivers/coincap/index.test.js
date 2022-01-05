import { describeWithContext } from "@payvo/sdk-test";
import { CURRENCIES } from "@payvo/sdk-intl";
import { Request } from "@payvo/sdk-fetch";

import { CoinCap } from "./index";

describeWithContext(
	"CoinCap",
	{
		basePath: "https://api.coincap.io/v2",
		token: "ARK",
		currency: "USD",
	},
	async ({ assert, beforeEach, it, loader, nock }) => {
		beforeEach(async (context) => {
			context.subject = new CoinCap(new Request());

			nock.fake(context.basePath)
				.get("/assets")
				.query(true)
				.reply(200, loader.json("test/fixtures/coincap/assets.json"));

			nock.fake(context.basePath)
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

			nock.fake(context.basePath).get("/rates").reply(200, loader.json("test/fixtures/coincap/rates.json"));

			nock.fake(context.basePath)
				.get("/assets/ark/history")
				.query(true)
				.reply(200, loader.json("test/fixtures/coincap/historical.json"))
				.persist();

			nock.fake(context.basePath)
				.get("/assets/ark/history")
				.query((queryObject) => queryObject.interval === "h1")
				.reply(200, loader.json("test/fixtures/coincap/daily-average.json"))
				.persist();
		});

		it("should return ticker values", async (context) => {
			const response = await context.subject.marketData(context.token);
			const entries = Object.keys(response);
			assert.not.empty(entries);
			assert.includeAllMembers(entries, Object.keys(CURRENCIES));

			assert.is(response.USD.price, 0.2169020395525734);
		});

		it("#verifyToken", async (context) => {
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
				timestamp: Date.now(),
			});
			assert.is(response, 0.21617083497138478);
		});

		it("should return the current price", async (context) => {
			const response = await context.subject.currentPrice({
				token: context.token,
				currency: context.currency,
			});
			assert.is(response, 0.21617083497138478);
		});
	},
);
