---
title: Numeral
---

# Numeral

## Importing the Numeral class

```typescript
import { Numeral } from "@payvo/sdk-intl";
```

## Format the given number

```typescript
Numeral.make("en").format(5000)
```

## Format the given number with a currency symbol as suffix

```typescript
Numeral.make("en").formatAsCurrency(5000, "EUR")
```

## Format the given number with a unit as suffix

```typescript
Numeral.make("en").formatAsUnit(5000, "kilobyte")
```
