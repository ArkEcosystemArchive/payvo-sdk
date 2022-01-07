import { describe } from "@payvo/sdk-test";

import { Numeral } from "./numeral.js";

describe("Numeral", ({ assert, it, nock, loader }) => {
	it("should format", () => {
		assert.is(Numeral.make("en").format(5000), "5,000");
	});

	it("should format the number as a currency", () => {
		assert.is(Numeral.make("en").formatAsCurrency(5000, "EUR"), "€5,000.00");
	});

	it("should format the number as a unit", () => {
		assert.is(Numeral.make("en").formatAsUnit(5000, "kilobyte"), "5,000 kB");
	});
});
