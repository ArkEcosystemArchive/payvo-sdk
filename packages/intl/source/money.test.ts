import { describe } from "@payvo/sdk-test";

import { Money } from "./money.js";

describe("Money", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach((context) => (context.subject = Money.make(5000, "EUR")));

	it("should get the amount", (context) => {
		assert.is(context.subject.getAmount(context), 5000);
	});

	it("should set the locale", (context) => {
		assert.is(context.subject.setLocale("de-DE").format(), "€50.00");
	});

	it("should plus", (context) => {
		assert.is(context.subject.plus(Money.make(1000, "EUR")).getAmount(), 6000);
	});

	it("should minus", (context) => {
		assert.is(context.subject.minus(Money.make(1000, "EUR")).getAmount(), 4000);
	});

	it("should times", (context) => {
		assert.is(context.subject.times(10).getAmount(), 50_000);
	});

	it("should divide", (context) => {
		assert.is(context.subject.divide(10).getAmount(), 500);
	});

	it("should determine if the value is equal to another value", (context) => {
		assert.true(context.subject.isEqualTo(Money.make(5000, "EUR")));
		assert.false(context.subject.isEqualTo(Money.make(1000, "EUR")));
	});

	it("should determine if the value is less than another value", (context) => {
		assert.true(context.subject.isLessThan(Money.make(6000, "EUR")));
		assert.false(context.subject.isLessThan(Money.make(5000, "EUR")));
		assert.false(context.subject.isLessThan(Money.make(4000, "EUR")));
	});

	it("should determine if the value is less than or equal another value", (context) => {
		assert.true(context.subject.isLessThanOrEqual(Money.make(5000, "EUR")));
		assert.true(context.subject.isLessThanOrEqual(Money.make(6000, "EUR")));
		assert.false(context.subject.isLessThanOrEqual(Money.make(4000, "EUR")));
	});

	it("should determine if the value is greater than another value", (context) => {
		assert.true(context.subject.isGreaterThan(Money.make(1000, "EUR")));
		assert.true(context.subject.isGreaterThan(Money.make(1000, "EUR")));
		assert.false(context.subject.isGreaterThan(Money.make(6000, "EUR")));
	});

	it("should determine if the value is greater than or equal another value", (context) => {
		assert.true(context.subject.isGreaterThanOrEqual(Money.make(1000, "EUR")));
		assert.true(context.subject.isGreaterThanOrEqual(Money.make(1000, "EUR")));
		assert.false(context.subject.isGreaterThanOrEqual(Money.make(6000, "EUR")));
	});

	it("should determine if the value is positive", () => {
		assert.true(Money.make(1, "EUR").isPositive());
		assert.false(Money.make(-1, "EUR").isPositive());
	});

	it("should determine if the value is negative", () => {
		assert.true(Money.make(-1, "EUR").isNegative());
		assert.false(Money.make(1, "EUR").isNegative());
	});

	it("should get the currency", (context) => {
		assert.is(context.subject.getCurrency(), "EUR");
	});

	it("should format it into a standardised string", (context) => {
		assert.is(context.subject.format(), "€50.00");
	});

	it("should convert it to the unit (cents to euro)", (context) => {
		assert.is(context.subject.toUnit(), 50);
	});
});
