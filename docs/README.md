# Introduction

## Coins

The **Coin** section will introduce you to Coins. Coins are the most important part of the Platform SDK because they provide all of the core functionality that makes it possible to build a standardized user experience across the board. All of them adhere to the contracts laid out in the [specification](/specification).

- [ADA](/coins/ada)
- [ARK](/coins/ark)
- [ATOM](/coins/atom)
- [AVAX](/coins/avax)
- [BTC](/coins/btc)
- [DOT](/coins/dot)
- [EGLD](/coins/egld)
- [EOS](/coins/eos)
- [ETH](/coins/eth)
- [LSK](/coins/lsk)
- [LUNA](/coins/luna)
- [NANO](/coins/nano)
- [NEO](/coins/neo)
- [SOL](/coins/sol)
- [TRX](/coins/trx)
- [XLM](/coins/xlm)
- [XRP](/coins/xrp)
- [ZIL](/coins/zil)

## Cryptography

The **Cryptography** section will introduce you to encryption, hashing and identity computation. Cryptography is at the core of everything we do daily at ARK. The cryptography packages are responsible for providing secure encryption of data, hashing of passwords and providing interfaces to interact with common [BIP](https://github.com/bitcoin/bips) functionality like mnemonic generation.

- [Introduction](/crypto)
- [AES](/crypto/aes)
- [argon2](/crypto/argon2)
- [Base64](/crypto/base64)
- [bcrypt](/crypto/bcrypt)
- [BIP32](/crypto/bip32)
- [BIP38](/crypto/bip38)
- [BIP39](/crypto/bip39)
- [BIP44](/crypto/bip44)
- [Hash](/crypto/hash)
- [HDKey](/crypto/hdkey)
- [Keychain](/crypto/keychain)
- [PBKDF2](/crypto/pbkdf2)
- [UUID](/crypto/uuid)
- [WIF](/crypto/wif)

## Internationalization

The **Internationalization** section will introduce you to locale-based functionality. The Internationalization package is responsible for providing a standardized way of handling numbers, dates, time and money so that all of this data can be normalized and displayed in a format that is familiar to the user geolocation.

- [Introduction](/intl)
- [Currency](/intl/currency)
- [DateTime](/intl/datetime)
- [Money](/intl/money)
- [Numeral](/intl/numeral)

## Profiles

The **Profiles** section will introduce you to the core of our Desktop & Mobile wallets. The profiles package is the amalgamation of all the Platform SDK components to provide an easy and consistent way of using the SDK in our products.

- [Introduction](/profiles)
- [Contacts](/profiles/contacts)
- [Data](/profiles/data)
- [Environment](/profiles/environment)
- [Notifications](/profiles/notifications)
- [Plugins](/profiles/plugins)
- [Settings](/profiles/settings)
- [Transactions](/profiles/transactions)
- [Wallets](/profiles/wallets)

> The Profiles package is tailored to our specific needs for our products like the Desktop and Mobile wallets. It should only be used as inspiration for your implementation. **Pull Requests that alter its behavior from what it is intended to be for our products will be declined and closed.**

## Utility

The **Utility** section will introduce you to supportive functionality. The packages in this section provide miscellaneous functionality like retrieval of news, working with BigInt, generating QRCodes and more.

- [News](/news)
- [Helpers](/helpers)
- [Markets](/markets)
- [got](/got)

## Guides

The **Guides** section will provide in-depth explanations as to what you will need to do, how to do it, and what limitations and gotchas there are that need to be kept in mind when developing and testing your integration.

- [Development](/guides/development)
- [Testing](/guides/testing)
