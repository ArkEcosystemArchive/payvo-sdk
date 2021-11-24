import { describe } from "@payvo/sdk-test";

import { BigNumber } from "./bignumber";
import { CurrencyFormatter } from "./currency-formatter";

describe("CurrencyFormatter", async ({ assert, it }) => {
	it("should format the value with a ticker", () => {
		assert.is(CurrencyFormatter.simpleFormatCrypto(10, "ETH"), "10 ETH");
	});

	it("should transform the value to a BigNumber instance", () => {
		assert.instance(CurrencyFormatter.toBuilder(10), BigNumber);
	});

	it("should should convert scientific notation to a unit", () => {
		assert.is(CurrencyFormatter.subToUnit(10e8).toString(), "10");
	});

	it("should should convert a unit to scientific notation", () => {
		assert.is(CurrencyFormatter.unitToSub(10).toString(), "1000000000");
	});

	it("should should convert scientific notation to a unit with a multiplier", () => {
		assert.is(CurrencyFormatter.cryptoToCurrency(10e8, 5), "50");
	});

	it("should should convert a unit with a multiplier", () => {
		assert.is(CurrencyFormatter.cryptoToCurrency(10, 5, { fromSubUnit: false, decimals: 8 }), "50");
	});
});
