---
title: Plugins
---

# Plugins

<x-alert type="info">
These methods are accessible through `profile.plugins()` which exposes a `PluginRepository` instance.
</x-alert>

## Get a list of all plugins

```typescript
profile.plugins().all();
```

## Get the first listed plugin

```typescript
profile.plugins().first();
```

## Get the last listed plugin

```typescript
profile.plugins().last();
```

## Get all data keys

```typescript
profile.plugins().keys();
```

## Get all data values

```typescript
profile.plugins().values();
```

## Register a new plugin

```typescript
profile.plugins().push(stubPlugin);
```

## Restore previously created data

```typescript
profile.plugins().fill({ ["@hello/world"]: stubPlugin });
```

## Find the plugin for a given Id

```typescript
profile.plugins().findById("@hello/world");
```

## Forget a plugin using its Id

```typescript
profile.plugins().forget("@hello/world");
```

## Forget all plugins (Use with caution!)

```typescript
profile.plugins().flush();
```

## Get the count of stored plugins

```typescript
profile.plugins().count();
```

## Registry

<x-alert type="info">
These methods are accessible through `profile.plugins().registry()` which exposes a `PluginRegistry` instance.
</x-alert>

## Get a list of registered plugins

```typescript
profile.plugins().registry().all();
```

## Get the size of a specific registry plugin

```typescript
profile.plugins().registry().size(registryPlugin);
```

## Get the download count of a specific registry plugin

```typescript
profile.plugins().registry().downloads(registryPlugin);
```
