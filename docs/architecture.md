---
title: Architecture
---

# Architecture

## Not Supported

Methods that are not supported will throw a `NotSupported` exception. A case of this would be if a coin doesn't have a the concept of voting which means we won't be able to support that feature.

## Not Implemented

Methods that will be supported in the future but are not implemented yet will throw a `NotImplemented` exception. A case of this would be a coin that supports voting but we have no plans yet of supporting this functionality in our applications.

## Async Operations

The majority of methods are `async` with a few exceptions. This is due to the fact that some coins require a network connection or perform computations in an async manner.

To avoid an inconsistent public API where some things are instantiated and called with `await` and others aren't you'll have to call most things with `await` and use the static `construct` method to create an instance of a service. This will allow you to swap out adapters without having to think about how they are instantiated.
