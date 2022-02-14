---
title: Base64
---

# Base64

The `Base64` class provides methods to encode, decode, and validate base64 strings.

## Importing the Base64 class

```typescript
import { Base64 } from "@payvo/cryptography";
```

## Encode a string to Base64

```typescript
Base64.encode("Hello World");
```

## Decode a Base64 string

```typescript
Base64.decode("SGVsbG8gV29ybGQ=");
```

## Validate a Base64 string

```typescript
Base64.validate("SGVsbG8gV29ybGQ=");
```
