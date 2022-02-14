---
title: WIF
---

# WIF

The `WIF` class provides methods to make working with the `Bitcoin Wallet Import Format` easier and consistent across all Platform SDK products.

## Importing the WIF class

```typescript
import { WIF } from "@payvo/cryptography";
```

## Encode a private key

```typescript
WIF.encode({
    version: 128,
    privateKey: "0000000000000000000000000000000000000000000000000000000000000001",
    compressed: true,
});
```

## Decode an encoded WIF

```typescript
WIF.decode('KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn');
```
