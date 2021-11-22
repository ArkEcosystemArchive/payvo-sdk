import { assert, Mockery, test } from "@payvo/sdk-test";

import { DateTime } from "./datetime";

let subject;

test.before.each(() => (subject = DateTime.make("2020-01-01")));

test("#make", () => {
	const consoleSpy = Mockery.stub(console, "debug");

	DateTime.make("2020-01-01 12:00:00", "invalid");

	consoleSpy.calledWith("Failed to load data for the [invalid] locale.");
});

test("#setLocale", () => {
	const subject = DateTime.fromUnix(1_596_534_984);

	assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");

	subject.setLocale("de");

	assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");
});

test("#fromUnix", () => {
	const subject = DateTime.fromUnix(1_596_534_984);

	assert.is(subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-08-04T09:56:24+00:00Z");
	assert.is(subject.format("DD/MM/YYYY"), "04/08/2020");
	assert.is(subject.format("L h:mm:ss A"), "08/04/2020 9:56:24 AM");
	assert.is(subject.format("L HH:mm:ss"), "08/04/2020 09:56:24");
	assert.is(subject.format("L LTS"), "08/04/2020 9:56:24 AM");
});

test("#isBefore", () => {
	assert.true(subject.isBefore(DateTime.make("2020-01-01").addDay()));
	assert.false(subject.isBefore(DateTime.make("2020-01-01").subDay()));
});

test("#isSame", () => {
	assert.true(subject.isSame(subject));
	assert.false(subject.isSame(DateTime.make("2020-01-01").addDay()));
});

test("#isAfter", () => {
	assert.true(subject.isAfter(DateTime.make("2020-01-01").subDay()));
	assert.false(subject.isAfter(DateTime.make("2020-01-01").addDay()));
});

test("#getMillisecond", () => {
	assert.is(subject.getMillisecond(), 0);
});

test("#getSecond", () => {
	assert.is(subject.getSecond(), 0);
});

test("#getMinute", () => {
	assert.is(subject.getMinute(), 0);
});

test("#getHour", () => {
	assert.is(subject.getHour(), 0);
});

test("#getDayOfMonth", () => {
	assert.is(subject.getDayOfMonth(), 1);
});

test("#getDay", () => {
	assert.is(subject.getDay(), 1);
});

test("#getWeek", () => {
	assert.is(subject.getWeek(), 1);
});

test("#getMonth", () => {
	assert.is(subject.getMonth(), 0);
});

test("#getQuarter", () => {
	assert.is(subject.getQuarter(), 1);
});

test("#getYear", () => {
	assert.is(subject.getYear(), 2020);
});

test("#setMillisecond", () => {
	assert.is(subject.setMillisecond(500).getMillisecond(), 500);
});

test("#setSecond", () => {
	assert.is(subject.setSecond(30).getSecond(), 30);
});

test("#setMinute", () => {
	assert.is(subject.setMinute(30).getMinute(), 30);
});

test("#setHour", () => {
	assert.is(subject.setHour(12).getHour(), 12);
});

test("#setDayOfMonth", () => {
	assert.is(subject.setDayOfMonth(15).getDayOfMonth(), 15);
});

test("#setDay", () => {
	assert.is(subject.setDay(123).getDay(), 123);
});

test("#setWeek", () => {
	assert.is(subject.setWeek(26).getWeek(), 26);
});

test("#setMonth", () => {
	assert.is(subject.setMonth(3).getMonth(), 3);
});

test("#setQuarter", () => {
	assert.is(subject.setQuarter(2).getQuarter(), 2);
});

test("#setYear", () => {
	assert.is(subject.setYear(123).getYear(), 123);
});

test("#addMillisecond", () => {
	assert.is.not(subject.addMillisecond().toISOString(), subject.toISOString());
});

test("#addMilliseconds", () => {
	assert.is.not(subject.addMilliseconds(5).toISOString(), subject.toISOString());
});

test("#addSecond", () => {
	assert.is.not(subject.addSecond().toString(), subject.toString());
});

test("#addSeconds", () => {
	assert.is.not(subject.addSeconds(5).toString(), subject.toString());
});

test("#addMinute", () => {
	assert.is.not(subject.addMinute().toString(), subject.toString());
});

test("#addMinutes", () => {
	assert.is.not(subject.addMinutes(5).toString(), subject.toString());
});

test("#addHour", () => {
	assert.is.not(subject.addHour().toString(), subject.toString());
});

test("#addHours", () => {
	assert.is.not(subject.addHours(5).toString(), subject.toString());
});

test("#addDay", () => {
	assert.is.not(subject.addDay().toString(), subject.toString());
});

test("#addDays", () => {
	assert.is.not(subject.addDays(5).toString(), subject.toString());
});

test("#addWeek", () => {
	assert.is.not(subject.addWeek().toString(), subject.toString());
});

test("#addWeeks", () => {
	assert.is.not(subject.addWeeks(5).toString(), subject.toString());
});

test("#addMonth", () => {
	assert.is.not(subject.addMonth().toString(), subject.toString());
});

test("#addMonths", () => {
	assert.is.not(subject.addMonths(5).toString(), subject.toString());
});

test("#addYear", () => {
	assert.is.not(subject.addYear().toString(), subject.toString());
});

test("#addYears", () => {
	assert.is.not(subject.addYears(5).toString(), subject.toString());
});

test("#subMillisecond", () => {
	assert.is.not(subject.subMillisecond().toString(), subject.toString());
});

test("#subMilliseconds", () => {
	assert.is.not(subject.subMilliseconds(5).toString(), subject.toString());
});

test("#subSecond", () => {
	assert.is.not(subject.subSecond().toString(), subject.toString());
});

test("#subSeconds", () => {
	assert.is.not(subject.subSeconds(5).toString(), subject.toString());
});

test("#subMinute", () => {
	assert.is.not(subject.subMinute().toString(), subject.toString());
});

test("#subMinutes", () => {
	assert.is.not(subject.subMinutes(5).toString(), subject.toString());
});

test("#subHour", () => {
	assert.is.not(subject.subHour().toString(), subject.toString());
});

test("#subHours", () => {
	assert.is.not(subject.subHours(5).toString(), subject.toString());
});

test("#subDay", () => {
	assert.is.not(subject.subDay().toString(), subject.toString());
});

test("#subDays", () => {
	assert.is.not(subject.subDays(5).toString(), subject.toString());
});

test("#subWeek", () => {
	assert.is.not(subject.subWeek().toString(), subject.toString());
});

test("#subWeeks", () => {
	assert.is.not(subject.subWeeks(5).toString(), subject.toString());
});

test("#subMonth", () => {
	assert.is.not(subject.subMonth().toString(), subject.toString());
});

test("#subMonths", () => {
	assert.is.not(subject.subMonths(5).toString(), subject.toString());
});

test("#subQuarter", () => {
	assert.is.not(subject.subQuarter().toString(), subject.toString());
});

test("#subQuarters", () => {
	assert.is.not(subject.subQuarters(5).toString(), subject.toString());
});

test("#subYear", () => {
	assert.is.not(subject.subYear().toString(), subject.toString());
});

test("#subYears", () => {
	assert.is.not(subject.subYears(5).toString(), subject.toString());
});

test("#diffInMilliseconds", () => {
	assert.is(subject.diffInMilliseconds(subject.addMillisecond()), -1);
});

test("#diffInSeconds", () => {
	assert.is(subject.diffInSeconds(subject.addSecond()), -1);
});

test("#diffInMinutes", () => {
	assert.is(subject.diffInMinutes(subject.addMinute()), -1);
});

test("#diffInHours", () => {
	assert.is(subject.diffInHours(subject.addHour()), -1);
});

test("#diffInDays", () => {
	assert.is(subject.diffInDays(subject.addDay()), -1);
});

test("#diffInWeeks", () => {
	assert.is(subject.diffInWeeks(subject.addWeek()), -1);
});

test("#diffInMonths", () => {
	assert.is(subject.diffInMonths(subject.addMonth()), -1);
});

test("#diffInQuarters", () => {
	assert.is(subject.diffInQuarters(subject.addQuarter()), -1);
});

test("#diffInYears", () => {
	assert.is(subject.diffInYears(subject.addYear()), -1);
});

test("#format", () => {
	assert.is(subject.format("YYYY-MM-DDTHH:mm:ssZ[Z]"), "2020-01-01T00:00:00+00:00Z");
	assert.is(subject.format("DD/MM/YYYY"), "01/01/2020");
	assert.is(subject.format("L h:mm:ss A"), "01/01/2020 12:00:00 AM");
	assert.is(subject.format("L HH:mm:ss"), "01/01/2020 00:00:00");
	assert.is(subject.format("L LTS"), "01/01/2020 12:00:00 AM");
});

test("#toObject", () => {
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

test("#toJSON", () => {
	assert.is(subject.toJSON(), "2020-01-01T00:00:00.000Z");
});

test("#toISOString", () => {
	assert.is(subject.toISOString(), "2020-01-01T00:00:00.000Z");
});

test("#toString", () => {
	assert.is(subject.toString(), "Wed, 01 Jan 2020 00:00:00 GMT");
});

test("#toUNIX", () => {
	assert.is(subject.toUNIX(), 1_577_836_800);
});

test("#valueOf", () => {
	assert.is(subject.valueOf(), 1_577_836_800_000);
});

test("#toDate", () => {
	assert.instance(subject.toDate(), Date);
});

test("#startOf", () => {
	assert.is(subject.startOf("year").toISOString(), "2020-01-01T00:00:00.000Z");
});

test("#from", () => {
	assert.is(subject.from("2019"), "in a year");
	assert.is(subject.from("2019", true), "a year");

	assert.is(subject.from("2018"), "in 2 years");
	assert.is(subject.from("2018", true), "2 years");

	assert.is(subject.from("2021"), "a year ago");
	assert.is(subject.from("2021", true), "a year");

	assert.is(subject.from("2022"), "2 years ago");
	assert.is(subject.from("2022", true), "2 years");
});

test("#fromNow", () => {
	const now = DateTime.make().toString();
	const fromNow = subject.from(now).toString();

	assert.is(subject.fromNow(), fromNow);
});

test("#isValid", () => {
	assert.true(subject.isValid());

	const invalidDate = DateTime.make("abc");

	assert.false(invalidDate.isValid());
});

test.run();
