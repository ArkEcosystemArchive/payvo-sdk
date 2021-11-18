import { jest } from "@jest/globals";

import { DateTime } from "./datetime.js";

let subject: DateTime;

beforeEach(() => (subject = DateTime.make("2020-01-01")));

test("#make", () => {
	const consoleSpy = jest.spyOn(console, "debug").mockReturnValue();

	DateTime.make("2020-01-01 12:00:00", "invalid");

	assert.is(consoleSpy).toHaveBeenCalledWith("Failed to load data for the [invalid] locale.");
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
	assert.is(subject.isBefore(DateTime.make("2020-01-01").addDay()), true);
	assert.is(subject.isBefore(DateTime.make("2020-01-01").subDay()), false);
});

test("#isSame", () => {
	assert.is(subject.isSame(subject), true);
	assert.is(subject.isSame(DateTime.make("2020-01-01").addDay()), false);
});

test("#isAfter", () => {
	assert.is(subject.isAfter(DateTime.make("2020-01-01").subDay()), true);
	assert.is(subject.isAfter(DateTime.make("2020-01-01").addDay()), false);
});

test("#getMillisecond", () => {
	assert.is(subject.getMillisecond()).toEqual(0);
});

test("#getSecond", () => {
	assert.is(subject.getSecond()).toEqual(0);
});

test("#getMinute", () => {
	assert.is(subject.getMinute()).toEqual(0);
});

test("#getHour", () => {
	assert.is(subject.getHour()).toEqual(0);
});

test("#getDayOfMonth", () => {
	assert.is(subject.getDayOfMonth()).toEqual(1);
});

test("#getDay", () => {
	assert.is(subject.getDay()).toEqual(1);
});

test("#getWeek", () => {
	assert.is(subject.getWeek()).toEqual(1);
});

test("#getMonth", () => {
	assert.is(subject.getMonth()).toEqual(0);
});

test("#getQuarter", () => {
	assert.is(subject.getQuarter()).toEqual(1);
});

test("#getYear", () => {
	assert.is(subject.getYear()).toEqual(2020);
});

test("#setMillisecond", () => {
	assert.is(subject.setMillisecond(500).getMillisecond()).toEqual(500);
});

test("#setSecond", () => {
	assert.is(subject.setSecond(30).getSecond()).toEqual(30);
});

test("#setMinute", () => {
	assert.is(subject.setMinute(30).getMinute()).toEqual(30);
});

test("#setHour", () => {
	assert.is(subject.setHour(12).getHour()).toEqual(12);
});

test("#setDayOfMonth", () => {
	assert.is(subject.setDayOfMonth(15).getDayOfMonth()).toEqual(15);
});

test("#setDay", () => {
	assert.is(subject.setDay(123).getDay()).toEqual(123);
});

test("#setWeek", () => {
	assert.is(subject.setWeek(26).getWeek()).toEqual(26);
});

test("#setMonth", () => {
	assert.is(subject.setMonth(3).getMonth()).toEqual(3);
});

test("#setQuarter", () => {
	assert.is(subject.setQuarter(2).getQuarter()).toEqual(2);
});

test("#setYear", () => {
	assert.is(subject.setYear(123).getYear()).toEqual(123);
});

test("#addMillisecond", () => {
	assert.is(subject.addMillisecond()).not.toEqual(subject.toString());
});

test("#addMilliseconds", () => {
	assert.is(subject.addMilliseconds(5)).not.toEqual(subject.toString());
});

test("#addSecond", () => {
	assert.is(subject.addSecond()).not.toEqual(subject.toString());
});

test("#addSeconds", () => {
	assert.is(subject.addSeconds(5)).not.toEqual(subject.toString());
});

test("#addMinute", () => {
	assert.is(subject.addMinute()).not.toEqual(subject.toString());
});

test("#addMinutes", () => {
	assert.is(subject.addMinutes(5)).not.toEqual(subject.toString());
});

test("#addHour", () => {
	assert.is(subject.addHour()).not.toEqual(subject.toString());
});

test("#addHours", () => {
	assert.is(subject.addHours(5)).not.toEqual(subject.toString());
});

test("#addDay", () => {
	assert.is(subject.addDay()).not.toEqual(subject.toString());
});

test("#addDays", () => {
	assert.is(subject.addDays(5)).not.toEqual(subject.toString());
});

test("#addWeek", () => {
	assert.is(subject.addWeek()).not.toEqual(subject.toString());
});

test("#addWeeks", () => {
	assert.is(subject.addWeeks(5)).not.toEqual(subject.toString());
});

test("#addMonth", () => {
	assert.is(subject.addMonth()).not.toEqual(subject.toString());
});

test("#addMonths", () => {
	assert.is(subject.addMonths(5)).not.toEqual(subject.toString());
});

test("#addYear", () => {
	assert.is(subject.addYear()).not.toEqual(subject.toString());
});

test("#addYears", () => {
	assert.is(subject.addYears(5)).not.toEqual(subject.toString());
});

test("#subMillisecond", () => {
	assert.is(subject.subMillisecond()).not.toEqual(subject.toString());
});

test("#subMilliseconds", () => {
	assert.is(subject.subMilliseconds(5)).not.toEqual(subject.toString());
});

test("#subSecond", () => {
	assert.is(subject.subSecond()).not.toEqual(subject.toString());
});

test("#subSeconds", () => {
	assert.is(subject.subSeconds(5)).not.toEqual(subject.toString());
});

test("#subMinute", () => {
	assert.is(subject.subMinute()).not.toEqual(subject.toString());
});

test("#subMinutes", () => {
	assert.is(subject.subMinutes(5)).not.toEqual(subject.toString());
});

test("#subHour", () => {
	assert.is(subject.subHour()).not.toEqual(subject.toString());
});

test("#subHours", () => {
	assert.is(subject.subHours(5)).not.toEqual(subject.toString());
});

test("#subDay", () => {
	assert.is(subject.subDay()).not.toEqual(subject.toString());
});

test("#subDays", () => {
	assert.is(subject.subDays(5)).not.toEqual(subject.toString());
});

test("#subWeek", () => {
	assert.is(subject.subWeek()).not.toEqual(subject.toString());
});

test("#subWeeks", () => {
	assert.is(subject.subWeeks(5)).not.toEqual(subject.toString());
});

test("#subMonth", () => {
	assert.is(subject.subMonth()).not.toEqual(subject.toString());
});

test("#subMonths", () => {
	assert.is(subject.subMonths(5)).not.toEqual(subject.toString());
});

test("#subQuarter", () => {
	assert.is(subject.subQuarter()).not.toEqual(subject.toString());
});

test("#subQuarters", () => {
	assert.is(subject.subQuarters(5)).not.toEqual(subject.toString());
});

test("#subYear", () => {
	assert.is(subject.subYear()).not.toEqual(subject.toString());
});

test("#subYears", () => {
	assert.is(subject.subYears(5)).not.toEqual(subject.toString());
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
	assert.is(subject.toObject()).toEqual({
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
	assert.is(subject.toDate()).toBeDate();
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
	assert.is(subject.isValid(), true);

	const invalidDate = DateTime.make("abc");

	assert.is(invalidDate.isValid(), false);
});
