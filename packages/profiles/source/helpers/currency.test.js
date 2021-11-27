import { describe } from "@payvo/sdk-test";

import { Currency } from "./currency";

describe("Currency", ({ assert, it, nock, loader }) => {
	it("should format fiat", () => {
		assert.is(Currency.format(10, "USD"), "$10.00");
	});

	it("should format crypto", () => {
		assert.is(Currency.format(1, "DARK"), "1 DARK");
		assert.is(Currency.format(1, "BTC"), "1 BTC");
	});

	it("should support passing the locale", () => {
		assert.is(Currency.format(1, "BTC", { locale: "en-US" }), "1 BTC");
	});
});
