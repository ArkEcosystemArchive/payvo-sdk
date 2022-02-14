---
title: Environment
---

# Environment

## Create a new environment

```typescript
import { ARK } from "@payvo/sdk-ark";
import { Environment } from "@payvo/profiles";
import { Request } from "@payvo/sdk-http-bent";

new Environment({
    coins: { ARK },
    httpClient: new Request(),
    storage: "localstorage"
});
```

## Profiles

<x-alert type="info">
These methods are accessible through `env.profiles()` which exposes a `ProfileRepository` instance.
</x-alert>

### Fill the profile using the provided data

```typescript
env.profiles().fill(profileData);
```

### Get a list of all profiles

```typescript
env.profiles().all();
```

### Get the first stored profile

```typescript
env.profiles().first();
```

### Get the last stored profile

```typescript
env.profiles().last();
```

### Get all associated profile keys

```typescript
env.profiles().keys();
```

### Get all associated profile values

```typescript
env.profiles().values();
```

### Find the profile for the given Id

```typescript
env.profiles().findById("uuid");
```

### Find the profile for the given name

```typescript
env.profiles().findByName("John Doe");
```

### Create a new profile for the given name

```typescript
env.profiles().create("John Doe");
```

### Check if a data for the given key exists

```typescript
env.profiles().has(jane.id());
```

### Forget the profile for the given Id (Use with caution!)

```typescript
env.profiles().forget("uuid");
```

### Forget all profile data (Use with caution!)

```typescript
env.profiles().flush();
```

### Get the count of stored profiles

```typescript
env.profiles().count();
```

### Get the profile as a data Object

```typescript
env.profiles().toObject();
```
