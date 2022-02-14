---
title: DateTime
---

# DateTime

The `Currency` class provides methods to extract the numerical value out of any currency representation by normalizing the input and removing any locale specific rules like symbols and use of commas.

## Importing the DateTime class

```typescript
import { DateTime } from "@payvo/sdk-intl";
```

## Create an instance from a date

```typescript
DateTime.make("2020-01-01");
```

## Create an instance from a UNIX timestamp

```typescript
DateTime.fromUnix(1596534984);
```

## Format the date

```typescript
DateTime.make("2020-01-01").format("YYYY-MM-DDTHH:mm:ssZ[Z]");
```

```typescript
DateTime.make("2020-01-01").format("DD/MM/YYYY");
```

```typescript
DateTime.make("2020-01-01").format("L h:mm:ss A");
```

```typescript
DateTime.make("2020-01-01").format("L HH:mm:ss");
```

```typescript
DateTime.make("2020-01-01").format("L LTS");
```

## Check if the actual date is before the expected date

```typescript
DateTime.make("2020-01-01").isBefore(DateTime.make("2020-01-01").addDay());
```

```typescript
DateTime.make("2020-01-01").isBefore(DateTime.make("2020-01-01").subDay());
```

## Check if the actual date is the same as the expected date

```typescript
DateTime.make("2020-01-01").isSame(DateTime.make("2020-01-01"));
```

```typescript
DateTime.make("2020-01-01").isSame(DateTime.make("2020-01-01").addDay());
```

## Check if the actual date is after the expected date

```typescript
DateTime.make("2020-01-01").isAfter(DateTime.make("2020-01-01").subDay());
```

```typescript
DateTime.make("2020-01-01").isAfter(DateTime.make("2020-01-01").addDay());
```

## Get the millisecond of the date

```typescript
DateTime.make("2020-01-01").getMillisecond();
```

## Get the second of the date

```typescript
DateTime.make("2020-01-01").getSecond();
```

## Get the minute of the date

```typescript
DateTime.make("2020-01-01").getMinute();
```

## Get the hour of the date

```typescript
DateTime.make("2020-01-01").getHour();
```

## Get Day Of the month of the date

```typescript
DateTime.make("2020-01-01").getDayOfMonth();
```

## Get the day of the date

```typescript
DateTime.make("2020-01-01").getDay();
```

## Get the week of the date

```typescript
DateTime.make("2020-01-01").getWeek();
```

## Get the month of the date

```typescript
DateTime.make("2020-01-01").getMonth();
```

## Get the quarter of the date

```typescript
DateTime.make("2020-01-01").getQuarter();
```

## Get the year of the date

```typescript
DateTime.make("2020-01-01").getYear();
```

## Set the millisecond of date

```typescript
DateTime.make("2020-01-01").setMillisecond(500);
```

## Set the second of date

```typescript
DateTime.make("2020-01-01").setSecond(30);
```

## Set the minute of date

```typescript
DateTime.make("2020-01-01").setMinute(30);
```

## Set the hour of date

```typescript
DateTime.make("2020-01-01").setHour(12);
```

## Set Day Of the month of date

```typescript
DateTime.make("2020-01-01").setDayOfMonth(15);
```

## Set the day of date

```typescript
DateTime.make("2020-01-01").setDay(123);
```

## Set the week of date

```typescript
DateTime.make("2020-01-01").setWeek(26);
```

## Set the month of date

```typescript
DateTime.make("2020-01-01").setMonth(3);
```

## Set the quarter of date

```typescript
DateTime.make("2020-01-01").setQuarter(2);
```

## Set the year of date

```typescript
DateTime.make("2020-01-01").setYear(123);
```

## Add a millisecond to the date

```typescript
DateTime.make("2020-01-01").addMillisecond();
```

## Add the given number of milliseconds to the date

```typescript
DateTime.make("2020-01-01").addMilliseconds(5);
```

## Add a second to the date

```typescript
DateTime.make("2020-01-01").addSecond();
```

## Add the given number of seconds to the date

```typescript
DateTime.make("2020-01-01").addSeconds(5);
```

## Add a minute to the date

```typescript
DateTime.make("2020-01-01").addMinute();
```

## Add the given number of minutes to the date

```typescript
DateTime.make("2020-01-01").addMinutes(5);
```

## Add a hour to the date

```typescript
DateTime.make("2020-01-01").addHour();
```

## Add the given number of hours to the date

```typescript
DateTime.make("2020-01-01").addHours(5);
```

## Add a day to the date

```typescript
DateTime.make("2020-01-01").addDay();
```

## Add the given number of days to the date

```typescript
DateTime.make("2020-01-01").addDays(5);
```

## Add a week to the date

```typescript
DateTime.make("2020-01-01").addWeek();
```

## Add the given number of weeks to the date

```typescript
DateTime.make("2020-01-01").addWeeks(5);
```

## Add a month to the date

```typescript
DateTime.make("2020-01-01").addMonth();
```

## Add the given number of months to the date

```typescript
DateTime.make("2020-01-01").addMonths(5);
```

## Add a year to the date

```typescript
DateTime.make("2020-01-01").addYear();
```

## Add the given number of years to the date

```typescript
DateTime.make("2020-01-01").addYears(5);
```

## Add a subMillisecond to the date

```typescript
DateTime.make("2020-01-01").subMillisecond();
```

## Add the given number of subMilliseconds to the date

```typescript
DateTime.make("2020-01-01").subMilliseconds(5);
```

## Add a subSecond to the date

```typescript
DateTime.make("2020-01-01").subSecond();
```

## Add the given number of subSeconds to the date

```typescript
DateTime.make("2020-01-01").subSeconds(5);
```

## Add a subMinute to the date

```typescript
DateTime.make("2020-01-01").subMinute();
```

## Add the given number of subMinutes to the date

```typescript
DateTime.make("2020-01-01").subMinutes(5);
```

## Add a subHour to the date

```typescript
DateTime.make("2020-01-01").subHour();
```

## Add the given number of subHours to the date

```typescript
DateTime.make("2020-01-01").subHours(5);
```

## Add a subDay to the date

```typescript
DateTime.make("2020-01-01").subDay();
```

## Add the given number of subDays to the date

```typescript
DateTime.make("2020-01-01").subDays(5);
```

## Add a subWeek to the date

```typescript
DateTime.make("2020-01-01").subWeek();
```

## Add the given number of subWeeks to the date

```typescript
DateTime.make("2020-01-01").subWeeks(5);
```

## Add a subMonth to the date

```typescript
DateTime.make("2020-01-01").subMonth();
```

## Add the given number of subMonths to the date

```typescript
DateTime.make("2020-01-01").subMonths(5);
```

## Add a subYear to the date

```typescript
DateTime.make("2020-01-01").subYear();
```

## Add the given number of subYears to the date

```typescript
DateTime.make("2020-01-01").subYears(5);
```

## Get the difference between 2 dates in milliseconds

```typescript
DateTime.make("2020-01-01").diffInMilliseconds(DateTime.make("2020-01-01").addMillisecond());
```

## Get the difference between 2 dates in seconds

```typescript
DateTime.make("2020-01-01").diffInSeconds(DateTime.make("2020-01-01").addSecond());
```

## Get the difference between 2 dates in minutes

```typescript
DateTime.make("2020-01-01").diffInMinutes(DateTime.make("2020-01-01").addMinute());
```

## Get the difference between 2 dates in hours

```typescript
DateTime.make("2020-01-01").diffInHours(DateTime.make("2020-01-01").addHour());
```

## Get the difference between 2 dates in days

```typescript
DateTime.make("2020-01-01").diffInDays(DateTime.make("2020-01-01").addDay());
```

## Get the difference between 2 dates in weeks

```typescript
DateTime.make("2020-01-01").diffInWeeks(DateTime.make("2020-01-01").addWeek());
```

## Get the difference between 2 dates in months

```typescript
DateTime.make("2020-01-01").diffInMonths(DateTime.make("2020-01-01").addMonth());
```

## Get the difference between 2 dates in quarters

```typescript
DateTime.make("2020-01-01").diffInQuarters(DateTime.make("2020-01-01").addQuarter());
```

## Get the difference between 2 dates in years

```typescript
DateTime.make("2020-01-01").diffInYears(DateTime.make("2020-01-01").addYear());
```

## Get an object containing all of the parts of the date and time

```typescript
DateTime.make("2020-01-01").toObject();
```

## Get the JSON representation of the date

```typescript
DateTime.make("2020-01-01").toJSON();
```

## Get the ISO representation of the date

```typescript
DateTime.make("2020-01-01").toISOString();
```

## XXX

```typescript
DateTime.make("2020-01-01").toString();
```

## Get the UNIX representation of the date

```typescript
DateTime.make("2020-01-01").toUNIX();
```

## Get the timestamp with milliseconds of the date

```typescript
DateTime.make("2020-01-01").valueOf();
```

## Get a native `Date` instance of the date

```typescript
DateTime.make("2020-01-01").toDate();
```

## Get the start date for a given period

```typescript
DateTime.make("2020-01-01").startOf("year");
```

## Get the relative time from X

```typescript
DateTime.make("2020-01-01").from("2030");
```

```typescript
DateTime.make("2020-01-01").from("2030", true);
```

## Get the relative time from now

```typescript
const now = DateTime.make().toString();
const fromNow = DateTime.make("2020-01-01").from(now).toString();
DateTime.make("2020-01-01").fromNow();
```
