---
title: Notifications
---

# Notifications

<x-alert type="info">
These methods are accessible through `profile.notifications()` which exposes a `NotificationRepository` instance.
</x-alert>

## Get a list of all notifications

```typescript
profile.notifications().all();
```

## Get the first stored notification

```typescript
profile.notifications().first();
```

## Get the last stored notification

```typescript
profile.notifications().last();
```

## Get a list of all notification keys

```typescript
profile.notifications().keys();
```

## Get a list of all notification values

```typescript
profile.notifications().values();
```

## Get a notification by value

```typescript
profile.notifications().get(notification.id);
```

## Create a new notification for the given data

```typescript
profile.notifications().push({
    icon: "warning",
    name: "Ledger Update Available",
    body: "...",
    action: "Read Changelog",
});
```

## Fill the notifications object with the provided data

```typescript
profile.notifications().fill(notificationData);
```

## Check if a data for the given notification exists

```typescript
profile.notifications().has(notificationId);
```

## Forget the notification for the given Id

```typescript
profile.notifications().forget("uuid");
```

## Forget all notifications (Use with caution!)

```typescript
profile.notifications().flush();
```

## Get the count of all stored notifications

```typescript
profile.notifications().count();
```

## Get all read notifications

```typescript
profile.notifications().read();
```

## Get all unread notifications

```typescript
profile.notifications().unread();
```

## Mark the for the given Id as read

```typescript
profile.notifications().markAsRead("uuid");
```
