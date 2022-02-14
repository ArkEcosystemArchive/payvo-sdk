---
title: PBKDF2
---

# PBKDF2

The `PBKDF2` (_Password-Based Key Derivation Function 2_) class provides methods to encrypt and decrypt messages using a password.

## Importing the PBKDF2 class

```typescript
import { PBKDF2 } from "@payvo/cryptography";
```

## Encode a string to Base64

```typescript
PBKDF2.encrypt("Hello World", "password");
```

## Decrypt a PBKDF2 message

```typescript
PBKDF2.decrypt(encryptedMessage, "password");
```
