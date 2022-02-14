---
title: Introduction
---

# Introduction

## Coins

The **Coin** section will introduce you to Coins. Coins are the most important part of the Platform SDK because they provide all of the core functionality that makes it possible to build a standardized user experience across the board. All of them adhere to the contracts laid out in the [specification](/docs/sdk/specification).

<x-link-collection
    :links="[
        ['path' => '/docs/sdk/coins/ada', 'name' => 'ADA'],
        ['path' => '/docs/sdk/coins/ark', 'name' => 'ARK'],
        ['path' => '/docs/sdk/coins/atom', 'name' => 'ATOM'],
        ['path' => '/docs/sdk/coins/avax', 'name' => 'AVAX'],
        ['path' => '/docs/sdk/coins/btc', 'name' => 'BTC'],
        ['path' => '/docs/sdk/coins/dot', 'name' => 'DOT'],
        ['path' => '/docs/sdk/coins/egld', 'name' => 'EGLD'],
        ['path' => '/docs/sdk/coins/eos', 'name' => 'EOS'],
        ['path' => '/docs/sdk/coins/eth', 'name' => 'ETH'],
        ['path' => '/docs/sdk/coins/lsk', 'name' => 'LSK'],
        ['path' => '/docs/sdk/coins/luna', 'name' => 'LUNA'],
        ['path' => '/docs/sdk/coins/nano', 'name' => 'NANO'],
        ['path' => '/docs/sdk/coins/neo', 'name' => 'NEO'],
        ['path' => '/docs/sdk/coins/sol', 'name' => 'SOL'],
        ['path' => '/docs/sdk/coins/trx', 'name' => 'TRX'],
        ['path' => '/docs/sdk/coins/xlm', 'name' => 'XLM'],
        ['path' => '/docs/sdk/coins/xrp', 'name' => 'XRP'],
        ['path' => '/docs/sdk/coins/zil', 'name' => 'ZIL'],
    ]"
/>

## Cryptography

The **Cryptography** section will introduce you to encryption, hashing and identity computation. Cryptography is at the core of everything we do daily at ARK. The cryptography packages are responsible for providing secure encryption of data, hashing of passwords and providing interfaces to interact with common [BIP](https://github.com/bitcoin/bips) functionality like mnemonic generation.

<x-link-collection
    :links="[
        ['path' => '/docs/sdk/crypto', 'name' => 'Introduction'],
        ['path' => '/docs/sdk/crypto/aes', 'name' => 'AES'],
        ['path' => '/docs/sdk/crypto/argon2', 'name' => 'argon2'],
        ['path' => '/docs/sdk/crypto/base64', 'name' => 'Base64'],
        ['path' => '/docs/sdk/crypto/bcrypt', 'name' => 'bcrypt'],
        ['path' => '/docs/sdk/crypto/bip32', 'name' => 'BIP32'],
        ['path' => '/docs/sdk/crypto/bip38', 'name' => 'BIP38'],
        ['path' => '/docs/sdk/crypto/bip39', 'name' => 'BIP39'],
        ['path' => '/docs/sdk/crypto/bip44', 'name' => 'BIP44'],
        ['path' => '/docs/sdk/crypto/hash', 'name' => 'Hash'],
        ['path' => '/docs/sdk/crypto/hdkey', 'name' => 'HDKey'],
        ['path' => '/docs/sdk/crypto/keychain', 'name' => 'Keychain'],
        ['path' => '/docs/sdk/crypto/pbkdf2', 'name' => 'PBKDF2'],
        ['path' => '/docs/sdk/crypto/uuid', 'name' => 'UUID'],
        ['path' => '/docs/sdk/crypto/wif', 'name' => 'WIF'],
    ]"
/>

## Internationalization

The **Internationalization** section will introduce you to locale-based functionality. The Internationalization package is responsible for providing a standardized way of handling numbers, dates, time and money so that all of this data can be normalized and displayed in a format that is familiar to the user geolocation.

<x-link-collection
    :links="[
        ['path' => '/docs/sdk/intl', 'name' => 'Introduction'],
        ['path' => '/docs/sdk/intl/currency', 'name' => 'Currency'],
        ['path' => '/docs/sdk/intl/datetime', 'name' => 'DateTime'],
        ['path' => '/docs/sdk/intl/money', 'name' => 'Money'],
        ['path' => '/docs/sdk/intl/numeral', 'name' => 'Numeral'],
    ]"
/>

## Profiles

The **Profiles** section will introduce you to the core of our Desktop & Mobile wallets. The profiles package is the amalgamation of all the Platform SDK components to provide an easy and consistent way of using the SDK in our products.

<x-link-collection
    :links="[
        ['path' => '/docs/sdk/profiles', 'name' => 'Introduction'],
        ['path' => '/docs/sdk/profiles/contacts', 'name' => 'Contacts'],
        ['path' => '/docs/sdk/profiles/data', 'name' => 'Data'],
        ['path' => '/docs/sdk/profiles/environment', 'name' => 'Environment'],
        ['path' => '/docs/sdk/profiles/notifications', 'name' => 'Notifications'],
        ['path' => '/docs/sdk/profiles/plugins', 'name' => 'Plugins'],
        ['path' => '/docs/sdk/profiles/settings', 'name' => 'Settings'],
        ['path' => '/docs/sdk/profiles/transactions', 'name' => 'Transactions'],
        ['path' => '/docs/sdk/profiles/wallets', 'name' => 'Wallets'],
    ]"
/>

<x-alert type="warning">
The Profiles package is tailored to our specific needs for our products like the Desktop and Mobile wallets. It should only be used as inspiration for your implementation. **Pull Requests that alter its behavior from what it is intended to be for our products will be declined and closed.**
</x-alert>

## Utility

The **Utility** section will introduce you to supportive functionality. The packages in this section provide miscellaneous functionality like retrieval of news, working with BigInt, generating QRCodes and more.

<x-link-collection
    :links="[
        ['path' => '/docs/sdk/news', 'name' => 'News'],
        ['path' => '/docs/sdk/helpers', 'name' => 'Helpers'],
        ['path' => '/docs/sdk/markets', 'name' => 'Markets'],
        ['path' => '/docs/sdk/got', 'name' => 'got'],
    ]"
/>

## Guides

The **Guides** section will provide in-depth explanations as to what you will need to do, how to do it, and what limitations and gotchas there are that need to be kept in mind when developing and testing your integration.

<x-link-collection
    :links="[
        ['path' => '/docs/sdk/guides/development', 'name' => 'Development'],
        ['path' => '/docs/sdk/guides/testing', 'name' => 'Testing'],
    ]"
/>
