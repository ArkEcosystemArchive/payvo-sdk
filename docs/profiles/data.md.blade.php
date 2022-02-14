---
title: Data
---

# Data

<x-alert type="info">
These methods are accessible through `env.data()`, `profile.data()` and `wallet.data()` which expose a `DataRepository` instance.
</x-alert>

## Get a list of all stored data

```typescript
profile.data().all();
```

## Get the first stored data item

```typescript
profile.data().first();
```

## Get the last stored data item

```typescript
profile.data().last();
```

## Get a list of all stored data keys

```typescript
profile.data().keys();
```

## Get a list of all data values

```typescript
profile.data().values();
```

## Get the value for the given key

```typescript
profile.data().get("theme");
```

## Fill the data with the provided key-value pairs

```typescript
profile.data().fill(profileData);
```

## Check if a data for the given key exists

```typescript
profile.data().has("theme");
```

## Check if a data for the given key is missing

```typescript
profile.data().missing("theme");
```

## Forget the value for the given key

```typescript
profile.data().forget("theme");
```

## Forget the value for the given key and index

```typescript
profile.data().forgetIndex("theme", 1);
```

## Forget all data (Use with caution!)

```typescript
profile.data().flush();
```

## Get the count of the stored data

```typescript
profile.data().count();
```

## Take a snapshot of the current data (Use with caution!)

```typescript
profile.data().snapshot();
```

## Restore a previously taken snapshot (Use with caution!)

```typescript
profile.data().restore();
```

## Return the data as a JSON object

```typescript
profile.data().toJson();
```
