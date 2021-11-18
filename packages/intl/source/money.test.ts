import { Money } from "./money.js";

let subject: Money;

beforeEach(() => (subject = Money.make(5000, "EUR")));

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
	assert.is(subject.isEqualTo(Money.make(5000, "EUR")), true);
	assert.is(subject.isEqualTo(Money.make(1000, "EUR")), false);
});

test("#isLessThan", () => {
	assert.is(subject.isLessThan(Money.make(6000, "EUR")), true);
	assert.is(subject.isLessThan(Money.make(5000, "EUR")), false);
	assert.is(subject.isLessThan(Money.make(4000, "EUR")), false);
});

test("#isLessThanOrEqual", () => {
	assert.is(subject.isLessThanOrEqual(Money.make(5000, "EUR")), true);
	assert.is(subject.isLessThanOrEqual(Money.make(6000, "EUR")), true);
	assert.is(subject.isLessThanOrEqual(Money.make(4000, "EUR")), false);
});

test("#isGreaterThan", () => {
	assert.is(subject.isGreaterThan(Money.make(1000, "EUR")), true);
	assert.is(subject.isGreaterThan(Money.make(1000, "EUR")), true);
	assert.is(subject.isGreaterThan(Money.make(6000, "EUR")), false);
});

test("#isGreaterThanOrEqual", () => {
	assert.is(subject.isGreaterThanOrEqual(Money.make(1000, "EUR")), true);
	assert.is(subject.isGreaterThanOrEqual(Money.make(1000, "EUR")), true);
	assert.is(subject.isGreaterThanOrEqual(Money.make(6000, "EUR")), false);
});

test("#isPositive", () => {
	assert.is(Money.make(1, "EUR").isPositive(), true);
	assert.is(Money.make(-1, "EUR").isPositive(), false);
});

test("#isNegative", () => {
	assert.is(Money.make(-1, "EUR").isNegative(), true);
	assert.is(Money.make(1, "EUR").isNegative(), false);
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
