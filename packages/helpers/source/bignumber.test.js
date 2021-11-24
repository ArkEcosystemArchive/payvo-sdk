import { describe } from "@payvo/sdk-test";

import { BigNumber } from "./bignumber";

let subject;

describe("BigNumber", async ({ assert, beforeEach, it }) => {
	beforeEach(() => (subject = BigNumber.make(1)));

	it("#decimalPlaces", () => {
		assert.is(BigNumber.make("12.3456789").decimalPlaces(0).valueOf(), "12");
		assert.is(BigNumber.make("12.3456789").decimalPlaces(2).valueOf(), "12.35");
		assert.is(BigNumber.make("12.3456789").decimalPlaces(4).valueOf(), "12.3457");
		assert.is(BigNumber.make("12.3456789").decimalPlaces(6).valueOf(), "12.345679");
	});

	it("#plus", () => {
		assert.is(BigNumber.make(10).plus(1).valueOf(), "11");
	});

	it("#minus", () => {
		assert.is(BigNumber.make(10).minus(1).valueOf(), "9");
	});

	it("#divide", () => {
		assert.is(BigNumber.make(10).divide(2).valueOf(), "5");
	});

	it("#times", () => {
		assert.is(BigNumber.make(10).times(2).valueOf(), "20");
	});

	it("#sum", () => {
		assert.is(BigNumber.sum([BigNumber.ONE, 1, "2", 3.0, 5]).valueOf(), "12");
	});

	it("#powerOfTen", () => {
		assert.is(BigNumber.powerOfTen(0).valueOf(), "1");
		assert.is(BigNumber.powerOfTen(1).valueOf(), "10");
		assert.is(BigNumber.powerOfTen(2).valueOf(), "100");
		assert.is(BigNumber.powerOfTen("2").valueOf(), "100");
	});

	it("#isNaN", () => {
		assert.true(BigNumber.make(NaN).isNaN());
		assert.false(subject.isNaN());
	});

	it("#isPositive", () => {
		assert.true(subject.isPositive());
		assert.false(subject.minus(10).isPositive());
	});

	it("#isNegative", () => {
		assert.false(subject.isNegative());
		assert.true(subject.minus(10).isNegative());
	});

	it("#isFinite", () => {
		assert.true(subject.isFinite());
		assert.false(BigNumber.make(Infinity).isFinite());
	});

	it("#isZero", () => {
		assert.false(subject.isZero());
		assert.true(BigNumber.make(0).isZero());
	});

	it("#comparedTo", () => {
		assert.is(subject.comparedTo(BigNumber.make(1)), 0);
		assert.is(subject.comparedTo(BigNumber.make(0)), 1);
		assert.is(subject.comparedTo(BigNumber.make(-1)), 1);
		assert.is(subject.comparedTo(BigNumber.make(2)), -1);
	});

	it("#isEqualTo", () => {
		assert.true(subject.isEqualTo(BigNumber.make(1)));
		assert.false(subject.isEqualTo(BigNumber.make(2)));
	});

	it("#isGreaterThan", () => {
		assert.true(subject.isGreaterThan(BigNumber.make(0)));
		assert.false(subject.isGreaterThan(BigNumber.make(2)));
	});

	it("#isGreaterThanOrEqualTo", () => {
		assert.true(subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
		assert.true(subject.isGreaterThanOrEqualTo(BigNumber.make(1)));
		assert.true(subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
		assert.false(subject.isGreaterThanOrEqualTo(BigNumber.make(3)));
	});

	it("#isLessThan", () => {
		assert.true(subject.isLessThan(BigNumber.make(2)));
		assert.false(subject.isLessThan(BigNumber.make(1)));
	});

	it("#isLessThanOrEqualTo", () => {
		assert.true(subject.isLessThanOrEqualTo(BigNumber.make(1)));
		assert.true(subject.isLessThanOrEqualTo(BigNumber.make(1)));
		assert.true(subject.isLessThanOrEqualTo(BigNumber.make(2)));
		assert.false(subject.isLessThanOrEqualTo(BigNumber.make(0)));
	});

	it("#denominated", () => {
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

	it("#toSatoshi", () => {
		assert.is(BigNumber.make(100).toSatoshi().toString(), "100");
		assert.is(BigNumber.make(100).toSatoshi(10).toString(), "1000000000000");
	});

	it("#toHuman", () => {
		assert.is(BigNumber.make(100 * 1e8, 8).toHuman(), 100);
		assert.is(BigNumber.make(123.456 * 1e8, 8).toHuman(), 123.456);
		assert.is(BigNumber.make(123.456789 * 1e8, 8).toHuman(), 123.456789);
		assert.is(BigNumber.make(1e8).times(1e8).toHuman(8), +`${1e8}`);
		assert.is(BigNumber.make(123456).toHuman(), 123456);
		assert.is(BigNumber.make(123456).toHuman(0), 123456);
		assert.is(BigNumber.make(123456).toHuman(1), 12345.6);
		assert.is(BigNumber.make(123456).toHuman(6), 0.123456);
	});

	it("#toFixed", () => {
		assert.is(subject.toFixed(), "1");
		assert.is(subject.toFixed(2), "1.00");
	});

	it("#toNumber", () => {
		assert.is(subject.toNumber(), 1);
	});

	it("#toString", () => {
		assert.is(subject.toString(), "1");
	});

	it("#valueOf", () => {
		assert.is(subject.valueOf(), "1");
	});
});
