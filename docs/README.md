# Introduction

## Coins

The **Coin** section will introduce you to Coins. Coins are the most important part of the Platform SDK because they provide all of the core functionality that makes it possible to build a standardized user experience across the board. All of them adhere to the contracts laid out in the [specification](/specification.md).

- [ADA](/coins/ada.md)
- [ARK](/coins/ark.md)
- [ATOM](/coins/atom.md)
- [AVAX](/coins/avax.md)
- [BTC](/coins/btc.md)
- [DOT](/coins/dot.md)
- [EGLD](/coins/egld.md)
- [EOS](/coins/eos.md)
- [ETH](/coins/eth.md)
- [LSK](/coins/lsk.md)
- [LUNA](/coins/luna.md)
- [NANO](/coins/nano.md)
- [NEO](/coins/neo.md)
- [SOL](/coins/sol.md)
- [TRX](/coins/trx.md)
- [XLM](/coins/xlm.md)
- [XRP](/coins/xrp.md)
- [ZIL](/coins/zil.md)

## Cryptography

The **Cryptography** section will introduce you to encryption, hashing and identity computation. Cryptography is at the core of everything we do daily at ARK. The cryptography packages are responsible for providing secure encryption of data, hashing of passwords and providing interfaces to interact with common [BIP](https://github.com/bitcoin/bips) functionality like mnemonic generation.

- [Introduction](/crypto.md)
- [AES](/crypto/aes.md)
- [argon2](/crypto/argon2.md)
- [Base64](/crypto/base64.md)
- [bcrypt](/crypto/bcrypt.md)
- [BIP32](/crypto/bip32.md)
- [BIP38](/crypto/bip38.md)
- [BIP39](/crypto/bip39.md)
- [BIP44](/crypto/bip44.md)
- [Hash](/crypto/hash.md)
- [HDKey](/crypto/hdkey.md)
- [Keychain](/crypto/keychain.md)
- [PBKDF2](/crypto/pbkdf2.md)
- [UUID](/crypto/uuid.md)
- [WIF](/crypto/wif.md)

## Internationalization

The **Internationalization** section will introduce you to locale-based functionality. The Internationalization package is responsible for providing a standardized way of handling numbers, dates, time and money so that all of this data can be normalized and displayed in a format that is familiar to the user geolocation.

- [Introduction](/intl.md)
- [Currency](/intl/currency.md)
- [DateTime](/intl/datetime.md)
- [Money](/intl/money.md)
- [Numeral](/intl/numeral.md)

## Profiles

The **Profiles** section will introduce you to the core of our Desktop & Mobile wallets. The profiles package is the amalgamation of all the Platform SDK components to provide an easy and consistent way of using the SDK in our products.

- [Introduction](/profiles.md)
- [Contacts](/profiles/contacts.md)
- [Data](/profiles/data.md)
- [Environment](/profiles/environment.md)
- [Notifications](/profiles/notifications.md)
- [Plugins](/profiles/plugins.md)
- [Settings](/profiles/settings.md)
- [Transactions](/profiles/transactions.md)
- [Wallets](/profiles/wallets.md)

> The Profiles package is tailored to our specific needs for our products like the Desktop and Mobile wallets. It should only be used as inspiration for your implementation. **Pull Requests that alter its behavior from what it is intended to be for our products will be declined and closed.**

## Utility

The **Utility** section will introduce you to supportive functionality. The packages in this section provide miscellaneous functionality like retrieval of news, working with BigInt, generating QRCodes and more.

- [News](/utility/news.md)
- [Helpers](/utility/helpers.md)
- [Markets](/utility/markets.md)
- [got](/utility/got.md)

## Guides

The **Guides** section will provide in-depth explanations as to what you will need to do, how to do it, and what limitations and gotchas there are that need to be kept in mind when developing and testing your integration.

- [Development](/guides/development)
- [Testing](/guides/testing)
