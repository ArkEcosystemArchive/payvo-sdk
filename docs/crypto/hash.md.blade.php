---
title: Hash
---

# Hash

The `Hash` class provides methods to extract the numerical value out of any currency representation by normalizing the input and removing any locale specific rules like symbols and use of commas.

## Importing the Hash class

```typescript
import { Hash } from "@payvo/cryptography";
```

## Hash a value with the RIPEMD160 algorithm

```typescript
Hash.ripemd160(someBuffer);
```

## Hash a value with the SHA1 algorithm

```typescript
Hash.sha1(someBuffer);
```

## Hash a value with the SHA256 algorithm

```typescript
Hash.sha256(someBuffer);
```

## Hash a value with the HASH160 algorithm

```typescript
Hash.hash160(someBuffer);
```

## Hash a value with the HASH256 algorithm

```typescript
Hash.hash256(someBuffer);
```
