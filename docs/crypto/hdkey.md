# HDKey

The `HDKey` class provides methods to make derivation of hierarchical deterministic keys easier. This class is similar to the `BIP32` class but provides some convenience methods for working with `xpub` and `xprv` values.

## Importing the HDKey class

```typescript
import { HDKey } from "@payvo/cryptography";
```

## Derive a key from a seed

```typescript
HDKey.fromSeed('a0c42a9c3ac6abf2ba6a9946ae83af18f51bf1c9fa7dacc4c92513cc4dd015834341c775dcd4c0fac73547c5662d81a9e9361a0aac604a73a321bd9103bce8af');
```

## Derive a key from an extended public key

```typescript
HDKey.fromExtendedPublicKey('xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt');
```

## Derive a key from an extended private key

```typescript
HDKey.fromExtendedPrivateKey('xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j');
```

## Derive a key from a compressed public key

```typescript
HDKey.fromCompressedPublicKey('fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542');
```
