---
title: argon2
---

# argon2

The `Argon2` class provides methods to extract the numerical value out of any currency representation by normalizing the input and removing any locale specific rules like symbols and use of commas.

## Importing the Argon2 class

```typescript
import { Argon2 } from "@payvo/cryptography";
```

## Hash a value

```typescript
Argon2.hash("password");
```

## Verify that a value matches the expected hash

```typescript
Argon2.verify(Bcrypt.hash("password"), "password");
```
