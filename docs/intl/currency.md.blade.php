---
title: Currency
---

# Currency

The `Currency` class provides methods to extract the numerical value out of any currency representation by normalizing the input and removing any locale specific rules like symbols and use of commas.

## Importing the Currency class

```typescript
import { Currency } from "@payvo/sdk-intl";
```

## Instantiating from ARK (with comma)

```typescript
Currency.fromString("Ѧ 0,0001");
```

## Instantiating from Brazilian Real

```typescript
Currency.fromString("R$ 45,210.21");
```

## Instantiating from USD

```typescript
Currency.fromString("$ 45.210,21");
```

## Instantiating from ARK (with point)

```typescript
Currency.fromString("Ѧ 0.1000000081283");
```

## Instantiating from a number

```typescript
Currency.fromString("52,21579");
```
