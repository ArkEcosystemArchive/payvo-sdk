# BIP39

The `BIP39` class provides methods to generate, extract, normalize, and validate mnemonic recovery phrases.

## Importing the BIP39 class

```typescript
import { BIP39 } from "@payvo/cryptography";
```

## Generate a mnemonic

```typescript
BIP39.generate();
```

## Validate a mnemonic

```typescript
BIP39.validate('scout mushroom doctor prepare identify obvious soccer stage sudden already brass december million wish flower');
```

## Turn a mnemonic into a seed

```typescript
BIP39.toSeed('scout mushroom doctor prepare identify obvious soccer stage sudden already brass december million wish flower');
```

## Turn a mnemonic into entropy

```typescript
BIP39.toEntropy('scout mushroom doctor prepare identify obvious soccer stage sudden already brass december million wish flower');
```

## Normalize a passphrase

```typescript
BIP39.normalize("조건 열흘 무슨 인쇄 송편 올가을 질서 청년 추천 개인 균형 많이 여대생 회관 불안");
```
