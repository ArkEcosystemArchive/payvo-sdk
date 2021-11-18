import { assert, test } from "@payvo/sdk-test";

import { BigNumber } from "./bignumber";

let subject;
test.before.each(() => (subject = BigNumber.make(1)));

test("#decimalPlaces", () => {
	assert.is(BigNumber.make("12.3456789").decimalPlaces(0).valueOf(), "12");
	assert.is(BigNumber.make("12.3456789").decimalPlaces(2).valueOf(), "12.35");
	assert.is(BigNumber.make("12.3456789").decimalPlaces(4).valueOf(), "12.3457");
	assert.is(BigNumber.make("12.3456789").decimalPlaces(6).valueOf(), "12.345679");
});

test("#plus", () => {
	assert.is(BigNumber.make(10).plus(1).valueOf(), "11");
});

test("#minus", () => {
	assert.is(BigNumber.make(10).minus(1).valueOf(), "9");
});

test("#divide", () => {
	assert.is(BigNumber.make(10).divide(2).valueOf(), "5");
});

test("#times", () => {
	assert.is(BigNumber.make(10).times(2).valueOf(), "20");
});

test("#sum", () => {
	assert.is(BigNumber.sum([BigNumber.ONE, 1, "2", 3.0, 5]).valueOf(), "12");
});

test("#powerOfTen", () => {
	assert.is(BigNumber.powerOfTen(0).valueOf(), "1");
	assert.is(BigNumber.powerOfTen(1).valueOf(), "10");
	assert.is(BigNumber.powerOfTen(2).valueOf(), "100");
	assert.is(BigNumber.powerOfTen("2").valueOf(), "100");
});

test("#isNaN", () => {
	assert.true(BigNumber.make(NaN).isNaN());
	assert.false(subject.isNaN());
});

test("#isPositive", () => {
	assert.true(subject.isPositive());
	assert.false(subject.minus(10).isPositive());
});

test("#isNegative", () => {
	assert.false(subject.isNegative());
	assert.true(subject.minus(10).isNegative());
});

test("#isFinite", () => {
	assert.true(subject.isFinite());
	assert.false(BigNumber.make(Infinity).isFinite());
});

test("#isZero", () => {
	assert.false(subject.isZero());
	assert.true(BigNumber.make(0).isZero());
});

test("#comparedTo", () => {
	assert.is(subject.comparedTo(BigNumber.make(1)), 0);
	assert.is(subject.comparedTo(BigNumber.make(0)), 1);
	assert.is(subject.comparedTo(BigNumber.make(-1)), 1);
	assert.is(subject.comparedTo(BigNumber.make(2)), -1);
});

test("#isEqualTo", () => {
	assert.true(subject.isEqualTo(BigNumber.make(1)));
	assert.false(subject.isEqualTo(BigNumber.make(2)));
});

test("#isGreaterThan", () => {
	assert.true(subject.isGreaterThan(BigNumber.make(0)));
	assert.false(subject.isGreaterThan(BigNumber.make(2)));
});

test("#isGreaterThanOrEqualTo", () => {
	assert.true(subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
	assert.true(subject.isGreaterThanOrEqualTo(BigNumber.make(1)));
	assert.true(subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
	assert.false(subject.isGreaterThanOrEqualTo(BigNumber.make(3)));
});

test("#isLessThan", () => {
	assert.true(subject.isLessThan(BigNumber.make(2)));
	assert.false(subject.isLessThan(BigNumber.make(1)));
});

test("#isLessThanOrEqualTo", () => {
	assert.true(subject.isLessThanOrEqualTo(BigNumber.make(1)));
	assert.true(subject.isLessThanOrEqualTo(BigNumber.make(1)));
	assert.true(subject.isLessThanOrEqualTo(BigNumber.make(2)));
	assert.false(subject.isLessThanOrEqualTo(BigNumber.make(0)));
});

test("#denominated", () => {
	assert.true(BigNumber.make(100).denominated().isEqualTo(BigNumber.make(100)));
	assert.true(
		BigNumber.make(100 * 1e8, 8)
			.denominated()
			.isEqualTo(BigNumber.make(100)),
	);
	assert.true(
		BigNumber.make(100 * 1e8)
			.denominated(8)
			.isEqualTo(BigNumber.make(100)),
	);
});

test("#toSatoshi", () => {
	assert.is(BigNumber.make(100).toSatoshi().toString(), "100");
	assert.is(BigNumber.make(100).toSatoshi(10).toString(), "1000000000000");
});

test("#toHuman", () => {
	assert.is(BigNumber.make(100 * 1e8, 8).toHuman(), 100);
	assert.is(BigNumber.make(123.456 * 1e8, 8).toHuman(), 123.456);
	assert.is(BigNumber.make(123.456789 * 1e8, 8).toHuman(), 123.456789);
	assert.is(BigNumber.make(1e8).times(1e8).toHuman(8), +`${1e8}`);
	assert.is(BigNumber.make(123456).toHuman(), 123456);
	assert.is(BigNumber.make(123456).toHuman(0), 123456);
	assert.is(BigNumber.make(123456).toHuman(1), 12345.6);
	assert.is(BigNumber.make(123456).toHuman(6), 0.123456);
});

test("#toFixed", () => {
	assert.is(subject.toFixed(), "1");
	assert.is(subject.toFixed(2), "1.00");
});

test("#toNumber", () => {
	assert.is(subject.toNumber(), 1);
});

test("#toString", () => {
	assert.is(subject.toString(), "1");
});

test("#valueOf", () => {
	assert.is(subject.valueOf(), "1");
});

test.run();
