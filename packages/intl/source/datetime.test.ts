import { describe } from "@payvo/sdk-test";

import { DateTime } from "./datetime.js";

describe("DateTime", ({ assert, beforeEach, it, stub }) => {
	beforeEach((context) => (context.subject = DateTime.make("2020-01-01")));

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

	it("should determine if the date is before another date", (context) => {
		assert.true(context.subject.isBefore(DateTime.make("2020-01-01").addDay()));
		assert.false(context.subject.isBefore(DateTime.make("2020-01-01").subDay()));
	});

	it("should determine if two dates the same", (context) => {
		assert.true(context.subject.isSame(context.subject));
		assert.false(context.subject.isSame(DateTime.make("2020-01-01").addDay()));
	});

	it("should determine if the date is after another date", (context) => {
		assert.true(context.subject.isAfter(DateTime.make("2020-01-01").subDay()));
		assert.false(context.subject.isAfter(DateTime.make("2020-01-01").addDay()));
	});

	it("should get the millisecond", (context) => {
		assert.is(context.subject.getMillisecond(), 0);
	});

	it("should get the second", (context) => {
		assert.is(context.subject.getSecond(), 0);
	});

	it("should get the minute", (context) => {
		assert.is(context.subject.getMinute(), 0);
	});

	it("should get the hour", (context) => {
		assert.is(context.subject.getHour(), 0);
	});

	it("should get the dayofmonth", (context) => {
		assert.is(context.subject.getDayOfMonth(), 1);
	});

	it("should get the day", (context) => {
		assert.is(context.subject.getDay(), 1);
	});

	it("should get the week", (context) => {
		assert.is(context.subject.getWeek(), 1);
	});

	it("should get the month", (context) => {
		assert.is(context.subject.getMonth(), 0);
	});

	it("should get the quarter", (context) => {
		assert.is(context.subject.getQuarter(), 1);
	});

	it("should get the year", (context) => {
		assert.is(context.subject.getYear(), 2020);
	});

	it("should set the millisecond", (context) => {
		assert.is(context.subject.setMillisecond(500).getMillisecond(), 500);
	});

	it("should set the second", (context) => {
		assert.is(context.subject.setSecond(30).getSecond(), 30);
	});

	it("should set the minute", (context) => {
		assert.is(context.subject.setMinute(30).getMinute(), 30);
	});

	it("should set the hour", (context) => {
		assert.is(context.subject.setHour(12).getHour(), 12);
	});

	it("should set the dayofmonth", (context) => {
		assert.is(context.subject.setDayOfMonth(15).getDayOfMonth(), 15);
	});

	it("should set the day", (context) => {
		assert.is(context.subject.setDay(123).getDay(), 123);
	});

	it("should set the week", (context) => {
		assert.is(context.subject.setWeek(26).getWeek(), 26);
	});

	it("should set the month", (context) => {
		assert.is(context.subject.setMonth(3).getMonth(), 3);
	});

	it("should set the quarter", (context) => {
		assert.is(context.subject.setQuarter(2).getQuarter(), 2);
	});

	it("should set the year", (context) => {
		assert.is(context.subject.setYear(123).getYear(), 123);
	});

	it("should add millisecond", (context) => {
		assert.is.not(context.subject.addMillisecond().toISOString(), context.subject.toISOString());
	});

	it("should add milliseconds", (context) => {
		assert.is.not(context.subject.addMilliseconds(5).toISOString(), context.subject.toISOString());
	});

	it("should add second", (context) => {
		assert.is.not(context.subject.addSecond().toString(), context.subject.toString());
	});

	it("should add seconds", (context) => {
		assert.is.not(context.subject.addSeconds(5).toString(), context.subject.toString());
	});

	it("should add minute", (context) => {
		assert.is.not(context.subject.addMinute().toString(), context.subject.toString());
	});

	it("should add minutes", (context) => {
		assert.is.not(context.subject.addMinutes(5).toString(), context.subject.toString());
	});

	it("should add hour", (context) => {
		assert.is.not(context.subject.addHour().toString(), context.subject.toString());
	});

	it("should add hours", (context) => {
		assert.is.not(context.subject.addHours(5).toString(), context.subject.toString());
	});

	it("should add day", (context) => {
		assert.is.not(context.subject.addDay().toString(), context.subject.toString());
	});

	it("should add days", (context) => {
		assert.is.not(context.subject.addDays(5).toString(), context.subject.toString());
	});

	it("should add week", (context) => {
		assert.is.not(context.subject.addWeek().toString(), context.subject.toString());
	});

	it("should add weeks", (context) => {
		assert.is.not(context.subject.addWeeks(5).toString(), context.subject.toString());
	});

	it("should add month", (context) => {
		assert.is.not(context.subject.addMonth().toString(), context.subject.toString());
	});

	it("should add months", (context) => {
		assert.is.not(context.subject.addMonths(5).toString(), context.subject.toString());
	});

	it("should add year", (context) => {
		assert.is.not(context.subject.addYear().toString(), context.subject.toString());
	});

	it("should add years", (context) => {
		assert.is.not(context.subject.addYears(5).toString(), context.subject.toString());
	});

	it("should subtract millisecond", (context) => {
		assert.is.not(context.subject.subMillisecond().toString(), context.subject.toString());
	});

	it("should subtract milliseconds", (context) => {
		assert.is.not(context.subject.subMilliseconds(5).toString(), context.subject.toString());
	});

	it("should subtract second", (context) => {
		assert.is.not(context.subject.subSecond().toString(), context.subject.toString());
	});

	it("should subtract seconds", (context) => {
		assert.is.not(context.subject.subSeconds(5).toString(), context.subject.toString());
	});

	it("should subtract minute", (context) => {
		assert.is.not(context.subject.subMinute().toString(), context.subject.toString());
	});

	it("should subtract minutes", (context) => {
		assert.is.not(context.subject.subMinutes(5).toString(), context.subject.toString());
	});

	it("should subtract hour", (context) => {
		assert.is.not(context.subject.subHour().toString(), context.subject.toString());
	});

	it("should subtract hours", (context) => {
		assert.is.not(context.subject.subHours(5).toString(), context.subject.toString());
	});

	it("should subtract day", (context) => {
		assert.is.not(context.subject.subDay().toString(), context.subject.toString());
	});

	it("should subtract days", (context) => {
		assert.is.not(context.subject.subDays(5).toString(), context.subject.toString());
	});

	it("should subtract week", (context) => {
		assert.is.not(context.subject.subWeek().toString(), context.subject.toString());
	});

	it("should subtract weeks", (context) => {
		assert.is.not(context.subject.subWeeks(5).toString(), context.subject.toString());
	});

	it("should subtract month", (context) => {
		assert.is.not(context.subject.subMonth().toString(), context.subject.toString());
	});

	it("should subtract months", (context) => {
		assert.is.not(context.subject.subMonths(5).toString(), context.subject.toString());
	});

	it("should subtract quarter", (context) => {
		assert.is.not(context.subject.subQuarter().toString(), context.subject.toString());
	});

	it("should subtract quarters", (context) => {
		assert.is.not(context.subject.subQuarters(5).toString(), context.subject.toString());
	});

	it("should subtract year", (context) => {
		assert.is.not(context.subject.subYear().toString(), context.subject.toString());
	});

	it("should subtract years", (context) => {
		assert.is.not(context.subject.subYears(5).toString(), context.subject.toString());
	});

	it("should determine the difference in milliseconds", (context) => {
		assert.is(context.subject.diffInMilliseconds(context.subject.addMillisecond()), -1);
	});

	it("should determine the difference in seconds", (context) => {
		assert.is(context.subject.diffInSeconds(context.subject.addSecond()), -1);
	});

	it("should determine the difference in minutes", (context) => {
		assert.is(context.subject.diffInMinutes(context.subject.addMinute()), -1);
	});

	it("should determine the difference in hours", (context) => {
		assert.is(context.subject.diffInHours(context.subject.addHour()), -1);
	});

	it("should determine the difference in days", (context) => {
		assert.is(context.subject.diffInDays(context.subject.addDay()), -1);
	});

	it("should determine the difference in weeks", (context) => {
		assert.is(context.subject.diffInWeeks(context.subject.addWeek()), -1);
	});

	it("should determine the difference in months", (context) => {
		assert.is(context.subject.diffInMonths(context.subject.addMonth()), -1);
	});

	it("should determine the difference in quarters", (context) => {
		assert.is(context.subject.diffInQuarters(context.subject.addQuarter()), -1);
	});

	it("should determine the difference in years", (context) => {
		assert.is(context.subject.diffInYears(context.subject.addYear()), -1);
	});

	it("should format the date using the given rules", (context) => {
		assert.is(context.subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-01-01T00:00:00+00:00Z");
		assert.is(context.subject.format("DD/MM/YYYY"), "01/01/2020");
		assert.is(context.subject.format("L h:mm:ss A"), "01/01/2020 12:00:00 AM");
		assert.is(context.subject.format("L HH:mm:ss"), "01/01/2020 00:00:00");
		assert.is(context.subject.format("L LTS"), "01/01/2020 12:00:00 AM");
	});

	it("should transform the date into an object containing each segment", (context) => {
		assert.equal(context.subject.toObject(), {
			date: 1,
			hours: 0,
			milliseconds: 0,
			minutes: 0,
			months: 0,
			seconds: 0,
			years: 2020,
		});
	});

	it("should transform the date into a JSON string", (context) => {
		assert.is(context.subject.toJSON(), "2020-01-01T00:00:00.000Z");
	});

	it("should transform the date into a ISO string", (context) => {
		assert.is(context.subject.toISOString(), "2020-01-01T00:00:00.000Z");
	});

	it("should transform the date into a human-readable string", (context) => {
		assert.is(context.subject.toString(), "Wed, 01 Jan 2020 00:00:00 GMT");
	});

	it("should transform the date into a UNIX timestamp", (context) => {
		assert.is(context.subject.toUNIX(), 1_577_836_800);
	});

	it("should transform the date into a timestamp with milliseconds", (context) => {
		assert.is(context.subject.valueOf(), 1_577_836_800_000);
	});

	it("should transform the date into a native Date instance", (context) => {
		assert.instance(context.subject.toDate(), Date);
	});

	it("should return the start of the year", (context) => {
		assert.is(context.subject.startOf("year").toISOString(), "2020-01-01T00:00:00.000Z");
	});

	it("should determine a human-readable difference between years", (context) => {
		assert.is(context.subject.from("2019"), "in a year");
		assert.is(context.subject.from("2019", true), "a year");

		assert.is(context.subject.from("2018"), "in 2 years");
		assert.is(context.subject.from("2018", true), "2 years");

		assert.is(context.subject.from("2021"), "a year ago");
		assert.is(context.subject.from("2021", true), "a year");

		assert.is(context.subject.from("2022"), "2 years ago");
		assert.is(context.subject.from("2022", true), "2 years");
	});

	it("should determine a human-readable difference between now and another date", (context) => {
		const now = DateTime.make().toString();
		const fromNow = context.subject.from(now).toString();

		assert.is(context.subject.fromNow(), fromNow);
	});

	it("should determine if the date is valid", (context) => {
		assert.true(context.subject.isValid());

		const invalidDate = DateTime.make("abc");

		assert.false(invalidDate.isValid());
	});
});
