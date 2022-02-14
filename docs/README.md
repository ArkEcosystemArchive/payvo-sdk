# Introduction

## Coins

The **Coin** section will introduce you to Coins. Coins are the most important part of the Platform SDK because they provide all of the core functionality that makes it possible to build a standardized user experience across the board. All of them adhere to the contracts laid out in the [specification](/docs/sdk/specification).

- [ADA](/docs/sdk/coins/ada)
- [ARK](/docs/sdk/coins/ark)
- [ATOM](/docs/sdk/coins/atom)
- [AVAX](/docs/sdk/coins/avax)
- [BTC](/docs/sdk/coins/btc)
- [DOT](/docs/sdk/coins/dot)
- [EGLD](/docs/sdk/coins/egld)
- [EOS](/docs/sdk/coins/eos)
- [ETH](/docs/sdk/coins/eth)
- [LSK](/docs/sdk/coins/lsk)
- [LUNA](/docs/sdk/coins/luna)
- [NANO](/docs/sdk/coins/nano)
- [NEO](/docs/sdk/coins/neo)
- [SOL](/docs/sdk/coins/sol)
- [TRX](/docs/sdk/coins/trx)
- [XLM](/docs/sdk/coins/xlm)
- [XRP](/docs/sdk/coins/xrp)
- [ZIL](/docs/sdk/coins/zil)

## Cryptography

The **Cryptography** section will introduce you to encryption, hashing and identity computation. Cryptography is at the core of everything we do daily at ARK. The cryptography packages are responsible for providing secure encryption of data, hashing of passwords and providing interfaces to interact with common [BIP](https://github.com/bitcoin/bips) functionality like mnemonic generation.

- [Introduction](/docs/sdk/crypto)
- [AES](/docs/sdk/crypto/aes)
- [argon2](/docs/sdk/crypto/argon2)
- [Base64](/docs/sdk/crypto/base64)
- [bcrypt](/docs/sdk/crypto/bcrypt)
- [BIP32](/docs/sdk/crypto/bip32)
- [BIP38](/docs/sdk/crypto/bip38)
- [BIP39](/docs/sdk/crypto/bip39)
- [BIP44](/docs/sdk/crypto/bip44)
- [Hash](/docs/sdk/crypto/hash)
- [HDKey](/docs/sdk/crypto/hdkey)
- [Keychain](/docs/sdk/crypto/keychain)
- [PBKDF2](/docs/sdk/crypto/pbkdf2)
- [UUID](/docs/sdk/crypto/uuid)
- [WIF](/docs/sdk/crypto/wif)

## Internationalization

The **Internationalization** section will introduce you to locale-based functionality. The Internationalization package is responsible for providing a standardized way of handling numbers, dates, time and money so that all of this data can be normalized and displayed in a format that is familiar to the user geolocation.

- [Introduction](/docs/sdk/intl)
- [Currency](/docs/sdk/intl/currency)
- [DateTime](/docs/sdk/intl/datetime)
- [Money](/docs/sdk/intl/money)
- [Numeral](/docs/sdk/intl/numeral)

## Profiles

The **Profiles** section will introduce you to the core of our Desktop & Mobile wallets. The profiles package is the amalgamation of all the Platform SDK components to provide an easy and consistent way of using the SDK in our products.

- [Introduction](/docs/sdk/profiles)
- [Contacts](/docs/sdk/profiles/contacts)
- [Data](/docs/sdk/profiles/data)
- [Environment](/docs/sdk/profiles/environment)
- [Notifications](/docs/sdk/profiles/notifications)
- [Plugins](/docs/sdk/profiles/plugins)
- [Settings](/docs/sdk/profiles/settings)
- [Transactions](/docs/sdk/profiles/transactions)
- [Wallets](/docs/sdk/profiles/wallets)

> The Profiles package is tailored to our specific needs for our products like the Desktop and Mobile wallets. It should only be used as inspiration for your implementation. **Pull Requests that alter its behavior from what it is intended to be for our products will be declined and closed.**

## Utility

The **Utility** section will introduce you to supportive functionality. The packages in this section provide miscellaneous functionality like retrieval of news, working with BigInt, generating QRCodes and more.

- [News](/docs/sdk/news)
- [Helpers](/docs/sdk/helpers)
- [Markets](/docs/sdk/markets)
- [got](/docs/sdk/got)

## Guides

The **Guides** section will provide in-depth explanations as to what you will need to do, how to do it, and what limitations and gotchas there are that need to be kept in mind when developing and testing your integration.

- [Development](/docs/sdk/guides/development)
- [Testing](/docs/sdk/guides/testing)
