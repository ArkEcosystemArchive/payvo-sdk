import { describe } from "@payvo/sdk-test";

import { BigNumber } from "./bignumber";

describe("BigNumber", async ({ assert, beforeEach, it }) => {
	// beforeEach((context) => (context.subject = BigNumber.make(1)));

	it.only("#decimalPlaces", () => {
		assert.is(BigNumber.make("12.3456789").decimalPlaces(0).toString(), "12");
		// assert.is(BigNumber.make("12.3456789").decimalPlaces(2).toString(), "12.35");
		// assert.is(BigNumber.make("12.3456789").decimalPlaces(4).toString(), "12.3457");
		// assert.is(BigNumber.make("12.3456789").decimalPlaces(6).toString(), "12.345679");
	});

	// it("#plus", () => {
	// 	assert.is(BigNumber.make(10).plus(1).valueOf(), "11");
	// });

	// it("#minus", () => {
	// 	assert.is(BigNumber.make(10).minus(1).valueOf(), "9");
	// });

	// it("#divide", () => {
	// 	assert.is(BigNumber.make(10).divide(2).valueOf(), "5");
	// });

	// it("#times", () => {
	// 	assert.is(BigNumber.make(10).times(2).valueOf(), "20");
	// });

	// it("#sum", () => {
	// 	assert.is(BigNumber.sum([BigNumber.ONE, 1, "2", 3.0, 5]).valueOf(), "12");
	// });

	// it("#powerOfTen", () => {
	// 	assert.is(BigNumber.powerOfTen(0).valueOf(), "1");
	// 	assert.is(BigNumber.powerOfTen(1).valueOf(), "10");
	// 	assert.is(BigNumber.powerOfTen(2).valueOf(), "100");
	// 	assert.is(BigNumber.powerOfTen("2").valueOf(), "100");
	// });

	// it("#isNaN", (context) => {
	// 	assert.true(BigNumber.make(NaN).isNaN());
	// 	assert.false(context.subject.isNaN());
	// });

	// it("#isPositive", (context) => {
	// 	assert.true(context.subject.isPositive());
	// 	assert.false(context.subject.minus(10).isPositive());
	// });

	// it("#isNegative", (context) => {
	// 	assert.false(context.subject.isNegative());
	// 	assert.true(context.subject.minus(10).isNegative());
	// });

	// it("#isFinite", (context) => {
	// 	assert.true(context.subject.isFinite());
	// 	assert.false(BigNumber.make(Infinity).isFinite());
	// });

	// it("#isZero", (context) => {
	// 	assert.false(context.subject.isZero());
	// 	assert.true(BigNumber.make(0).isZero());
	// });

	// it("#comparedTo", (context) => {
	// 	assert.is(context.subject.comparedTo(BigNumber.make(1)), 0);
	// 	assert.is(context.subject.comparedTo(BigNumber.make(0)), 1);
	// 	assert.is(context.subject.comparedTo(BigNumber.make(-1)), 1);
	// 	assert.is(context.subject.comparedTo(BigNumber.make(2)), -1);
	// });

	// it("#isEqualTo", (context) => {
	// 	assert.true(context.subject.isEqualTo(BigNumber.make(1)));
	// 	assert.false(context.subject.isEqualTo(BigNumber.make(2)));
	// });

	// it("#isGreaterThan", (context) => {
	// 	assert.true(context.subject.isGreaterThan(BigNumber.make(0)));
	// 	assert.false(context.subject.isGreaterThan(BigNumber.make(2)));
	// });

	// it("#isGreaterThanOrEqualTo", (context) => {
	// 	assert.true(context.subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
	// 	assert.true(context.subject.isGreaterThanOrEqualTo(BigNumber.make(1)));
	// 	assert.true(context.subject.isGreaterThanOrEqualTo(BigNumber.make(0)));
	// 	assert.false(context.subject.isGreaterThanOrEqualTo(BigNumber.make(3)));
	// });

	// it("#isLessThan", (context) => {
	// 	assert.true(context.subject.isLessThan(BigNumber.make(2)));
	// 	assert.false(context.subject.isLessThan(BigNumber.make(1)));
	// });

	// it("#isLessThanOrEqualTo", (context) => {
	// 	assert.true(context.subject.isLessThanOrEqualTo(BigNumber.make(1)));
	// 	assert.true(context.subject.isLessThanOrEqualTo(BigNumber.make(1)));
	// 	assert.true(context.subject.isLessThanOrEqualTo(BigNumber.make(2)));
	// 	assert.false(context.subject.isLessThanOrEqualTo(BigNumber.make(0)));
	// });

	// it("#denominated", () => {
	// 	assert.true(BigNumber.make(100).denominated().isEqualTo(BigNumber.make(100)));
	// 	assert.true(
	// 		BigNumber.make(100 * 1e8, 8)
	// 			.denominated()
	// 			.isEqualTo(BigNumber.make(100)),
	// 	);
	// 	assert.true(
	// 		BigNumber.make(100 * 1e8)
	// 			.denominated(8)
	// 			.isEqualTo(BigNumber.make(100)),
	// 	);
	// });

	// it("#toSatoshi", () => {
	// 	assert.is(BigNumber.make(100).toSatoshi().toString(), "100");
	// 	assert.is(BigNumber.make(100).toSatoshi(10).toString(), "1000000000000");
	// });

	// it("#toHuman", () => {
	// 	assert.is(BigNumber.make(100 * 1e8, 8).toHuman(), 100);
	// 	assert.is(BigNumber.make(123.456 * 1e8, 8).toHuman(), 123.456);
	// 	assert.is(BigNumber.make(123.456789 * 1e8, 8).toHuman(), 123.456789);
	// 	assert.is(BigNumber.make(1e8).times(1e8).toHuman(8), +`${1e8}`);
	// 	assert.is(BigNumber.make(123456).toHuman(), 123456);
	// 	assert.is(BigNumber.make(123456).toHuman(0), 123456);
	// 	assert.is(BigNumber.make(123456).toHuman(1), 12345.6);
	// 	assert.is(BigNumber.make(123456).toHuman(6), 0.123456);
	// });

	// it("#toFixed", (context) => {
	// 	assert.is(context.subject.toFixed(), "1");
	// 	assert.is(context.subject.toFixed(2), "1.00");
	// });

	// it("#toNumber", (context) => {
	// 	assert.is(context.subject.toNumber(), 1);
	// });

	// it("#toString", (context) => {
	// 	assert.is(context.subject.toString(), "1");
	// });

	// it("#valueOf", (context) => {
	// 	assert.is(context.subject.valueOf(), "1");
	// });
});
