import { Currency } from "./currency.js";

describe("Helpers.Currency", () => {
	it("should format fiat", () => {
		expect(Currency.format(10, "USD")).toEqual("$10.00");
	});

	it("should format crypto", () => {
		expect(Currency.format(1, "DARK")).toEqual("1 DARK");
		expect(Currency.format(1, "BTC")).toEqual("1 BTC");
	});

	it("should support passing the locale", () => {
		expect(Currency.format(1, "BTC", { locale: "en-US" })).toEqual("1 BTC");
	});
});
