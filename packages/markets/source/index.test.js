import { assert, stub, test } from "@payvo/sdk-test";
import { Request } from "@payvo/sdk-http-fetch";

import { PriceTracker } from "../test/stubs/tracker";
import { MarketService } from "./index";

let subject;

const createSpyAdapter = (method) => {
	const adapter = new PriceTracker();
	const spy = stub(adapter, method);

	subject.setAdapter(adapter);

	return spy;
};

const token = "ARK";
const currency = "USD";

for (const adapter of ["cryptocompare", "coingecko", "coincap"]) {
	test.before.each(() => (subject = MarketService.make(adapter, new Request())));

	test("should call #verifyToken on the adapter instance", async () => {
		const spy = createSpyAdapter("verifyToken");

		await subject.verifyToken("ark");

		spy.calledWith("ark");
	});

	test("should call #marketData on the adapter instance", async () => {
		const spy = createSpyAdapter("marketData");

		await subject.marketData(token);

		spy.calledWith("ARK");
	});

	test("should call #historicalPrice for day values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalPrice");

		await subject.historicalPriceForDay(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "HH:mm",
			days: 24,
			token: "ARK",
			type: "hour",
		});
	});

	test("should call #historicalPrice for week values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalPrice");

		await subject.historicalPriceForWeek(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "ddd",
			days: 7,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalPrice for month values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalPrice");

		await subject.historicalPriceForMonth(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "DD",
			days: 30,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalPrice for quarter values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalPrice");

		await subject.historicalPriceForQuarter(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "DD.MM",
			days: 120,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalPrice for year values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalPrice");

		await subject.historicalPriceForYear(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "DD.MM",
			days: 365,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalVolume for day values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalVolume");

		await subject.historicalVolumeForDay(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "HH:mm",
			days: 24,
			token: "ARK",
			type: "hour",
		});
	});

	test("should call #historicalVolume for week values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalVolume");

		await subject.historicalVolumeForWeek(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "ddd",
			days: 7,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalVolume for month values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalVolume");

		await subject.historicalVolumeForMonth(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "DD",
			days: 30,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalVolume for quarter values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalVolume");

		await subject.historicalVolumeForQuarter(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "DD.MM",
			days: 120,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #historicalVolume for year values on the adapter instance", async () => {
		const spy = createSpyAdapter("historicalVolume");

		await subject.historicalVolumeForYear(token, currency);

		spy.calledWith({
			currency: "USD",
			dateFormat: "DD.MM",
			days: 365,
			token: "ARK",
			type: "day",
		});
	});

	test("should call #dailyAverage on the adapter instance", async () => {
		const spy = createSpyAdapter("dailyAverage");

		const timestamp = Date.now();

		await subject.dailyAverage(token, currency, timestamp);

		spy.calledWith({ currency: "USD", timestamp: timestamp, token: "ARK" });
	});
}

test.run();
