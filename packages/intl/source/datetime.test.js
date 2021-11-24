import { describe } from "@payvo/sdk-test";

import { DateTime } from "./datetime";

let subject;

describe("DateTime", ({ assert, beforeEach, it, stub }) => {
	beforeEach(() => (subject = DateTime.make("2020-01-01")));

	it("should make", () => {
		const consoleSpy = stub(console, "debug");

		DateTime.make("2020-01-01 12:00:00", "invalid");

		consoleSpy.calledWith("Failed to load data for the [invalid] locale.");
	});

	it("should setLocale", () => {
		const subject = DateTime.fromUnix(1_596_534_984);

		assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");

		subject.setLocale("de");

		assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");
	});

	it("should fromUnix", () => {
		const subject = DateTime.fromUnix(1_596_534_984);

		assert.is(subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-08-04T09:56:24+00:00Z");
		assert.is(subject.format("DD/MM/YYYY"), "04/08/2020");
		assert.is(subject.format("L h:mm:ss A"), "08/04/2020 9:56:24 AM");
		assert.is(subject.format("L HH:mm:ss"), "08/04/2020 09:56:24");
		assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");
	});

	it("should isBefore", () => {
		assert.true(subject.isBefore(DateTime.make("2020-01-01").addDay()));
		assert.false(subject.isBefore(DateTime.make("2020-01-01").subDay()));
	});

	it("should isSame", () => {
		assert.true(subject.isSame(subject));
		assert.false(subject.isSame(DateTime.make("2020-01-01").addDay()));
	});

	it("should isAfter", () => {
		assert.true(subject.isAfter(DateTime.make("2020-01-01").subDay()));
		assert.false(subject.isAfter(DateTime.make("2020-01-01").addDay()));
	});

	it("should getMillisecond", () => {
		assert.is(subject.getMillisecond(), 0);
	});

	it("should getSecond", () => {
		assert.is(subject.getSecond(), 0);
	});

	it("should getMinute", () => {
		assert.is(subject.getMinute(), 0);
	});

	it("should getHour", () => {
		assert.is(subject.getHour(), 0);
	});

	it("should getDayOfMonth", () => {
		assert.is(subject.getDayOfMonth(), 1);
	});

	it("should getDay", () => {
		assert.is(subject.getDay(), 1);
	});

	it("should getWeek", () => {
		assert.is(subject.getWeek(), 1);
	});

	it("should getMonth", () => {
		assert.is(subject.getMonth(), 0);
	});

	it("should getQuarter", () => {
		assert.is(subject.getQuarter(), 1);
	});

	it("should getYear", () => {
		assert.is(subject.getYear(), 2020);
	});

	it("should setMillisecond", () => {
		assert.is(subject.setMillisecond(500).getMillisecond(), 500);
	});

	it("should setSecond", () => {
		assert.is(subject.setSecond(30).getSecond(), 30);
	});

	it("should setMinute", () => {
		assert.is(subject.setMinute(30).getMinute(), 30);
	});

	it("should setHour", () => {
		assert.is(subject.setHour(12).getHour(), 12);
	});

	it("should setDayOfMonth", () => {
		assert.is(subject.setDayOfMonth(15).getDayOfMonth(), 15);
	});

	it("should setDay", () => {
		assert.is(subject.setDay(123).getDay(), 123);
	});

	it("should setWeek", () => {
		assert.is(subject.setWeek(26).getWeek(), 26);
	});

	it("should setMonth", () => {
		assert.is(subject.setMonth(3).getMonth(), 3);
	});

	it("should setQuarter", () => {
		assert.is(subject.setQuarter(2).getQuarter(), 2);
	});

	it("should setYear", () => {
		assert.is(subject.setYear(123).getYear(), 123);
	});

	it("should addMillisecond", () => {
		assert.is.not(subject.addMillisecond().toISOString(), subject.toISOString());
	});

	it("should addMilliseconds", () => {
		assert.is.not(subject.addMilliseconds(5).toISOString(), subject.toISOString());
	});

	it("should addSecond", () => {
		assert.is.not(subject.addSecond().toString(), subject.toString());
	});

	it("should addSeconds", () => {
		assert.is.not(subject.addSeconds(5).toString(), subject.toString());
	});

	it("should addMinute", () => {
		assert.is.not(subject.addMinute().toString(), subject.toString());
	});

	it("should addMinutes", () => {
		assert.is.not(subject.addMinutes(5).toString(), subject.toString());
	});

	it("should addHour", () => {
		assert.is.not(subject.addHour().toString(), subject.toString());
	});

	it("should addHours", () => {
		assert.is.not(subject.addHours(5).toString(), subject.toString());
	});

	it("should addDay", () => {
		assert.is.not(subject.addDay().toString(), subject.toString());
	});

	it("should addDays", () => {
		assert.is.not(subject.addDays(5).toString(), subject.toString());
	});

	it("should addWeek", () => {
		assert.is.not(subject.addWeek().toString(), subject.toString());
	});

	it("should addWeeks", () => {
		assert.is.not(subject.addWeeks(5).toString(), subject.toString());
	});

	it("should addMonth", () => {
		assert.is.not(subject.addMonth().toString(), subject.toString());
	});

	it("should addMonths", () => {
		assert.is.not(subject.addMonths(5).toString(), subject.toString());
	});

	it("should addYear", () => {
		assert.is.not(subject.addYear().toString(), subject.toString());
	});

	it("should addYears", () => {
		assert.is.not(subject.addYears(5).toString(), subject.toString());
	});

	it("should subMillisecond", () => {
		assert.is.not(subject.subMillisecond().toString(), subject.toString());
	});

	it("should subMilliseconds", () => {
		assert.is.not(subject.subMilliseconds(5).toString(), subject.toString());
	});

	it("should subSecond", () => {
		assert.is.not(subject.subSecond().toString(), subject.toString());
	});

	it("should subSeconds", () => {
		assert.is.not(subject.subSeconds(5).toString(), subject.toString());
	});

	it("should subMinute", () => {
		assert.is.not(subject.subMinute().toString(), subject.toString());
	});

	it("should subMinutes", () => {
		assert.is.not(subject.subMinutes(5).toString(), subject.toString());
	});

	it("should subHour", () => {
		assert.is.not(subject.subHour().toString(), subject.toString());
	});

	it("should subHours", () => {
		assert.is.not(subject.subHours(5).toString(), subject.toString());
	});

	it("should subDay", () => {
		assert.is.not(subject.subDay().toString(), subject.toString());
	});

	it("should subDays", () => {
		assert.is.not(subject.subDays(5).toString(), subject.toString());
	});

	it("should subWeek", () => {
		assert.is.not(subject.subWeek().toString(), subject.toString());
	});

	it("should subWeeks", () => {
		assert.is.not(subject.subWeeks(5).toString(), subject.toString());
	});

	it("should subMonth", () => {
		assert.is.not(subject.subMonth().toString(), subject.toString());
	});

	it("should subMonths", () => {
		assert.is.not(subject.subMonths(5).toString(), subject.toString());
	});

	it("should subQuarter", () => {
		assert.is.not(subject.subQuarter().toString(), subject.toString());
	});

	it("should subQuarters", () => {
		assert.is.not(subject.subQuarters(5).toString(), subject.toString());
	});

	it("should subYear", () => {
		assert.is.not(subject.subYear().toString(), subject.toString());
	});

	it("should subYears", () => {
		assert.is.not(subject.subYears(5).toString(), subject.toString());
	});

	it("should diffInMilliseconds", () => {
		assert.is(subject.diffInMilliseconds(subject.addMillisecond()), -1);
	});

	it("should diffInSeconds", () => {
		assert.is(subject.diffInSeconds(subject.addSecond()), -1);
	});

	it("should diffInMinutes", () => {
		assert.is(subject.diffInMinutes(subject.addMinute()), -1);
	});

	it("should diffInHours", () => {
		assert.is(subject.diffInHours(subject.addHour()), -1);
	});

	it("should diffInDays", () => {
		assert.is(subject.diffInDays(subject.addDay()), -1);
	});

	it("should diffInWeeks", () => {
		assert.is(subject.diffInWeeks(subject.addWeek()), -1);
	});

	it("should diffInMonths", () => {
		assert.is(subject.diffInMonths(subject.addMonth()), -1);
	});

	it("should diffInQuarters", () => {
		assert.is(subject.diffInQuarters(subject.addQuarter()), -1);
	});

	it("should diffInYears", () => {
		assert.is(subject.diffInYears(subject.addYear()), -1);
	});

	it("should format", () => {
		assert.is(subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-01-01T00:00:00+00:00Z");
		assert.is(subject.format("DD/MM/YYYY"), "01/01/2020");
		assert.is(subject.format("L h:mm:ss A"), "01/01/2020 12:00:00 AM");
		assert.is(subject.format("L HH:mm:ss"), "01/01/2020 00:00:00");
		assert.is(subject.format("L LTS"), "01/01/2020 12:00:00 AM");
	});

	it("should toObject", () => {
		assert.equal(subject.toObject(), {
			date: 1,
			hours: 0,
			milliseconds: 0,
			minutes: 0,
			months: 0,
			seconds: 0,
			years: 2020,
		});
	});

	it("should toJSON", () => {
		assert.is(subject.toJSON(), "2020-01-01T00:00:00.000Z");
	});

	it("should toISOString", () => {
		assert.is(subject.toISOString(), "2020-01-01T00:00:00.000Z");
	});

	it("should toString", () => {
		assert.is(subject.toString(), "Wed, 01 Jan 2020 00:00:00 GMT");
	});

	it("should toUNIX", () => {
		assert.is(subject.toUNIX(), 1_577_836_800);
	});

	it("should valueOf", () => {
		assert.is(subject.valueOf(), 1_577_836_800_000);
	});

	it("should toDate", () => {
		assert.instance(subject.toDate(), Date);
	});

	it("should startOf", () => {
		assert.is(subject.startOf("year").toISOString(), "2020-01-01T00:00:00.000Z");
	});

	it("should from", () => {
		assert.is(subject.from("2019"), "in a year");
		assert.is(subject.from("2019", true), "a year");

		assert.is(subject.from("2018"), "in 2 years");
		assert.is(subject.from("2018", true), "2 years");

		assert.is(subject.from("2021"), "a year ago");
		assert.is(subject.from("2021", true), "a year");

		assert.is(subject.from("2022"), "2 years ago");
		assert.is(subject.from("2022", true), "2 years");
	});

	it("should fromNow", () => {
		const now = DateTime.make().toString();
		const fromNow = subject.from(now).toString();

		assert.is(subject.fromNow(), fromNow);
	});

	it("should isValid", () => {
		assert.true(subject.isValid());

		const invalidDate = DateTime.make("abc");

		assert.false(invalidDate.isValid());
	});
});
