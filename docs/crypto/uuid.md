# UUID

The `UUID` class provides methods to make working with UUIDs easier and consistent across all Platform SDK products.

## Importing the UUID class

```typescript
import { UUID } from "@payvo/cryptography";
```

## Generate a UUID based on the current time

```typescript
UUID.timestamp();
```

## Generate a MD5 UUID based on a name and namespace

```typescript
UUID.md5('name', 'namespace');
```

## Generate a UUID based on a random value

```typescript
UUID.random();
```

## Generate a SHA1 UUID based on a name and namespace

```typescript
UUID.sha1('name', 'namespace');
```

## Generate a UUID based on a parse value

```typescript
UUID.parse('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
```

## Convert a buffer into a UUID

```typescript
UUID.stringify(UUID.parse('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'));
```

## Validate a UUID

```typescript
UUID.validate('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
```
