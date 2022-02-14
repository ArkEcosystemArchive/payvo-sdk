---
title: Guidelines
faq_index: 1
---

# Guidelines

When working with the SDK there are a few things that need to be kept in mind if you plan to make any changes, add new functionality or simply use it. This document will outline the most important but there are also case-by-case guidelines that can be applied as a reviewer sees fit.

## Do's

- Do adhere to the implementation contracts. **Not adhering to them by ignoring errors will cause runtime crashes.**
- Do throw exceptions in functions that could cause unexpected runtime errors. **An explicit exception clearly communicates what the problem is as opposed to a bad method call with no specific reason.**
- Do document behaviours when you implement a new coin or functionality. **Each coin has different reasons for why features work like they do. Documenting it makes it easy for new developers to understand that why.**
- Do ensure that official products work with all the dependencies that you require. **Some coins only support CommonJS so make sure that it works with all official products.**

## Dont's

- Don't implement functionality that isn't widely supported or required for an official product. **An example is implementing a transaction type that is only supported by a single coin.**
- Don't implement functionality that has a major impact on performance. **If you absolutely need to you'll need to ensure that you are using the most performant implementation possible.**
- Don't implement functionality that has only been recently implemented by a coin. **An example would be a new transaction type on a testnet.**
- Don't introduce new properties if you can determine the behaviour based on the value format. **An example is if different formats of addresses exist and you need to perform a task based on the variant that is passed in.**

## Usage with the wallets

When interacting with the SDK through the wallet you'll always do so through the profiles package. The profiles package is responsible for handling all data and interactions with the SDK. There are a lot of behaviours, especially in regards to transactions, that are handled by the profiles package to ensure all clients consistently handle the data. Directly interacting with the SDK can cause corrupt data and should be avoided for that reason.

**Unless the project you are working on requires explicit access to the SDK you shouldn't do so and let the profiles package handle it. This only applies to official products!**
