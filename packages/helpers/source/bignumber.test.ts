import { BigNumber } from "./bignumber.js";

let subject: BigNumber;
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
    assert.is(BigNumber.make(NaN).isNaN(), true);
    assert.is(subject.isNaN(), false);
});

test("#isPositive", () => {
    assert.is(subject.isPositive(), true);
    assert.is(subject.minus(10).isPositive(), false);
});

test("#isNegative", () => {
    assert.is(subject.isNegative(), false);
    assert.is(subject.minus(10).isNegative(), true);
});

test("#isFinite", () => {
    assert.is(subject.isFinite(), true);
    assert.is(BigNumber.make(Infinity).isFinite(), false);
});

test("#isZero", () => {
    assert.is(subject.isZero(), false);
    assert.is(BigNumber.make(0).isZero(), true);
});

test("#comparedTo", () => {
    assert.is(subject.comparedTo(BigNumber.make(1)), 0);
    assert.is(subject.comparedTo(BigNumber.make(0)), 1);
    assert.is(subject.comparedTo(BigNumber.make(-1)), 1);
    assert.is(subject.comparedTo(BigNumber.make(2)), -1);
});

test("#isEqualTo", () => {
    assert.is(subject.isEqualTo(BigNumber.make(1)), true);
    assert.is(subject.isEqualTo(BigNumber.make(2)), false);
});

test("#isGreaterThan", () => {
    assert.is(subject.isGreaterThan(BigNumber.make(0)), true);
    assert.is(subject.isGreaterThan(BigNumber.make(2)), false);
});

test("#isGreaterThanOrEqualTo", () => {
    assert.is(subject.isGreaterThanOrEqualTo(BigNumber.make(0)), true);
    assert.is(subject.isGreaterThanOrEqualTo(BigNumber.make(1)), true);
    assert.is(subject.isGreaterThanOrEqualTo(BigNumber.make(0)), true);
    assert.is(subject.isGreaterThanOrEqualTo(BigNumber.make(3)), false);
});

test("#isLessThan", () => {
    assert.is(subject.isLessThan(BigNumber.make(2)), true);
    assert.is(subject.isLessThan(BigNumber.make(1)), false);
});

test("#isLessThanOrEqualTo", () => {
    assert.is(subject.isLessThanOrEqualTo(BigNumber.make(1)), true);
    assert.is(subject.isLessThanOrEqualTo(BigNumber.make(1)), true);
    assert.is(subject.isLessThanOrEqualTo(BigNumber.make(2)), true);
    assert.is(subject.isLessThanOrEqualTo(BigNumber.make(0)), false);
});

test("#denominated", () => {
    assert.is(BigNumber.make(100).denominated().isEqualTo(BigNumber.make(100)), true);
    assert.is(
        BigNumber.make(100 * 1e8, 8)
            .denominated()
            .isEqualTo(BigNumber.make(100)),
    , true);
    assert.is(
        BigNumber.make(100 * 1e8)
            .denominated(8)
            .isEqualTo(BigNumber.make(100)),
    , true);
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
