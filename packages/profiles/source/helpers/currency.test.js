import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import { Currency } from "./currency";

test("should format fiat", () => {
	assert.is(Currency.format(10, "USD"), "$10.00");
});

test("should format crypto", () => {
	assert.is(Currency.format(1, "DARK"), "1 DARK");
	assert.is(Currency.format(1, "BTC"), "1 BTC");
});

test("should support passing the locale", () => {
	assert.is(Currency.format(1, "BTC", { locale: "en-US" }), "1 BTC");
});

test.run();
