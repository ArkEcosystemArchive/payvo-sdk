import "jest-extended";

import { Currency } from "./currency";

describe("Helpers.Currency", () => {
	it("should format fiat", () => {
		expect(Currency.format(10, "USD")).toBe("$10.00");
	});

	it("should format crypto", () => {
		expect(Currency.format(1, "DARK")).toBe("1 DARK");
		expect(Currency.format(1, "BTC")).toBe("1 BTC");
	});

	it("should allow to hide ticker", () => {
		expect(Currency.format(10, "USD", { withTicker: false })).toBe("10.00");
		expect(Currency.format(1, "BTC", { withTicker: false })).toBe("1");
	});

	it("should allow to pass locale", () => {
		expect(Currency.format(1, "BTC", { locale: "en-US" })).toBe("1 BTC");
		expect(Currency.format(1, "USD", { locale: "en-US" })).toBe("$1.00");
	});
});
