---
title: Contacts
---

# Contacts

<x-alert type="info">
These methods are accessible through `profile.contacts()` which exposes a `ContactRepository` instance.
</x-alert>

## Get a list of all contacts

```typescript
profile.contacts().all();
```

## Get the first stored contact

```typescript
profile.contacts().first();
```

## Get the last stored contact

```typescript
profile.contacts().last();
```

## Get a list of all wallet keys

```typescript
profile.contacts().keys();
```

## Get a list of all wallet values

```typescript
profile.contacts().values();
```

## Create a new contact for the given data

```typescript
profile.contacts().create(
    "Jane Doe",
    [{ coin: "Ethereum", network: "testnet", address: "TESTNET-ADDRESS" }],
);
```

## Fill the contacts with the given contacts object

```typescript
profile.contacts().fill(contacts);
```

## Find the contact for the given ID

```typescript
profile.contacts().findById("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
```

## Update a contact using its Id and provided information

```typescript
profile.contacts().update(newContact.id(), { name: "Jane Doe" });
```

## Forget the contact for the given ID

```typescript
profile.contacts().forget("uuid");
```

## Forget all contacts (Use with caution!)

```typescript
profile.contacts().flush();
```

## Get the count of stored contacts

```typescript
profile.contacts().count();
```

## Find the contact for the given address

```typescript
profile.contacts().findByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
```

## Find all contacts for the given coin

```typescript
profile.contacts().findByCoin("ARK");
```

## Find the contact for the given network

```typescript
profile.contacts().findByNetwork("devnet");
```

## Get the contacts data as an Object

```typescript
profile.contacts().toObject();
```
