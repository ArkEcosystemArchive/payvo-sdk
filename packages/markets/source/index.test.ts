import { describe } from "@payvo/sdk-test";
import { Request } from "@payvo/sdk-http-fetch";

import { PriceTracker } from "../test/stubs/tracker";
import { MarketService } from "./index";

for (const adapter of ["cryptocompare", "coingecko", "coincap"]) {
	describe(`MarketService(${adapter})`, async ({ beforeEach, it, stub }) => {
		const token = "ARK";
		const currency = "USD";

		const createSpyAdapter = (stub, method, subject) => {
			const adapter = new PriceTracker();
			const spy = stub(adapter, method);

			subject.setAdapter(adapter);

			return spy;
		};

		beforeEach((context) => (context.subject = MarketService.make(adapter, new Request())));

		it("should call #verifyToken on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "verifyToken", context.subject);

			await context.subject.verifyToken("ark");

			spy.calledWith("ark");
		});

		it("should call #marketData on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "marketData", context.subject);

			await context.subject.marketData(token);

			spy.calledWith("ARK");
		});

		it("should call #historicalPrice for day values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalPrice", context.subject);

			await context.subject.historicalPriceForDay(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "HH:mm",
				days: 24,
				token: "ARK",
				type: "hour",
			});
		});

		it("should call #historicalPrice for week values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalPrice", context.subject);

			await context.subject.historicalPriceForWeek(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "ddd",
				days: 7,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalPrice for month values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalPrice", context.subject);

			await context.subject.historicalPriceForMonth(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "DD",
				days: 30,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalPrice for quarter values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalPrice", context.subject);

			await context.subject.historicalPriceForQuarter(token, currency);
			spy.calledWith({
				currency: "USD",
				dateFormat: "DD.MM",
				days: 120,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalPrice for year values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalPrice", context.subject);

			await context.subject.historicalPriceForYear(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "DD.MM",
				days: 365,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalVolume for day values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalVolume", context.subject);

			await context.subject.historicalVolumeForDay(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "HH:mm",
				days: 24,
				token: "ARK",
				type: "hour",
			});
		});

		it("should call #historicalVolume for week values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalVolume", context.subject);

			await context.subject.historicalVolumeForWeek(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "ddd",
				days: 7,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalVolume for month values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalVolume", context.subject);

			await context.subject.historicalVolumeForMonth(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "DD",
				days: 30,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalVolume for quarter values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalVolume", context.subject);

			await context.subject.historicalVolumeForQuarter(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "DD.MM",
				days: 120,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #historicalVolume for year values on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "historicalVolume", context.subject);

			await context.subject.historicalVolumeForYear(token, currency);

			spy.calledWith({
				currency: "USD",
				dateFormat: "DD.MM",
				days: 365,
				token: "ARK",
				type: "day",
			});
		});

		it("should call #dailyAverage on the adapter instance", async (context) => {
			const spy = createSpyAdapter(stub, "dailyAverage", context.subject);

			const timestamp = Date.now();

			await context.subject.dailyAverage(token, currency, timestamp);

			spy.calledWith({ currency: "USD", timestamp: timestamp, token: "ARK" });
		});
	});
}
