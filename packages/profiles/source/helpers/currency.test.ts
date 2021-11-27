import "jest-extended";

import { Currency } from "./currency.js";

describe("Helpers.Currency", () => {
	it("should format fiat", () => {
		expect(Currency.format(10, "USD")).toBe("$10.00");
	});

	it.each(["BTC", "ETH", "ARK", "DARK", "LSK", "BIND", "SOL"])("should format crypto (%s)", (ticker) => {
		expect(Currency.format(10, ticker)).toBe(`10 ${ticker}`);
	});

	it.each([
		"AUD",
		"BRL",
		"CAD",
		"CHF",
		"CNY",
		"DKK",
		"EUR",
		"GBP",
		"HKD",
		"IDR",
		"INR",
		"MXN",
		"NOK",
		"RUB",
		"SEK",
		"USD",
	])("should allow to hide ticker (%s)", (ticker) => {
		expect(Currency.format(10, ticker, { withTicker: false })).toBe("10.00");
	});

	it("should allow to pass locale", () => {
		expect(Currency.format(1, "BTC", { locale: "en-US" })).toBe("1 BTC");
		expect(Currency.format(1, "USD", { locale: "en-US" })).toBe("$1.00");
	});
});
