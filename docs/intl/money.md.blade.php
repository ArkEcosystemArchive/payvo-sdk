---
title: Money
---

# Money

## Importing the Money class

```typescript
import { Money } from "@payvo/sdk-intl";
```

## Get the amount in cents

```typescript
Money.make(5000, "EUR").getAmount();
```

## Format the given number with a currency symbol as suffix for the given locale

```typescript
Money.make(5000, "EUR").setLocale("de-DE").format();
```

## Add a given amount in cents

```typescript
Money.make(5000, "EUR").plus(Money.make(1000, "EUR")).getAmount();
```

## Subtract a given amount in cents

```typescript
Money.make(5000, "EUR").minus(Money.make(1000, "EUR")).getAmount();
```

## Multiply the amount

```typescript
Money.make(5000, "EUR").times(10).getAmount();
```

## Divide the amount

```typescript
Money.make(5000, "EUR").divide(10).getAmount();
```

## Check if the actual and expected amount are equal

```typescript
Money.make(5000, "EUR").isEqualTo(Money.make(5000, "EUR"));
Money.make(5000, "EUR").isEqualTo(Money.make(1000, "EUR"));
```

## Check if the actual amount is less than the expected amount

```typescript
Money.make(5000, "EUR").isLessThan(Money.make(6000, "EUR"));
Money.make(5000, "EUR").isLessThan(Money.make(5000, "EUR"));
Money.make(5000, "EUR").isLessThan(Money.make(4000, "EUR"));
```

## Check if the actual amount is less than or equal to the expected amount

```typescript
Money.make(5000, "EUR").isLessThanOrEqual(Money.make(5000, "EUR"));
Money.make(5000, "EUR").isLessThanOrEqual(Money.make(6000, "EUR"));
Money.make(5000, "EUR").isLessThanOrEqual(Money.make(4000, "EUR"));
```

## Check if the actual amount is greater than the expected amount

```typescript
Money.make(5000, "EUR").isGreaterThan(Money.make(1000, "EUR"));
Money.make(5000, "EUR").isGreaterThan(Money.make(1000, "EUR"));
Money.make(5000, "EUR").isGreaterThan(Money.make(6000, "EUR"));
```

## Check if the actual amount is greater than or equal to the expected amount

```typescript
Money.make(5000, "EUR").isGreaterThanOrEqual(Money.make(1000, "EUR"));
Money.make(5000, "EUR").isGreaterThanOrEqual(Money.make(1000, "EUR"));
Money.make(5000, "EUR").isGreaterThanOrEqual(Money.make(6000, "EUR"));
```

## Check if the amount is positive

```typescript
Money.make(1, "EUR").isPositive();
Money.make(-1, "EUR").isPositive();
```

## Check if the amount is negative

```typescript
Money.make(-1, "EUR").isNegative();
Money.make(1, "EUR").isNegative();
```

## Get the currency symbol

```typescript
Money.make(5000, "EUR").getCurrency();
```

## Format the given number with a currency symbol as suffix

```typescript
Money.make(5000, "EUR").format();
```

## Return the amount in its human-readable representation

```typescript
Money.make(5000, "EUR").toUnit();
```
