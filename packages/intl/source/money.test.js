import { assert, test } from "@payvo/sdk-test";

import { Money } from "./money";

let subject;

test.before.each(() => (subject = Money.make(5000, "EUR")));

test("#getAmount", () => {
	assert.is(subject.getAmount(), 5000);
});

test("#setLocale", () => {
	assert.is(subject.setLocale("de-DE").format(), "€50.00");
});

test("#plus", () => {
	assert.is(subject.plus(Money.make(1000, "EUR")).getAmount(), 6000);
});

test("#minus", () => {
	assert.is(subject.minus(Money.make(1000, "EUR")).getAmount(), 4000);
});

test("#times", () => {
	assert.is(subject.times(10).getAmount(), 50_000);
});

test("#divide", () => {
	assert.is(subject.divide(10).getAmount(), 500);
});

test("#isEqualTo", () => {
	assert.true(subject.isEqualTo(Money.make(5000, "EUR")));
	assert.false(subject.isEqualTo(Money.make(1000, "EUR")));
});

test("#isLessThan", () => {
	assert.true(subject.isLessThan(Money.make(6000, "EUR")));
	assert.false(subject.isLessThan(Money.make(5000, "EUR")));
	assert.false(subject.isLessThan(Money.make(4000, "EUR")));
});

test("#isLessThanOrEqual", () => {
	assert.true(subject.isLessThanOrEqual(Money.make(5000, "EUR")));
	assert.true(subject.isLessThanOrEqual(Money.make(6000, "EUR")));
	assert.false(subject.isLessThanOrEqual(Money.make(4000, "EUR")));
});

test("#isGreaterThan", () => {
	assert.true(subject.isGreaterThan(Money.make(1000, "EUR")));
	assert.true(subject.isGreaterThan(Money.make(1000, "EUR")));
	assert.false(subject.isGreaterThan(Money.make(6000, "EUR")));
});

test("#isGreaterThanOrEqual", () => {
	assert.true(subject.isGreaterThanOrEqual(Money.make(1000, "EUR")));
	assert.true(subject.isGreaterThanOrEqual(Money.make(1000, "EUR")));
	assert.false(subject.isGreaterThanOrEqual(Money.make(6000, "EUR")));
});

test("#isPositive", () => {
	assert.true(Money.make(1, "EUR").isPositive());
	assert.false(Money.make(-1, "EUR").isPositive());
});

test("#isNegative", () => {
	assert.true(Money.make(-1, "EUR").isNegative());
	assert.false(Money.make(1, "EUR").isNegative());
});

test("#getCurrency", () => {
	assert.is(subject.getCurrency(), "EUR");
});

test("#format", () => {
	assert.is(subject.format(), "€50.00");
});

test("#toUnit", () => {
	assert.is(subject.toUnit(), 50);
});

test.run();
