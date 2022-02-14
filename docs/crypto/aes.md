# AES

The `AES` class provides methods to extract the numerical value out of any currency representation by normalizing the input and removing any locale specific rules like symbols and use of commas.

## Importing the AES class

```typescript
import { AES } from "@payvo/cryptography";
```

## Encrypt a message with the given password

```typescript
AES.encrypt("message", "password");
```

## Decrypt a message with the given password

```typescript
AES.decrypt(AES.encrypt("message", "password"), "password");
```
