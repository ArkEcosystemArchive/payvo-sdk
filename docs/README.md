# Introduction

## Coins

The **Coin** section will introduce you to Coins. Coins are the most important part of the Platform SDK because they provide all of the core functionality that makes it possible to build a standardized user experience across the board. All of them adhere to the contracts laid out in the [specification](/docs/specification.md).

- [ADA](/docs/coins/ada.md)
- [ARK](/docs/coins/ark.md)
- [ATOM](/docs/coins/atom.md)
- [AVAX](/docs/coins/avax.md)
- [BTC](/docs/coins/btc.md)
- [DOT](/docs/coins/dot.md)
- [EGLD](/docs/coins/egld.md)
- [EOS](/docs/coins/eos.md)
- [ETH](/docs/coins/eth.md)
- [LSK](/docs/coins/lsk.md)
- [LUNA](/docs/coins/luna.md)
- [NANO](/docs/coins/nano.md)
- [NEO](/docs/coins/neo.md)
- [SOL](/docs/coins/sol.md)
- [TRX](/docs/coins/trx.md)
- [XLM](/docs/coins/xlm.md)
- [XRP](/docs/coins/xrp.md)
- [ZIL](/docs/coins/zil.md)

## Cryptography

The **Cryptography** section will introduce you to encryption, hashing and identity computation. Cryptography is at the core of everything we do daily at ARK. The cryptography packages are responsible for providing secure encryption of data, hashing of passwords and providing interfaces to interact with common [BIP](https://github.com/bitcoin/bips) functionality like mnemonic generation.

- [Introduction](/docs/crypto.md)
- [AES](/docs/crypto/aes.md)
- [argon2](/docs/crypto/argon2.md)
- [Base64](/docs/crypto/base64.md)
- [bcrypt](/docs/crypto/bcrypt.md)
- [BIP32](/docs/crypto/bip32.md)
- [BIP38](/docs/crypto/bip38.md)
- [BIP39](/docs/crypto/bip39.md)
- [BIP44](/docs/crypto/bip44.md)
- [Hash](/docs/crypto/hash.md)
- [HDKey](/docs/crypto/hdkey.md)
- [Keychain](/docs/crypto/keychain.md)
- [PBKDF2](/docs/crypto/pbkdf2.md)
- [UUID](/docs/crypto/uuid.md)
- [WIF](/docs/crypto/wif.md)

## Internationalization

The **Internationalization** section will introduce you to locale-based functionality. The Internationalization package is responsible for providing a standardized way of handling numbers, dates, time and money so that all of this data can be normalized and displayed in a format that is familiar to the user geolocation.

- [Introduction](/docs/intl.md)
- [Currency](/docs/intl/currency.md)
- [DateTime](/docs/intl/datetime.md)
- [Money](/docs/intl/money.md)
- [Numeral](/docs/intl/numeral.md)

## Profiles

The **Profiles** section will introduce you to the core of our Desktop & Mobile wallets. The profiles package is the amalgamation of all the Platform SDK components to provide an easy and consistent way of using the SDK in our products.

- [Introduction](/docs/profiles.md)
- [Contacts](/docs/profiles/contacts.md)
- [Data](/docs/profiles/data.md)
- [Environment](/docs/profiles/environment.md)
- [Notifications](/docs/profiles/notifications.md)
- [Plugins](/docs/profiles/plugins.md)
- [Settings](/docs/profiles/settings.md)
- [Transactions](/docs/profiles/transactions.md)
- [Wallets](/docs/profiles/wallets.md)

> The Profiles package is tailored to our specific needs for our products like the Desktop and Mobile wallets. It should only be used as inspiration for your implementation. **Pull Requests that alter its behavior from what it is intended to be for our products will be declined and closed.**

## Utility

The **Utility** section will introduce you to supportive functionality. The packages in this section provide miscellaneous functionality like retrieval of news, working with BigInt, generating QRCodes and more.

- [News](/docs/utility/news.md)
- [Helpers](/docs/utility/helpers.md)
- [Markets](/docs/utility/markets.md)
- [got](/docs/utility/got.md)

## Guides

The **Guides** section will provide in-depth explanations as to what you will need to do, how to do it, and what limitations and gotchas there are that need to be kept in mind when developing and testing your integration.

- [Development](/docs/guides/development)
- [Testing](/docs/guides/testing)
