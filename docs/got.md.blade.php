---
title: got
---

# got

This is an HTTP Client for the Platform SDK. The implementation makes use of [got](https://github.com/sindresorhus/got) and adheres to the contracts laid out in the [specification](/docs/sdk/specification).

## Repository

<livewire:embed-link url="https://github.com/PayvoHQ/http-got" />

## Installation

```bash
yarn add @payvo/http-got
```

## Usage

```typescript
import { Environment } from "@payvo/profiles";
import { Request } from "@payvo/http-got";

new Environment({ httpClient: new Request() });
```

## Security

If you discover a security vulnerability within this package, please send an e-mail to [security@payvo.com](mailto:security@payvo.com). All security vulnerabilities will be promptly addressed.
