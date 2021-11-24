import { describe } from "@payvo/sdk-test";

import { DateTime } from "./datetime";

let subject;

describe("DateTime", ({ assert, beforeEach, it, stub }) => {
	beforeEach(() => (subject = DateTime.make("2020-01-01")));

	it("should create an instance", () => {
		const consoleSpy = stub(console, "debug");

		DateTime.make("2020-01-01 12:00:00", "invalid");

		consoleSpy.calledWith("Failed to load data for the [invalid] locale.");
	});

	it("should create an instance from a UNIX timestamp", () => {
		const subject = DateTime.fromUnix(1_596_534_984);

		assert.is(subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-08-04T09:56:24+00:00Z");
		assert.is(subject.format("DD/MM/YYYY"), "04/08/2020");
		assert.is(subject.format("L h:mm:ss A"), "08/04/2020 9:56:24 AM");
		assert.is(subject.format("L HH:mm:ss"), "08/04/2020 09:56:24");
		assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");
	});

	it("should set the locale", () => {
		const subject = DateTime.fromUnix(1_596_534_984);

		assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");

		subject.setLocale("de");

		assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");
	});

	it("should determine if the date is before another date", () => {
		assert.true(subject.isBefore(DateTime.make("2020-01-01").addDay()));
		assert.false(subject.isBefore(DateTime.make("2020-01-01").subDay()));
	});

	it("should determine if two dates the same", () => {
		assert.true(subject.isSame(subject));
		assert.false(subject.isSame(DateTime.make("2020-01-01").addDay()));
	});

	it("should determine if the date is after another date", () => {
		assert.true(subject.isAfter(DateTime.make("2020-01-01").subDay()));
		assert.false(subject.isAfter(DateTime.make("2020-01-01").addDay()));
	});

	it("should get the millisecond", () => {
		assert.is(subject.getMillisecond(), 0);
	});

	it("should get the second", () => {
		assert.is(subject.getSecond(), 0);
	});

	it("should get the minute", () => {
		assert.is(subject.getMinute(), 0);
	});

	it("should get the hour", () => {
		assert.is(subject.getHour(), 0);
	});

	it("should get the dayofmonth", () => {
		assert.is(subject.getDayOfMonth(), 1);
	});

	it("should get the day", () => {
		assert.is(subject.getDay(), 1);
	});

	it("should get the week", () => {
		assert.is(subject.getWeek(), 1);
	});

	it("should get the month", () => {
		assert.is(subject.getMonth(), 0);
	});

	it("should get the quarter", () => {
		assert.is(subject.getQuarter(), 1);
	});

	it("should get the year", () => {
		assert.is(subject.getYear(), 2020);
	});

	it("should set the millisecond", () => {
		assert.is(subject.setMillisecond(500).getMillisecond(), 500);
	});

	it("should set the second", () => {
		assert.is(subject.setSecond(30).getSecond(), 30);
	});

	it("should set the minute", () => {
		assert.is(subject.setMinute(30).getMinute(), 30);
	});

	it("should set the hour", () => {
		assert.is(subject.setHour(12).getHour(), 12);
	});

	it("should set the dayofmonth", () => {
		assert.is(subject.setDayOfMonth(15).getDayOfMonth(), 15);
	});

	it("should set the day", () => {
		assert.is(subject.setDay(123).getDay(), 123);
	});

	it("should set the week", () => {
		assert.is(subject.setWeek(26).getWeek(), 26);
	});

	it("should set the month", () => {
		assert.is(subject.setMonth(3).getMonth(), 3);
	});

	it("should set the quarter", () => {
		assert.is(subject.setQuarter(2).getQuarter(), 2);
	});

	it("should set the year", () => {
		assert.is(subject.setYear(123).getYear(), 123);
	});

	it("should add millisecond", () => {
		assert.is.not(subject.addMillisecond().toISOString(), subject.toISOString());
	});

	it("should add milliseconds", () => {
		assert.is.not(subject.addMilliseconds(5).toISOString(), subject.toISOString());
	});

	it("should add second", () => {
		assert.is.not(subject.addSecond().toString(), subject.toString());
	});

	it("should add seconds", () => {
		assert.is.not(subject.addSeconds(5).toString(), subject.toString());
	});

	it("should add minute", () => {
		assert.is.not(subject.addMinute().toString(), subject.toString());
	});

	it("should add minutes", () => {
		assert.is.not(subject.addMinutes(5).toString(), subject.toString());
	});

	it("should add hour", () => {
		assert.is.not(subject.addHour().toString(), subject.toString());
	});

	it("should add hours", () => {
		assert.is.not(subject.addHours(5).toString(), subject.toString());
	});

	it("should add day", () => {
		assert.is.not(subject.addDay().toString(), subject.toString());
	});

	it("should add days", () => {
		assert.is.not(subject.addDays(5).toString(), subject.toString());
	});

	it("should add week", () => {
		assert.is.not(subject.addWeek().toString(), subject.toString());
	});

	it("should add weeks", () => {
		assert.is.not(subject.addWeeks(5).toString(), subject.toString());
	});

	it("should add month", () => {
		assert.is.not(subject.addMonth().toString(), subject.toString());
	});

	it("should add months", () => {
		assert.is.not(subject.addMonths(5).toString(), subject.toString());
	});

	it("should add year", () => {
		assert.is.not(subject.addYear().toString(), subject.toString());
	});

	it("should add years", () => {
		assert.is.not(subject.addYears(5).toString(), subject.toString());
	});

	it("should subtract millisecond", () => {
		assert.is.not(subject.subMillisecond().toString(), subject.toString());
	});

	it("should subtract milliseconds", () => {
		assert.is.not(subject.subMilliseconds(5).toString(), subject.toString());
	});

	it("should subtract second", () => {
		assert.is.not(subject.subSecond().toString(), subject.toString());
	});

	it("should subtract seconds", () => {
		assert.is.not(subject.subSeconds(5).toString(), subject.toString());
	});

	it("should subtract minute", () => {
		assert.is.not(subject.subMinute().toString(), subject.toString());
	});

	it("should subtract minutes", () => {
		assert.is.not(subject.subMinutes(5).toString(), subject.toString());
	});

	it("should subtract hour", () => {
		assert.is.not(subject.subHour().toString(), subject.toString());
	});

	it("should subtract hours", () => {
		assert.is.not(subject.subHours(5).toString(), subject.toString());
	});

	it("should subtract day", () => {
		assert.is.not(subject.subDay().toString(), subject.toString());
	});

	it("should subtract days", () => {
		assert.is.not(subject.subDays(5).toString(), subject.toString());
	});

	it("should subtract week", () => {
		assert.is.not(subject.subWeek().toString(), subject.toString());
	});

	it("should subtract weeks", () => {
		assert.is.not(subject.subWeeks(5).toString(), subject.toString());
	});

	it("should subtract month", () => {
		assert.is.not(subject.subMonth().toString(), subject.toString());
	});

	it("should subtract months", () => {
		assert.is.not(subject.subMonths(5).toString(), subject.toString());
	});

	it("should subtract quarter", () => {
		assert.is.not(subject.subQuarter().toString(), subject.toString());
	});

	it("should subtract quarters", () => {
		assert.is.not(subject.subQuarters(5).toString(), subject.toString());
	});

	it("should subtract year", () => {
		assert.is.not(subject.subYear().toString(), subject.toString());
	});

	it("should subtract years", () => {
		assert.is.not(subject.subYears(5).toString(), subject.toString());
	});

	it("should determine the difference in milliseconds", () => {
		assert.is(subject.diffInMilliseconds(subject.addMillisecond()), -1);
	});

	it("should determine the difference in seconds", () => {
		assert.is(subject.diffInSeconds(subject.addSecond()), -1);
	});

	it("should determine the difference in minutes", () => {
		assert.is(subject.diffInMinutes(subject.addMinute()), -1);
	});

	it("should determine the difference in hours", () => {
		assert.is(subject.diffInHours(subject.addHour()), -1);
	});

	it("should determine the difference in days", () => {
		assert.is(subject.diffInDays(subject.addDay()), -1);
	});

	it("should determine the difference in weeks", () => {
		assert.is(subject.diffInWeeks(subject.addWeek()), -1);
	});

	it("should determine the difference in months", () => {
		assert.is(subject.diffInMonths(subject.addMonth()), -1);
	});

	it("should determine the difference in quarters", () => {
		assert.is(subject.diffInQuarters(subject.addQuarter()), -1);
	});

	it("should determine the difference in years", () => {
		assert.is(subject.diffInYears(subject.addYear()), -1);
	});

	it("should format the date using the given rules", () => {
		assert.is(subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-01-01T00:00:00+00:00Z");
		assert.is(subject.format("DD/MM/YYYY"), "01/01/2020");
		assert.is(subject.format("L h:mm:ss A"), "01/01/2020 12:00:00 AM");
		assert.is(subject.format("L HH:mm:ss"), "01/01/2020 00:00:00");
		assert.is(subject.format("L LTS"), "01/01/2020 12:00:00 AM");
	});

	it("should transform the date into an object containing each segment", () => {
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

	it("should transform the date into a JSON string", () => {
		assert.is(subject.toJSON(), "2020-01-01T00:00:00.000Z");
	});

	it("should transform the date into a ISO string", () => {
		assert.is(subject.toISOString(), "2020-01-01T00:00:00.000Z");
	});

	it("should transform the date into a human-readable string", () => {
		assert.is(subject.toString(), "Wed, 01 Jan 2020 00:00:00 GMT");
	});

	it("should transform the date into a UNIX timestamp", () => {
		assert.is(subject.toUNIX(), 1_577_836_800);
	});

	it("should transform the date into a timestamp with milliseconds", () => {
		assert.is(subject.valueOf(), 1_577_836_800_000);
	});

	it("should transform the date into a native Date instance", () => {
		assert.instance(subject.toDate(), Date);
	});

	it("should return the start of the year", () => {
		assert.is(subject.startOf("year").toISOString(), "2020-01-01T00:00:00.000Z");
	});

	it("should determine a human-readable difference between years", () => {
		assert.is(subject.from("2019"), "in a year");
		assert.is(subject.from("2019", true), "a year");

		assert.is(subject.from("2018"), "in 2 years");
		assert.is(subject.from("2018", true), "2 years");

		assert.is(subject.from("2021"), "a year ago");
		assert.is(subject.from("2021", true), "a year");

		assert.is(subject.from("2022"), "2 years ago");
		assert.is(subject.from("2022", true), "2 years");
	});

	it("should determine a human-readable difference between now and another date", () => {
		const now = DateTime.make().toString();
		const fromNow = subject.from(now).toString();

		assert.is(subject.fromNow(), fromNow);
	});

	it("should determine if the date is valid", () => {
		assert.true(subject.isValid());

		const invalidDate = DateTime.make("abc");

		assert.false(invalidDate.isValid());
	});
});
