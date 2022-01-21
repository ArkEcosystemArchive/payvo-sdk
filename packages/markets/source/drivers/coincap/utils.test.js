import { describe } from "@payvo/sdk-test";

import { convertToCurrency } from "./utils.js";

describe("convertToCurrency", async ({ assert, it, nock, loader }) => {
	it("If `from` equals `base`, return the basic exchange rate for the `to` currency", async () => {
		assert.is(convertToCurrency(10, { from: "USD", to: "BTC", base: "USD", rates: { BTC: 0.5 } }), 5);
	});

	it("If `to` equals `base`, return the basic inverse rate of the `from` currency", async () => {
		assert.is(convertToCurrency(10, { from: "BTC", to: "USD", base: "USD", rates: { BTC: 0.5 } }), 20);
	});

	it("Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the relative exchange rate between the two currencies.", async () => {
		assert.is(convertToCurrency(10, { from: "ARK", to: "BTC", base: "USD", rates: { ARK: 0.5, BTC: 0.5 } }), 10);
	});

	it("`rates` object does not contain either `from` or `to` currency!", async () => {
		assert.throws(
			() => convertToCurrency(10, { from: "ARK", to: "BTC", base: null, rates: { BTC: 0.1 } }),
			"`rates` object does not contain either `from` or `to` currency!",
		);
	});

	it("Please specify the `from` and/or `to` currency or use parsing!", async () => {
		assert.throws(
			() => convertToCurrency(10, { from: null, to: null, base: null, rates: [] }),
			"Please specify the `from` and/or `to` currency or use parsing!",
		);
	});
});
