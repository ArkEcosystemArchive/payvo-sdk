import { describe } from "@payvo/sdk-test";

import { Money } from "./money";

let subject;

describe("Money", ({ assert, beforeEach, it }) => {
	beforeEach(() => (subject = Money.make(5000, "EUR")));

	it("should getAmount", () => {
		assert.is(subject.getAmount(), 5000);
	});

	it("should setLocale", () => {
		assert.is(subject.setLocale("de-DE").format(), "€50.00");
	});

	it("should plus", () => {
		assert.is(subject.plus(Money.make(1000, "EUR")).getAmount(), 6000);
	});

	it("should minus", () => {
		assert.is(subject.minus(Money.make(1000, "EUR")).getAmount(), 4000);
	});

	it("should times", () => {
		assert.is(subject.times(10).getAmount(), 50_000);
	});

	it("should divide", () => {
		assert.is(subject.divide(10).getAmount(), 500);
	});

	it("should isEqualTo", () => {
		assert.true(subject.isEqualTo(Money.make(5000, "EUR")));
		assert.false(subject.isEqualTo(Money.make(1000, "EUR")));
	});

	it("should isLessThan", () => {
		assert.true(subject.isLessThan(Money.make(6000, "EUR")));
		assert.false(subject.isLessThan(Money.make(5000, "EUR")));
		assert.false(subject.isLessThan(Money.make(4000, "EUR")));
	});

	it("should isLessThanOrEqual", () => {
		assert.true(subject.isLessThanOrEqual(Money.make(5000, "EUR")));
		assert.true(subject.isLessThanOrEqual(Money.make(6000, "EUR")));
		assert.false(subject.isLessThanOrEqual(Money.make(4000, "EUR")));
	});

	it("should isGreaterThan", () => {
		assert.true(subject.isGreaterThan(Money.make(1000, "EUR")));
		assert.true(subject.isGreaterThan(Money.make(1000, "EUR")));
		assert.false(subject.isGreaterThan(Money.make(6000, "EUR")));
	});

	it("should isGreaterThanOrEqual", () => {
		assert.true(subject.isGreaterThanOrEqual(Money.make(1000, "EUR")));
		assert.true(subject.isGreaterThanOrEqual(Money.make(1000, "EUR")));
		assert.false(subject.isGreaterThanOrEqual(Money.make(6000, "EUR")));
	});

	it("should isPositive", () => {
		assert.true(Money.make(1, "EUR").isPositive());
		assert.false(Money.make(-1, "EUR").isPositive());
	});

	it("should isNegative", () => {
		assert.true(Money.make(-1, "EUR").isNegative());
		assert.false(Money.make(1, "EUR").isNegative());
	});

	it("should getCurrency", () => {
		assert.is(subject.getCurrency(), "EUR");
	});

	it("should format", () => {
		assert.is(subject.format(), "€50.00");
	});

	it("should toUnit", () => {
		assert.is(subject.toUnit(), 50);
	});
});
