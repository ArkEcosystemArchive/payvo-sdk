import { describe } from "@payvo/sdk-test";

import { BigNumber } from "./bignumber";

describe("BigNumber", async ({ assert, beforeEach, it }) => {
	beforeEach((context) => (context.subject = BigNumber.make(1)));

	it("#toString should succeed when input is provided as string", () => {
		assert.is(BigNumber.make("0").toString(), "0");
		assert.is(BigNumber.make("1").toString(), "1");
		assert.is(BigNumber.make("1.5").toString(), "1.5");
		assert.is(BigNumber.make("1.500000000001").toString(), "1.500000000001");
	});

	it("#toString should succeed when input is provided as number", () => {
		assert.is(BigNumber.make(0).toString(), "0");
		assert.is(BigNumber.make(1).toString(), "1");
		assert.is(BigNumber.make(1.5).toString(), "1.5");
		assert.is(BigNumber.make(1.500_000_000_001).toString(), "1.500000000001");
	});

	it("#toString should succeed when input is provided as bigint", () => {
		assert.is(BigNumber.make(BigInt(0)).toString(), "0");
		assert.is(BigNumber.make(BigInt(1)).toString(), "1");
		assert.is(BigNumber.make(BigInt(10)).toString(), "10");
		assert.is(BigNumber.make(BigInt(1_234_567_890)).toString(), "1234567890");
	});

	it("#toString should succeed when input is provided as BigNumber", () => {
		assert.is(BigNumber.make(BigNumber.ONE).toString(), "1");
		assert.is(BigNumber.make(BigNumber.make(1.5)).toString(), "1.5");
		assert.is(BigNumber.make(BigNumber.make(1.500_000_000_001)).toString(), "1.500000000001");
		assert.is(BigNumber.make(BigNumber.make("1.5")).toString(), "1.5");
		assert.is(BigNumber.make(BigNumber.make("1.500000000001")).toString(), "1.500000000001");
	});

	it("#toString should not return a value having more than the specified decimals", () => {
		assert.is(BigNumber.make("1", 8).toString(), "1");
		assert.is(BigNumber.make(1, 8).toString(), "1");

		assert.is(BigNumber.make("1.5", 8).toString(), "1.5");
		assert.is(BigNumber.make("1.500000000000", 8).toString(), "1.5");
		assert.is(BigNumber.make(1.5, 8).toString(), "1.5");

		assert.is(BigNumber.make("1.500000005555", 8).toString(), "1.5");
		assert.is(BigNumber.make(1.500_000_005_555, 8).toString(), "1.5");

		assert.is(BigNumber.make("1.500000015555", 8).toString(), "1.50000001");
		assert.is(BigNumber.make(1.500_000_015_555, 8).toString(), "1.50000001");
	});

	it("#decimalPlaces should succeed", () => {
		assert.is(BigNumber.make("12.3456789").decimalPlaces(0).valueOf(), "12");
		assert.is(BigNumber.make("12.3456789").decimalPlaces(2).valueOf(), "12.34");
		assert.is(BigNumber.make("12.3456789").decimalPlaces(4).valueOf(), "12.3456");
		assert.is(BigNumber.make("12.3456789").decimalPlaces(6).valueOf(), "12.345678");
	});

	it("#plus", () => {
		assert.is(BigNumber.make(10).plus(1).valueOf(), "11");
	});

	it("#minus", () => {
		assert.is(BigNumber.make(10).minus(1).valueOf(), "9");
	});

	it("#divide", () => {
		assert.is(BigNumber.make(10).divide(2).valueOf(), "5");
		assert.is(BigNumber.make(5).divide(2).valueOf(), "2.5");
		assert.is(BigNumber.make(2.5).divide(3).valueOf(), "0.833333333333333333333333333333");
	});

	it("#times", () => {
		assert.is(BigNumber.make(10).times(2).valueOf(), "20");
		assert.is(BigNumber.make(2.5).times(2).valueOf(), "5");
		assert.is(BigNumber.make(0.83).times(3).valueOf(), "2.49");
	});

	it("#sum", () => {
		assert.is(BigNumber.sum([BigNumber.ONE, 1, "2", 3, 5]).valueOf(), "12");
	});

	it("#powerOfTen", () => {
		assert.is(BigNumber.powerOfTen(0).valueOf(), "1");
		assert.is(BigNumber.powerOfTen(1).valueOf(), "10");
		assert.is(BigNumber.powerOfTen(2).valueOf(), "100");
		assert.is(BigNumber.powerOfTen("2").valueOf(), "100");
	});

	it("#isPositive", (context) => {
		assert.true(context.subject.isPositive());
		assert.false(context.subject.minus(10).isPositive());
	});

	it("#isNegative", (context) => {
		assert.false(context.subject.isNegative());
		assert.true(context.subject.minus(10).isNegative());
	});

	it("#isZero", (context) => {
		assert.false(context.subject.isZero());
		assert.true(BigNumber.make(0).isZero());
	});

	it.skip("#comparedTo", (context) => { // @TODO unskip and fix
		assert.is(context.subject.comparedTo(BigNumber.make(1)), 0);
		assert.is(context.subject.comparedTo(BigNumber.make(0)), 1);
		assert.is(context.subject.comparedTo(BigNumber.make(-1)), 1);
		assert.is(context.subject.comparedTo(BigNumber.make(2)), -1);
	});

	it("#isEqualTo", (context) => {
		assert.true(context.subject.isEqualTo(BigNumber.make(1)));
		assert.false(context.subject.isEqualTo(BigNumber.make(2)));
	});

	it("#isGreaterThan", (context) => {
		assert.true(context.subject.isGreaterThan(BigNumber.make(0)));
		assert.false(context.subject.isGreaterThan(BigNumber.make(2)));
	});

	it("#isGreaterThanOrEqualTo", (context) => {
		assert.true(context.subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
		assert.true(context.subject.isGreaterThanOrEqualTo(BigNumber.make(1)));
		assert.true(context.subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
		assert.false(context.subject.isGreaterThanOrEqualTo(BigNumber.make(3)));
	});

	it("#isLessThan", (context) => {
		assert.true(context.subject.isLessThan(BigNumber.make(2)));
		assert.false(context.subject.isLessThan(BigNumber.make(1)));
	});

	it("#isLessThanOrEqualTo", (context) => {
		assert.true(context.subject.isLessThanOrEqualTo(BigNumber.make(1)));
		assert.true(context.subject.isLessThanOrEqualTo(BigNumber.make(1)));
		assert.true(context.subject.isLessThanOrEqualTo(BigNumber.make(2)));
		assert.false(context.subject.isLessThanOrEqualTo(BigNumber.make(0)));
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
		assert.is(BigNumber.make(123.456_789 * 1e8, 8).toHuman(), 123.456_789);
		assert.is(BigNumber.make(1e8).times(1e8).toHuman(8), +`${1e8}`);
		assert.is(BigNumber.make(123_456).toHuman(), 123_456);
		assert.is(BigNumber.make(123_456).toHuman(0), 123_456);
		assert.is(BigNumber.make(123_456).toHuman(1), 12_345.6);
		assert.is(BigNumber.make(123_456).toHuman(6), 0.123_456);
	});

	it.skip("#toFixed", (context) => { // @TODO unskip and fix
		assert.is(context.subject.toFixed(0), "1");
		assert.is(context.subject.toFixed(2), "1.00");
	});

	it("#toNumber", (context) => {
		assert.is(context.subject.toNumber(), 1);
	});

	it("#toString", (context) => {
		assert.is(context.subject.toString(), "1");
	});

	it("#valueOf", (context) => {
		assert.is(context.subject.valueOf(), "1");
	});
});
