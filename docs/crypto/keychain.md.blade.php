---
title: Keychain
---

# Keychain

The `Keychain` class provides methods to extract the numerical value out of any currency representation by normalizing the input and removing any locale specific rules like symbols and use of commas.

## Importing the Keychain class

```typescript
import { Keychain } from "@payvo/cryptography";
```

## Get an account from the keychain

```typescript
Keychain.get('your-app-name', 'account-id');
```

## Set an account in the keychain with the given password

```typescript
Keychain.set('your-app-name', 'account-id', 'password');
```

## Forget an account from the keychain

```typescript
Keychain.forget('your-app-name', 'account-id');
```
