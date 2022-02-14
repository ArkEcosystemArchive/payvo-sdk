---
title: BIP32
---

# BIP32

The `BIP32` class provides methods to make derivation of hierarchical deterministic keys easier.

## Importing the BIP32 class

```typescript
import { BIP32 } from "@payvo/cryptography";
```

## Derive a key from a mnemonic

```typescript
BIP32.fromMnemonic('scout mushroom doctor prepare identify obvious soccer stage sudden already brass december million wish flower');
```

## Derive a key from a seed

```typescript
BIP32.fromSeed('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
```

## Derive a key from a base58

```typescript
BIP32.fromBase58('xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi');
```

## Derive a key from a public key

```typescript
BIP32.fromPublicKey('xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt');
```

## Derive a key from a private key

```typescript
BIP32.fromPrivateKey('xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j');
```
