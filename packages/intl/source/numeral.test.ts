import { Numeral } from "./numeral.js";

test("#format", () => {
	assert.is(Numeral.make("en").format(5000), "5,000");
});

test("#formatAsCurrency", () => {
	assert.is(Numeral.make("en").formatAsCurrency(5000, "EUR"), "€5,000.00");
});

test("#formatAsUnit", () => {
	assert.is(Numeral.make("en").formatAsUnit(5000, "kilobyte"), "5,000 kB");
});
