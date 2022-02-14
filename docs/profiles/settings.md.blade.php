---
title: Settings
---

# Settings

<x-alert type="info">
These methods are accessible through `profile.settings()` and `wallet.settings()` which expose a `SettingRepository` instance.
</x-alert>

## Get a list of all settings with key and value

```typescript
profile.settings().all();
```

## Get a list of all setting keys

```typescript
profile.settings().keys();
```

## Get a list of all setting values

```typescript
profile.settings().values();
```

## Get the value for the given key

```typescript
profile.settings().get("theme", "light");
```

## Set the value for the given key

```typescript
profile.settings().set("theme", "dark");
```

## Check if a setting for the given key exists

```typescript
profile.settings().has("theme");
```

## Forget the value for the given key

```typescript
profile.settings().forget("theme");
```

## Forget all settings (Use with caution!)

```typescript
profile.settings().flush();
```
