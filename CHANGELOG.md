# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.7.7] - 2021-09-20

### Fixed

- Mark fees as size-based (#222) ([c3bad3a](c3bad3a53b76e4ced07eae32c77a5ebe6101ce75))

## [1.7.6] - 2021-09-16

### Added

- Add `unlockToken` transaction feature flag (#221) ([ae4709d](ae4709d568a2d36a0588c18e66651b02ba5eefa4))

### Changed

- Update `@payvo/cryptography` dependency (#220) ([c24eb96](c24eb96abf1dffa84af368fca620a993a678deed))

## [1.7.4] - 2021-09-15

### Changed

- Calculate amount of `unlockToken` confirmed transaction (#218) ([65d5d2e](65d5d2e9e1d8e3c04e07d56f0d6e733d60433c15))

## [1.7.3] - 2021-09-14

### Changed

- Calculate amount of `unlockToken` transaction (#216) ([2e6fd47](2e6fd4716b1a48da1b5a12b8caf9f9a9fae38a98))

## [1.7.2] - 2021-09-13

### Added

- Add `unlockToken` type to transaction serializer test (#215) ([6ba2d73](6ba2d7365c2a9e09ebe3fa3dbe332738f9d5d72e))

### Changed

- Rename `unlockBalance` to `unlockToken` (#214) ([b149f60](b149f60eeeb0fea77abf313cb78a54c4ffd4faa0))

## [1.7.0] - 2021-09-13

### Changed

- Adjust jest config and exception handling (#213) ([2e20aea](2e20aea3f562364bd248a7dd023007cd242e99cd))

### Fixed

- Persist `toMachine` mutations for `unlockToken` transaction (#212) ([05ff47e](05ff47e4b6816d3e0ff6626702fe5404b2a22439))

## [1.6.54] - 2021-09-10

### Changed

- Update changelog ([5c42397](5c42397a8506eb7c45faed3dcd385de733bbe514))

### Fixed

- Pagination construction ([f8b1816](f8b1816b04408066ac5b0a651efbcabf1768a47f))

## [1.6.53] - 2021-09-10

### Added

- Add unlockToken transaction type (#209) ([298aa90](298aa90b147effca72dd5eaf7ff287738844b906))

### Changed

- Update explorer url ([952b639](952b6397f87cab93885c32203e4403f852054cf1))
- Invert production/legacy conditions (#211) ([ad8201c](ad8201c6b822d441a0b3a090ce0510704f13078e))

## [1.6.50] - 2021-09-09

### Added

- Implement `Network#usesLockedBalance` ([b468042](b4680424bbc8a3c7f12fa4a160ba795beab0d64f))

### Fixed

- Update musig type ([9821292](98212928f7244a37187a557aea8c197ab897489f))

## [1.6.48] - 2021-09-08

### Added

- Stub signatory ([6507771](6507771ca2c5720b46c227dd42c1a95a33375435))

## [1.6.47] - 2021-09-07

### Added

- Calculate fee from signed transaction data (#206) ([860cc64](860cc649f36cdad397773a5f5851de415d6b1195))
- Calculate transaction fee from signed transaction (#207) ([03011a9](03011a9f149134bcddc50cbe2058276370e4d9d3))

### Fixed

- Unlocking prop missing in accounts response (#203) ([eadb95b](eadb95be0a005e8e064d251fa6db37ff6b76123e))

## [1.6.44] - 2021-09-07

### Fixed

- Figure out what constructor to use ([5a68ef2](5a68ef2dbe5dfab045bd73a3bc5d737ccf77ba64))

## [1.6.43] - 2021-09-07

### Added

- Implement `TransactionService#transfer` (#178) ([0297fe7](0297fe7f75b2baa1b64d8e4d992ad8dd2e9efb27))

### Changed

- Remove duplicate musig signatures (#202) ([aa7ca00](aa7ca009c5620e19d4a20af5a2d9cb0551b79f92))

## [1.6.41] - 2021-09-02

### Added

- Add development notes (#179) ([911b8bc](911b8bc3f14c3517cd5e8d0600267ee419e76f1b))
- Expose `SignedTransactionData#memo` (#194) ([b813a3f](b813a3fae1fd2ce189e14313216181091973e217))

### Changed

- Update all dependencies to their latest version (#177) ([377a37e](377a37e85745e27561c0a8a0314bee76e3801d23))

### Fixed

- Default votes to empty array on wallet without votes (#193) ([3e1644e](3e1644ea05c0e0d4330cbc74453dc2d7dc54f4eb))

## [1.6.39] - 2021-08-30

### Fixed

- Locked is already subtracted by API ([7cae54f](7cae54fa19d3c4de82a9c6214d7ee8874076a385))

## [1.6.38] - 2021-08-30

### Fixed

- Adjust sender expectation ([09935d4](09935d40fefc3d4c13cdc844b162e72fb0847c5f))
- Prefix unvotes with minus symbol ([c64b728](c64b728afd5f0c29a54b5b66030b23a9865c072d))

## [1.6.37] - 2021-08-30

### Fixed

- Return sender address instead of public key ([d03ff13](d03ff13e2bb18b443437d73da2a58e130a403dd3))

## [1.6.36] - 2021-08-27

### Fixed

- Recipient address format and musig identification ([7370ad0](7370ad06b5a2c4ef6289eb3f3b46cff704f735e8))

## [1.6.35] - 2021-08-26

### Fixed

- Only support extended public key with depth 3 (#175) ([ec03d68](ec03d688c52b0097755a78dc3f12a1de7d5394db))
- Increase coverage (#176) ([3035475](30354752a38e88481465af44c570ca92b561a1b5))

## [1.6.34] - 2021-08-25

### Fixed

- Derive public key for address before deriving address (#174) ([c1595d0](c1595d0bdc901810f03e36704261035d4cc9d6c1))

## [1.6.32] - 2021-08-25

### Fixed

- Use bignum to sum up locked balances ([3bb7f09](3bb7f092af9337213dbc659bddf75cb613416620))

## [1.6.31] - 2021-08-25

### Changed

- Enable bip39 encryption ([bd1a0ee](bd1a0ee41142d133e8b31509fd58943de503999e))

## [1.6.30] - 2021-08-25

### Fixed

- Handle extended public key derivation for addresses (#173) ([eabcb68](eabcb688f1e492e0ac4865f93f3b444dc2a4463f))

## [1.6.29] - 2021-08-24

### Added

- Expose vote amount step, minimum and maximum ([bd0d3b4](bd0d3b4886ebdea544aceba5e360c571a1f0260e))

## [1.6.28] - 2021-08-24

### Fixed

- Update snapshots ([31a60e4](31a60e48871e67b9d91a4222740d05ef799bb1e1))
- Reset syncing status and rethrow exception on error (#172) ([84fbeed](84fbeed65bfe74ca62488a27f8b98c3ce5151679))

## [1.6.27] - 2021-08-23

### Changed

- Update bind musig hosts ([d6e377f](d6e377f8ecd0663763379c7287140feff2b953fa))

## [1.6.26] - 2021-08-23

### Fixed

- Expose transaction asset (#170) ([6a318b9](6a318b9bd429a08c9a27ed3b9f30a27172cbc0d4))
- Expose confirmation status (#171) ([9c3bc0e](9c3bc0e8bebbd574a5eef5174f0dc8b8261e81db))

## [1.6.24] - 2021-08-23

### Added

- Add private and public key fixtures (#168) ([8dcc2c9](8dcc2c9902ca836cd981605067dfe9915521aa65))

### Fixed

- Ensure network configuration is used for extended public key derivation (#166) ([ec148e5](ec148e5c2df3e1950b807bc2cd55a8acbe296638))
- Handle legacy BIP44 derivation (#167) ([1082af3](1082af3b117226dec6ce27d5db4c883384e83725))
- Handle new musig transaction asset (#169) ([54794e4](54794e4bd0871fb4097eb60a2bab035698465f0e))

## [1.6.21] - 2021-08-23

### Changed

- Update cryptography dependency (#165) ([5dcb6a8](5dcb6a83d15c927c82c7d0408943d386eadfdd2e))

## [1.6.20] - 2021-08-20

### Changed

- Update @payvo/cryptography dependency (#163) ([eeaabcb](eeaabcb1d08aa2d5dd750e7695e0695fd50d707f))

## [1.6.19] - 2021-08-20

### Fixed

- Bind bitcoin wallet discovery service (#162) ([f0bde82](f0bde825886db489f2c3fdf65f77b4e59a845480))

## [1.6.18] - 2021-08-20

### Changed

- Update cryptography dependencies (#161) ([0aaa019](0aaa019e1c65dba7602f3437a2b5d1c1ad813955))

## [1.6.17] - 2021-08-19

### Added

- Implement `ExtendedPublicKeyService` (#160) ([c568dea](c568dea0204c6840a1b7f6263538fd1bbe5dbf11))

### Fixed

- Tests for wallet discovery service (#153) ([fce6491](fce649134cda8e63d52bc248b86719baf39b1511))

## [1.6.16] - 2021-08-19

### Fixed

- Await ledger opening ([685a254](685a2543ab0a9c1ff55d1364b09fc0418b4b237f))

## [1.6.15] - 2021-08-19

### Changed

- Detect `TransportReplayer` based on class constructor (#159) ([a39ca92](a39ca9242e04d8b2e48e1cf2acbf1fcab9680e3b))

## [1.6.14] - 2021-08-19

### Added

- Implement BIP44/49/84 address derivation (#156) ([58dc2a8](58dc2a83afeedc4cf44f1b7aa900fd3c6d5e3fd8))

### Changed

- Remove duplicate unbind statements in coin (#154) ([679b09d](679b09d18013e1f093e162e39bb4872d4a808ed0))
- Replace deprecated `createTransportReplayer` with `openTransportReplayer` (#155) ([8b0c19e](8b0c19eee59e559eb3adb5f1c4c89723012cf370))
- Store identity options on signatory (#157) ([166fae5](166fae50cdfa915f97d751a614df8c93854c5ad0))
- Extract `IdentityLevel` interface (#158) ([d69b44c](d69b44c76c502ea93be8e2b47443dc9d893dd2e5))

## [1.6.9] - 2021-08-18

### Changed

- Set expiration to 24 hours for musig transactions (#152) ([1e714bb](1e714bb457085757fc0d6194c3c34cb190929fb4))

## [1.6.8] - 2021-08-18

### Fixed

- Properly format ledger derivation path ([762b32c](762b32cda8ceb929ac66a9c0d271f9c35fb5f7ae))

## [1.6.7] - 2021-08-18

### Changed

- Update dependencies (#150) ([e36913a](e36913ad1542f4fecfd0a712209dc18bdceb3d7b))
- Update ledger dependencies (#151) ([e0a1df7](e0a1df7d9702d87271fb57123aa10d5337e42eca))

### Fixed

- Normalise transaction before calculating fee (#149) ([cbf8a7d](cbf8a7d39a8844756ea922ca8ab27b64646eaa33))

## [1.6.4] - 2021-08-11

### Added

- Address parameter mapping (#147) ([090b2e3](090b2e360b5c9bc6784bc07d3527e271ccca0082))

### Changed

- Calculate `ConfirmedTransactionData#isReturn` based on transaction type (#146) ([daf9254](daf9254ee4aee6b1d80be8e3895fd1c2b90fd66d))

## [1.6.2] - 2021-08-11

### Fixed

- Handle vote when is not inside the `attributes` property (#144) ([b99357c](b99357cd087189df4508788edbfcc9ab406ab673))
- Mapping of possibly undefined array (#145) ([c745396](c745396b8d2e6d464daf4e6b60a7368be421bccb))

## [1.6.0] - 2021-08-06

### Added

- Fetch wallet balance using wallet pub key (#138) ([5de600a](5de600a7cdcbcb80c9f99c91e9165b610077d173))

### Changed

- Remove IPFS transaction for Compendia networks (#140) ([c4e85b3](c4e85b31c74fbc4588f2b16b769936445c6f79b2))
- Introduce `WalletIdentifier` as input (#141) ([453fa4a](453fa4a2d760fcb562b3826a4c8d4645a46be219))
- Limit `WalletIdentifier` values ([4a10bff](4a10bff1add6a19755c1014f64a87ccc4635b2b3))
- Use `WalletIdentifier` for addresses (#142) ([cfda76a](cfda76a6859c9730f3c27bbb0b070b739e7d0714))
- Remove deprecated input arguments (#143) ([7f8f7fa](7f8f7fa43552c8b818274479b0ec7da2155b108f))

## [1.5.16] - 2021-08-05

### Changed

- Push directly to master after increasing version ([b01eb21](b01eb2181dd1768813b26642e9cefb9660fc9a3a))
- Update BIND manifests (#139) ([41f0637](41f06376b28e41ac63b6517164f3a28d62358964))

## [1.5.15] - 2021-08-04

### Added

- Uses extended public key (#136) ([9fc616e](9fc616ebe24ea91b2ceb701685f52e724e67b879))

### Changed

- Fetch wallet data by multiple addresses (#135) ([729adee](729adeea19b2097e7aa8ee36664b5bc85fec709e))

## [1.5.13] - 2021-08-03

### Added

- Wallet transactions (#132) ([19708fa](19708faad1f93ac036dafe750fb048724658dc09))

### Fixed

- Use correct properties in DTOs (#125) ([869db5e](869db5e635ef54348c7bd783746d055c5a67360a))

## [1.5.11] - 2021-08-02

### Fixed

- 3 participant fee ([7066650](7066650a6cacf70c55583a86b866e2fafbd1139e))

## [1.5.10] - 2021-08-02

### Fixed

- Correct musig fee calculation ([0c815b0](0c815b0bd87a2fb6ea983668cf5abf2abeae32dc))

## [1.5.9] - 2021-08-02

### Added

- Implement multi-signature fee calculation (#128) ([1bf9985](1bf9985110e7b0f09a79c6d9d0ce52db758e5a29))

### Fixed

- Urls for payvo bitcoin servers (#127) ([b4da5c6](b4da5c6750838c5b4b965e8ede03fb7cfe465c24))

## [1.5.7] - 2021-07-30

### Changed

- Update manifests ([b78e79e](b78e79e66867cc8651892895bcc7cad6623758be))

### Fixed

- Response wrapped in data element (#124) ([817e0e1](817e0e12777267812b627b000263abf884d80a78))

## [1.5.6] - 2021-07-29

### Fixed

- Resolve ledger signature (#122) ([bb3502c](bb3502c84c14b4a3e15d6ff875a801f1b40541b9))

## [1.5.5] - 2021-07-29

### Fixed

- Prevent signing of multi-signature registration with ledger (#120) ([658ca7a](658ca7af65e2d7398a232d54b11c3777b6b76057))

## [1.5.4] - 2021-07-29

### Changed

- Cleaner timestamp calculation for unlocks (#117) ([932a3cd](932a3cd9ae3664fb59ac3e11d1307499940e3b2b))

### Fixed

- Handle missing compendia fees (#118) ([e6f1990](e6f19901ab9ac25ff9594a8d086ffe0fed45cbe1))

## [1.5.2] - 2021-07-28

### Fixed

- Update snapshots ([87eef3a](87eef3a676985fb4a9e7e80fdc23f7baa80656ef))
- Derive address if multi-signature asset is available (#115) ([3677a40](3677a407db1d630c58af743c02b6b6b434645a40))

## [1.5.1] - 2021-07-28

### Added

- Implement unlockable balances (#113) ([ae0d1b4](ae0d1b4fb053aa4d3b6009636c58b2d7fa03919a))

## [1.5.0] - 2021-07-28

### Changed

- Remove testnet conditions and flags (#110) ([8fd7b0c](8fd7b0c7cc3c2bdd049cd3246e3812842c75fd15))

### Fixed

- Derive sender public key based on input (#111) ([03dea95](03dea954b02284ab07598d1384fdb019fa42e8d2))

## [1.4.1] - 2021-07-27

### Fixed

- Reintroduce `MultiSignatureSignatory` (#108) ([4523cd5](4523cd5c913895157e07ea1a9bb20a0854285e7e))

## [1.4.0] - 2021-07-27

### Changed

- Rename `Secondary` to `Confirmation` (#105) ([a0a4227](a0a4227873a81fb9b67d7aff07981aed03feb2d5))
- Remove deprecated signatories (#106) ([187f6c9](187f6c9f21b57502177df99da2f663a55ab5bbe9))

### Fixed

- Get adress with with secondary wif (#104) ([a919f85](a919f85f5b57900cd664a7ab574d31503ea3a28a))
- Adjust WIF tests ([f6fc0bd](f6fc0bd12d62624aeedeb0a893cc377c769e0dcb))

## [1.3.28] - 2021-07-26

### Added

- Add signature if multi signature registration is created (#102) ([e29da11](e29da110522f35b955e2e5dee751d75e69089412))

## [1.3.27] - 2021-07-26

### Added

- Add `multiSignature` property for signatories (#98) ([4451093](445109359e6eb3aef7bac31c43c0c89d7eae137f))

## [1.3.26] - 2021-07-26

### Fixed

- Skip second mnemonic if it isn't the final signature (#99) ([e8c5e6b](e8c5e6b563e6a7ecc58de2b0a3c2334e6e68a62f))

## [1.3.25] - 2021-07-22

### Added

- Implement `MultiSignatureService#forgetById` (#96) ([ac02849](ac028493d1b891ae4ee00aa2febf3acddc225248))

## [1.3.24] - 2021-07-21

### Added

- Indicate `FeeService#calculate` support (#94) ([1efb705](1efb705e5be5ce2f5b7a882b2fbf64f5ceb6432d))

### Changed

- Calculate transaction fee if none is provided (#93) ([a063a0b](a063a0bf9c0b7064cfc869c93413dd0d9d3fccb5))

## [1.3.22] - 2021-07-21

### Added

- Implement transaction fee calculation (#91) ([74d096a](74d096ad48d8da56d4233e2590c7d1629dc5226f))

## [1.3.21] - 2021-07-21

### Added

- Expose multi-signature type (#88) ([c4a8ccd](c4a8ccddb4f00acc572e5a0fe4a3e1f66ee50016))

### Fixed

- Use input fee (#89) ([ac20eda](ac20edab5740270f093edab31f29acb9964b1e67))

## [1.3.19] - 2021-07-21

### Changed

- Update hosts for ARK and LSK (#83) ([8fd2fd9](8fd2fd9af86da877f8c22cada2ad1299efcdd99b))

## [1.3.18] - 2021-07-20

### Changed

- Update dependencies (#84) ([0604f3b](0604f3ba4b40e010d9efa4638ea469889786bfbe))
- Update BIND manifests (#85) ([5c4765b](5c4765b6a4b2ee0aa714870e150e3464ccac1c04))

## [1.3.17] - 2021-07-20

### Changed

- Use JSON-RPC calls for MuSig server ([a235038](a235038e0b2ea90ec66d70c7ff70c433361bf8a2))

## [1.3.16] - 2021-07-20

### Removed

- Remove extraneous timestamp ([8790674](87906741f286cf6bca8a4678edc2520df033bdd9))

## [1.3.15] - 2021-07-20

### Changed

- Further normalise data (#77) ([b1c4c32](b1c4c32b6ca32e6e8ae150ef540e611b62269c9d))
- Update multi-signature interface (#79) ([c729883](c729883fc8d4bce5507ee239ff07b48c7bdd7247))

### Fixed

- Adjust balance lookup for wallets with missing balance (#78) ([2368ebe](2368ebe08e2b1243fd5c91df282d9ffca72358e3))

## [1.3.12] - 2021-07-19

### Fixed

- Always return boolean from `isMultiSignature` (#75) ([7fca78b](7fca78bf3790ce5780409adb003e0254884af6b8))

## [1.3.11] - 2021-07-19

### Fixed

- Return 0 as nonce if mainnet is used ([64d24d2](64d24d2263a76c5d3e8381bafb65977f8e206ec2))

## [1.3.10] - 2021-07-19

### Fixed

- Handle 400 response errors ([41d73be](41d73befc0b18d8ff1ba8f72171a81b2bb1884d3))

## [1.3.9] - 2021-07-19

### Fixed

- Use `multiSignature` instead of `multisigAsset` ([96d87cd](96d87cdf52797914a2e14c995ab43447213745f3))

## [1.3.8] - 2021-07-19

### Fixed

- Normalise multi-signature transactions (#70) ([8fb03af](8fb03afa67c0278c803079c27daa53cc6d70fe47))

## [1.3.7] - 2021-07-19

### Changed

- Humanize signed transaction data (#68) ([ead476c](ead476ce349bc3ac3b81794137dbb3df5a8828b0))

## [1.3.6] - 2021-07-19

### Added

- Add basic coverage for multi-signature signing (#66) ([8bd02a6](8bd02a68333e19172941b32f723ddecb3696ed6c))

## [1.3.5] - 2021-07-19

### Changed

- Improve `usesMultiSignature` checks (#64) ([2f20893](2f2089364dabb8d97f737104a3337ae1c05e2b64))

## [1.3.4] - 2021-07-19

### Changed

- Clean up broadcasting implementation (#59) ([04a7d3c](04a7d3c49cef2dc2548149f2dfd77bb9b625bae8))

### Fixed

- Coverage for `SignedTransactionData` (#60) ([42e877d](42e877daeb89565c922de2fcce09f475f4956182))
- Coverage for `AssetSerializer` (#61) ([61f0965](61f0965ffc59b1218170de351cd1757ac2e7c5c6))
- Coverage for `TransactionSerializer` (#62) ([b0a0653](b0a06538c7803983f3493428e7d4712583725d8f))

## [1.3.3] - 2021-07-18

### Fixed

- Use post request response object ([d905960](d905960cfb204ebe99b23d40c2c6b95f6eb75845))
- Turn transaction into hex before broadcasting ([ee1ab76](ee1ab76a28a3a116eb8429b0e0f1dad2c75fec67))

## [1.3.1] - 2021-07-18

### Fixed

- Correct handling of multi-signature transaction signing ([b5debfd](b5debfd6f33f44d1623b52a2e74d5a870a9485ce))

## [1.3.0] - 2021-07-18

### Added

- Implement multi-signature signing (#49) ([836b407](836b4074e869f07270185e41068ddd4e244f0d7f))
- Add coverage for `PendingMultiSignatureTransaction` (#53) ([8323419](83234199f75cd17c8caa77f4dd7453cc40e9da9a))

### Changed

- Remove duplicate function in paginator (#48) ([0d4ff14](0d4ff14cbda58af88eb260ae6598044279b631ad))
- Implement `MultiSignatureService#addSignature` method (#50) ([f5e386c](f5e386ce662695c729121dcb05d7feb2f3059fe8))
- Update `WalletMultiSignature` interface (#52) ([b3ac1a6](b3ac1a69a2964d63371685918129aacf5d1f9ff8))
- Use JSON-RPC for multi-signature service (#54) ([45a30a1](45a30a1d9417c8c0e458127d3040e5ccb62d5dba))
- Format asset according to the transaction type (#55) ([09d8b55](09d8b5547ae75cea468aded1613a302bd3ba03b9))

### Fixed

- Prevent votes with amounts that are not multiple of 10 ([848c599](848c599fea9fabf6650c2b97556279c28ba42270))

## [1.2.1] - 2021-07-13

### Changed

- Deprecate `@payvo/sdk-http-got` (#46) ([873a2cd](873a2cd9f0603dd59c01c95cff7ebdaf58f3b4fa))

## [1.2.0] - 2021-07-13

### Changed

- Deprecate `@payvo/sdk-profiles` (#43) ([784c2e8](784c2e8aa0f1802cd290366eacd402427f09032c))
- Move HTTP foundation into `sdk` (#44) ([1263937](126393770e411870dd7eab90ec16ea0cca74aa05))
- Deprecate `@payvo/sdk-cli` ([a63b87b](a63b87bc5b45817ea63b02c7bfe11f0a19e0815f))

## [1.1.20] - 2021-07-13

### Fixed

- Use `coinName` in `Network#displayName` (#41) ([dee4956](dee4956e4ff7f5a82bb7facaa060d79885f80536))

## [1.1.19] - 2021-07-12

### Added

- Expose if a fee is dynamic (#39) ([9311321](93113219eb24e0564949ff3340b0919e2d4ce316))

### Changed

- Update banners ([670887e](670887e5a3217cd3b93c3ac8fab5a630a7185a31))
- Update README banner ([9002a81](9002a810fb46504811334a25e16608855b79397f))
- Reduce complexity of notification transaction lookups (#38) ([aef20c0](aef20c0e999245e33df52415018f13ebf7ba9d2c))

## [1.1.17] - 2021-07-11

### Added

- Implement `IProfileTransactionNotifications#isSyncing/markAllAsRead` (#35) ([f1f4b35](f1f4b354c9d39c65e7cab042808d1aad94f8f092))

## [1.1.16] - 2021-07-11

### Fixed

- Normalise vote amount ([6ee47ff](6ee47ff3433c2d310f3cdd32837db888a2cebe50))

## [1.1.15] - 2021-07-11

### Changed

- Allow modification of raw data in migrator (#32) ([0c874da](0c874da043030d1ae0429db0dd5eb3a1219be00d))

## [1.1.14] - 2021-07-11

### Added

- Indicate if the voting process requires an amount ([1559c8c](1559c8c9dfe5edb8109e9364f2a7d21220693fbe))

### Changed

- Return amount that was used for vote (#30) ([8f39389](8f39389a5ff423c455ec2b641d899be8308a5664))
- Update manifest ([e8b0651](e8b065100860512818fb9977fdfe8db237221188))

## [1.1.11] - 2021-07-09

### Added

- Add missing coverage ([3fcfdc9](3fcfdc9f85cf309b287985ca089b6d00911855b5))
- Store and expose notification transactions (#26) ([305a9f5](305a9f5e9e37c22666cb66dd9ca8933df619d943))

## [1.1.10] - 2021-07-09

### Added

- Expose delegate identifier for governance/voting ([a6715f8](a6715f8747b0ab26122c20930f725c5b35893d63))

## [1.1.9] - 2021-07-09

### Fixed

- Adjust vote count ([24e0a3d](24e0a3d06158fd2090e70d3311de9dd42a947238))

## [1.1.8] - 2021-07-09

### Fixed

- Only process votes and unvotes if present ([04d724a](04d724a2a873314f8f08e6b5930269339f008f98))

## [1.1.7] - 2021-07-09

### Changed

- Attempt to find delegate by address or public key ([e7ced9c](e7ced9c1cedc014646f8de59764230bc604ace52))

### Fixed

- Use `delegateAddress` property ([dadb0e6](dadb0e676c98f31f40ffda69559d62e09106c553))

## [1.1.6] - 2021-07-09

### Fixed

- Handle new wallets and signed ID conversion ([8827532](8827532fab69748eb4d5fee3d015f2a3698fe232))

## [1.1.5] - 2021-07-09

### Fixed

- Update snapshots ([a748ebc](a748ebcd7184c8b1064d27b93e66bf42a8ec2b2d))
- Filter all votes that do not start with a minus ([ab9ddd9](ab9ddd9d27970c6a9e96c9b0f01e5f37068573ad))

## [1.1.4] - 2021-07-09

### Fixed

- Expose more methods from notifications service (#17) ([9cfd215](9cfd2151192bbf03f4931d1e23ddf0cb86e0bab2))

## [1.1.3] - 2021-07-09

### Fixed

- Return 0 if amount is not available ([7c9935a](7c9935a7416fa0d50ccbb7e0e5872dd5be9f104b))

## [1.1.2] - 2021-07-09

### Fixed

- Read 3.0 properties for transaction DTO ([5c2246a](5c2246a759fd76aa610750ecb6cc062b59a0b6a8))

## [1.1.1] - 2021-07-09

### Added

- Add support for voting with 3.0 (#15) ([e4fc1ff](e4fc1ff8356465119bf97dd4694b562f12390e00))
- Add support for delegate registration with 3.0 (#16) ([8c58e96](8c58e9689a9893cbae44eed5566f7415d5d27412))

### Changed

- Require `id` and `amount` for votes (#13) ([a46d991](a46d991ea098b84e09c947baa6220accca128a3b))
- Deprecate `@payvo/sdk-ark-musig` ([53b8d25](53b8d2518bd04aefcf802ae98021113f7c2c3737))
- Deprecate `@payvo/sdk-markets` ([1ee2677](1ee26775844511014b6276aa440bc87200add18d))
- Deprecate `@payvo/sdk-news` ([5468656](54686569e61d5015299ec025ea407c4d5ec553b7))
- Update lockfiles ([f00d8eb](f00d8eb15bb30539dc061908fbde059a881ef130))
- Swap testnet archival host ([67f6658](67f66584910f85e0107ede78730373df45a2dd16))

### Fixed

- Properly cast 2.0 votes ([a808cf2](a808cf29784bb8ac0f321712aea5e937b00b9217))
- Properly cast 3.0 votes ([5e97665](5e9766510cbb48c7793160ee947818ee8e6975fe))

## [1.0.7] - 2021-07-09

### Fixed

- Return timestamp for testnet transactions ([6a6ce39](6a6ce396dc335d83832ad01a5a37edbc58f7ff06))

## [1.0.6] - 2021-07-09

### Added

- Add support for 3.0 API endpoints (#10) ([cf4d654](cf4d654766d5435aa5eca5b8b29e918051a300ac))

### Fixed

- Update snapshots ([ceb28b6](ceb28b652e7285709f44459dd94181adc6283cc9))

## [1.0.5] - 2021-07-09

### Added

- Add support for 3.0 address derivation, explorer and transfer signing (#8) ([70dfb77](70dfb776c9587cc042136f49d62968edf7cbe9b8))
- Initial implementation of notifications service (#4) ([cfacc46](cfacc468041988e945fd67ccb0008a64d1e67145))

## [1.0.3] - 2021-07-08

### Changed

- Update explorer links (#6) ([aee853b](aee853b9e749c479607876c871e8047d59404a90))

## [1.0.2] - 2021-07-08

### Added

- Add accent color setting key (#3) ([fb62566](fb62566a8664945e0c3116de4a60e45ab77628c5))

## [1.0.1] - 2021-07-07

### Changed

- Deprecate `@payvo/sdk-zil-indexer` ([1ceae07](1ceae07a620052c3135e855fb0a003a8d0e154f0))
- Deprecate `@payvo/sdk-eth-indexer` and `@payvo/sdk-eth-server` ([0a75c6d](0a75c6d3c466bcff1c60750b8d85dc74f3ebaf28))
- Deprecate `@payvo/sdk-dot-indexer` ([d6efc7f](d6efc7f464478b500747012f0a7adc4c330bd792))
- Deprecate `@payvo/sdk-http-axios` ([1248df0](1248df051483651e1c507d6dccbde9bb14364c62))
- Deprecate `@payvo/sdk-http-bent` ([b5ff4a2](b5ff4a292dd9cc0fd954529e5d4563b6fe06bd9b))
- Deprecate `@payvo/sdk-http-ky` ([5c67963](5c679636cb40440ea00403beaaa4ee9f16afabb7))
- Deprecate `@payvo/sdk-http-node-fetch` ([6981e1c](6981e1c733b47a51b7e2454f812e94a90bba7b1a))
- Deprecate `@payvo/sdk-crypto` ([3912016](3912016f97d53cce6ad412ac55d013fd6fddd2d8))
- Deprecate `@payvo/sdk-intl` ([e462106](e46210680d3ee922c59810443655ff217ff89a24))
- Deprecate `@payvo/sdk-json-rpc` ([dff07cb](dff07cb128d33d046ee50fa02e3958f36a256ba0))
- Deprecate `@payvo/sdk-support` ([2126724](2126724ecd0944fd8010ebe293e39f9681e6a23e))
- Replace deprecated packages ([56be3d6](56be3d66002b9966e6be4544ef4fccb3ec84b4ba))

## [1.0.0] - 2021-07-06

### Added

- Initial pricing tracker implementation (#2) ([1b3dcd4](1b3dcd4b5c83cc6f39b22660b2c65cb394657bea))
- Volume and daily average for price trackers (#4) ([5a02e83](5a02e837dae4f56f1b83e6c96fc6c5b6e791541a))
- Add warning about stability and usage ([dd057e5](dd057e5f47d53786d05499c5b1d465532a7f83b7))
- Add missing default plugins to dayjs ([d62b0d5](d62b0d53fa85b13312cbc6cbec23255e573fced1))
- Add npm-check-updates as dev dependency ([931de0f](931de0f133dc03a1dee7e7498e20f6bb129d8db8))
- Initial implementation of ARK crypto (#8) ([c7121fb](c7121fbd97fd9b2728cf6dad4006492ef41391c3))
- Initial implementation of ARK client (#9) ([593fd55](593fd555eff5487cbb4b710063ae97879a170e48))
- Add search methods to ARK client (#11) ([ab3b1ee](ab3b1ee6427ae9a129fcd5863bda04dcd744ec3f))
- Identity generation for ARK (#14) ([32a94c8](32a94c8cb00a26245a3519176d86e92e32a328cc))
- Identity generation for BTC (#15) ([fea0bb7](fea0bb7bd1a7ea5cffe3697f8b34ba1a89dcc793))
- Identity generation for ETH (#16) ([c48615b](c48615ba3577a432f6bdfa15353a580c74ac8840))
- Implement delegate methods for clients (#20) ([7051741](70517411ce2eac8233e7d0abf047ecb55cf9c6be))
- Add more endpoints for ARK client (#23) ([d5cc49f](d5cc49fd48293c8d0151606202a40d1918106f2c))
- Initial implementation of LSK (#24) ([9be6871](9be68718af0f02ba00342778e3027e38144040c4))
- Message signing for ARK, BTC and LSK (#26) ([9bb7730](9bb7730732b0f0721e349a0b24d4996f458225de))
- Add `getPeers` method to client contract (#29) ([d3dc3e9](d3dc3e99b6b286f5824de8ed050e8c4e0d53afc2))
- Initial implementation of TRX (#30) ([fe71fb9](fe71fb9fde0f9b98f564a37accddbb9c8baa51e8))
- Basic client setup for ETH (#33) ([fe8168b](fe8168b99f1efb33911ce9c6512dd7f7c92ef4c6))
- Implement various ETH client methods (#34) ([6935f8c](6935f8c9c1258821666daa1efa2112e81a7e6ddd))
- Initial draft of normalised Block DTO (#36) ([2487fad](2487fad56f8b0c3691badd635a66065e58d3a14c))
- Initial draft of normalised Transaction DTO (#37) ([15ca2ee](15ca2eeffc5f6922e7dbcea761f1ba64159a4b39))
- Initial draft of normalised Peer DTO (#38) ([398d123](398d123c00e58478337baa75a6074a9058255083))
- Initial draft of normalised Wallet DTO (#39) ([1cbe4dc](1cbe4dc7c06ec3207ad78c50815369581db793ad))
- Add a roadmap table with implemented functions (#45) ([9b3d911](9b3d911ac5f153c63ea088e19bdd460987598f0a))
- Add manifests to provide coin information (#47) ([ae3ae87](ae3ae87027a4253cfbc68cef3a1a4ba35bfb3e3c))
- Implement `Client` methods (#50) ([a35aa50](a35aa50573c6b42ed175e20deaa2aa0fd5815e63))
- Initial implementation (#52) ([2eae2f0](2eae2f0b2327491137b1cb2720e501d4ab420937))
- Implement `getTransactions` (#48) ([671887b](671887b397d00685d2894fe636acd929f88d27aa))
- Initial implementation (#51) ([40939eb](40939eb3a4f2ef25751e1cd0bd2b38344763083c))
- Implement `Client#getWallet` (#57) ([7b60b85](7b60b8594aa4f8e71e43273f9a56ef94a407e935))
- Implement `Message#sign` and `Message#verify` (#59) ([596f9eb](596f9ebd800827aab91241ca23ff4d7de681e8d2))
- Implement transaction, wallet and delegate methods for `Client` (#60) ([dba67b6](dba67b63081a47be81c89291243216d22c2722bd))
- Introduce peer discovery service (#62) ([f6147ff](f6147ff66da29139bdace3c180d603b6c9b5eeb5))
- Add `yarn run publish` script (#65) ([1a62303](1a623033147199d37b59745e27ff80663e479ff3))
- Add `WalletData#getNonce` method (#72) ([fbbc21b](fbbc21ba927c05c486e79155404d42bb6f7d07f0))
- Add package banners (#76) ([80fda7d](80fda7dd4eb9558323a311d75e9d19f2b911ebe1))
- Add `DelegateData#getUsername` and `DelegateData#getRank` (#89) ([0a4ab51](0a4ab51582ddf7cac49903333c69b6afaab7b5dc))
- Add `ClientService#getVotes` and `ClientService#getVoters` methods (#91) ([b907522](b907522405bcc9b3776b62e4d983afaeafbcebba))
- Add `Class#construct` and `Class#destruct` (#96) ([406fd10](406fd104103bb03456aa7ae3abe9481b8a0c3ead))
- Implement transaction signing and identity geneneration (#97) ([8148655](81486551bf16ab6e9c29e23a83febcd7bed50186))
- Implement LinkService (#98) ([f18a6d1](f18a6d1c87d9836182d828da31e21a27f705109e))
- Add contract for `MessageService` input (#115) ([317188e](317188e602bcac6ecb94ec002935a9037f59429b))
- Add contract for `IdentityService` input (#116) ([20cc46a](20cc46af344e07af013995530fada1b8f35aacb6))
- Add `options` for transaction signing (#117) ([5c528f3](5c528f3a59f5678fc327451224270dd1e41997ff))
- Implement `Factory` for each adapter (#118) ([fa81ba4](fa81ba4e3c22244510fe31f3beae606649933102))
- Implement `LedgerService` (#119) ([b894e16](b894e16be4cfe3177f927b6def61cb602923d4b2))
- Add documentation for all services (#103) ([52bf82f](52bf82fe31a18ec2bdacb1e183676298f1acbc6e))
- Implement `ClientService#transaction/transactions/wallet` methods (#134) ([82e606a](82e606ae6947f9d05a02baa6a9ef6572bf1f5340))
- Transfer signing and broadcasting (#135) ([f72bc10](f72bc101a94b56eb409baedc6c0efcb93599fa5a))
- Transfer transaction signing and broadcasting (#137) ([017ce6f](017ce6fc8340d8853765568f4d045fbec2c91929))
- Implement `FeeService` to control fee behaviours (#141) ([b6100d7](b6100d72eddd78cdd5cc75a139f718caa054b539))
- Add manifest usage details (#142) ([5576614](55766143984341c298b97f0685ccb6de63fe0fe8))
- Add missing exceptions for `IdentityService` (#143) ([b524010](b524010823f0ce8180cba941b1c48cd35101a274))
- Support domain-based peers (#150) ([c00eb20](c00eb2005de6181335c04ee17f2f15538132c31e))
- Implement passphrase usage for `IdentityService` (#155) ([ff3796d](ff3796dd117e176c99c9d90ca8be597062f2be14))
- Implement passphrase derivation (#161) ([b6f3931](b6f3931a51e624be59e1adceaf92e3a9b3994f4c))
- Add derivation path to manifests (#163) ([f4e450f](f4e450feafb192bf434646738585b2f5769ab48b))
- Implement `IdentityService` (#166) ([863671f](863671f5e77a4891ad054050f12490c9575a6a0d))
- Implement `MessageService` (#167) ([8c91be4](8c91be4d6797a29ef7752c534f5d6b15e941b056))
- Implement `TransactionService#transfer` (#168) ([1968e33](1968e333098a97569a7bc1c9d61f09784eadddb8))
- Add unit tests for `Factory` classes (#170) ([e70463e](e70463e9a9a64881d93233730c22b69f07e5fe02))
- Implement passphrase derivation for `IdentityService` (#169) ([0c5ec51](0c5ec51d0f9a414b394c00c24861d5346358de54))
- Implement `ClientService#transactions` (#171) ([15ffde4](15ffde49869d648edd64d1f3079917e8ee5f1c45))
- Add `crypto` key to manifest to hold BIP values (#180) ([da6e466](da6e466a22ffdb26f60d1e9848fae98762f2ff53))
- Add `LedgerService` documentation (#188) ([c690b99](c690b9972d73e6638965049493a327b422733835))
- Implement `NumberFormatter` and `CurrencyFormatter` (#186) ([6eebe10](6eebe105340981856f2c155cebddc9eea0161af6))
- Implement `NumberFormatter` (#189) ([71d6101](71d6101644636a64d03831bd49c104c3de65659d))
- Add `DTO` tests (#193) ([230ba39](230ba395f6fabd8e0ecfbe0322da1290ac91af44))
- Setup boilerplate (#194) ([a61a40e](a61a40e09c23c50756f0e9e44de3a38425fa2f9a))
- Implement `IdentityService` (#196) ([8e3ab1b](8e3ab1bc81deb2c3f7f649364ccb5f3216bac732))
- Implement `ClientService` (#197) ([9a6464d](9a6464de0e56372eeb1b52f56568b8d58393a367))
- Implement `TransactionService` (#198) ([fe9cc00](fe9cc00cb3e0b0f7d63fe5b28f6f2ecb86e44e56))
- Include `nonce` in `WalletData` (#199) ([6942cc6](6942cc6f6d8214c5fac4fb5a7ee4b801fd37a4d5))
- Support transaction signing with private key (#202) ([892e752](892e75221604d041138f8aa8fa29264c91a8b054))
- Implement `MessageService` (#214) ([cbc276b](cbc276b5bf60a817e7924bff48d757fe1aa70a29))
- Implement `TransactionData#asset`(#219) ([2e2bb28](2e2bb28851cebc9df2cea67176d3f4e4b48bbdec))
- Add ledger tests (#226) ([b6fc12e](b6fc12e0dc8c40d1517c159a8bb3a774650b7201))
- Implement ledger support (#227) ([f42be51](f42be51e4cfbec2dc546e273a85dc585cc0ee069))
- Add instructions for wallet creation (#231) ([29c3d7e](29c3d7e07cd20600dd063674cec4cc8fca5bae27))
- Support transferring `ERC20` tokens (#234) ([384eb7c](384eb7c6a756d3c4b7e942167d1e3155a3c659a6))
- Implement `LedgerService` (#236) ([9280e61](9280e61848b5631d6f67a71b56a2659b8d914c93))
- Implement `LedgerService` (#237) ([0daf5b6](0daf5b6ec738e350046589f1cebc6de11ec28b49))
- Implement `LedgerService` (#238) ([0881ea3](0881ea3a616adf1cdef748ac27ad8750205cc935))
- Add all supported networks to `manifest` (#241) ([0c9c9f6](0c9c9f6ac774875d8a16a3e4c65ebda026f1fda6))
- Add currency symbols to manifest (#248) ([a1a8ae2](a1a8ae21dac1b794a9cdce7969369a82c80fd121))
- Implement `NetworkRepository` (#250) ([67d190a](67d190a3c8fc54f91a213203f6bc4c34bd469c0e))
- Implement `Manifest` (#254) ([acc0300](acc0300de1d45279d444c4674c6df557df3d9f01))
- Implement `LedgerService` (#251) ([cced570](cced5708116e06b733f7822a2cf01ee1c32e3479))
- Implement `Guard` to protect against bad method calls (#257) ([0a0a7c1](0a0a7c1a68a49f2d94d6cd77ca7cfe4eb8176b8a))
- Implement `Config` service for coins (#259) ([103111f](103111f165b2c1fed08fbb1b00fd73c8c2215c20))
- Implement `LedgerService#connect` and `LedgerService#disconnect` (#264) ([226b7f0](226b7f00b3e5df4c1edbb3be2f14343605a7f804))
- Handle peer discovery and network identifiers (#262) ([34e74c2](34e74c27c9e59ade7a3b0c6dd62ac90d22aab747))
- Implement `betanet` support (#265) ([1ba0a84](1ba0a84682791014c336557296b5fc92de594127))
- Add example for transfer creation with ARK (#273) ([dc59ae8](dc59ae87ec04057fe72ae418233c3b2685515acf))
- Look up nonce if none is provided (#274) ([8cf5d92](8cf5d9220cf55233c967e0d9cee6be9ef6999006))
- Add usage command to examples (#277) ([7d3e44f](7d3e44f92bf438cb17b99535fdcbb29c868a313d))
- Add links to API documentations (#279) ([30f8c06](30f8c060e466e313dec88d94fa970c3f820ac213))
- Implement `LedgerService` (#283) ([6120a2c](6120a2c7bf13ba6fc0c08d0e174144660da6f424))
- Implement `platform-sdk-profiles` (#282) ([f393a56](f393a5616f5b941a115a93c7ee4018be4bfb5a91))
- Implement data storages (#291) ([63e8897](63e8897b8de7c24411e95ae7cb5d5bf4ac53168a))
- Implement `global` and `profile` settings (#292) ([716ea6a](716ea6a69b7053c2a98b086cb8086c8405c0e52c))
- Add "quarter of year" plugin to `dayjs` (#301) ([ce9dc6a](ce9dc6a4f97356dccf1d5da0152af1ec1011283c))
- Implement global, profile and wallet data (#306) ([7b83390](7b83390e6ff3399a2d200be90909aa2fa91b0e6d))
- Implement DTO collections (#307) ([2978b12](2978b12dfbc23ddf34a24a0a0186840891dede07))
- Implement URIService (#308) ([8da9ba5](8da9ba5353869f611ca9d1533cd4e6763c775350))
- Add comparison support for BigNumber ([667c5e6](667c5e6a6bb116e7379430149fc404c581d33ff2))
- Add value type checks for BigNumber ([24d50d2](24d50d2977a66c76403362de2730d7193baf0fa9))
- Initial draft implementation of `platform-sdk-intl` (#313) ([49502c3](49502c33dd9d6383dc37f04058dac08f96a6296b))
- Implement getters and setters (#315) ([6a31e0a](6a31e0ae23e9b074813d3efaf0e2546736835012))
- Implement `BigNumber#comparedTo` (#316) ([a07e472](a07e4722b7cae5f2d6ce6b5d52222b4be9c18ead))
- Implement `censorMemo` method (#322) ([79c3987](79c3987df8f40cd47a8a4c4dc2b0e4c973d0fb3d))
- Get profiles by ID or name (#323) ([dd15a9d](dd15a9dd0b557de8493cfee70fb892f7ee200de9))
- Add `Money` class for currency handling (#326) ([2667af3](2667af3e5fcacf480e594b22854311cd479eed50))
- Implement `Numeral` for number formatting (#328) ([255d273](255d273e47a6e484df0e0a2247a0e25fd6ee5f91))
- Implement `Migrator` for data migrations (#330) ([a9e38b2](a9e38b25f146ed001fadcf16bd7c31f7b5e700fb))
- Add allowed signing methods to manifest (#331) ([a6f2c7f](a6f2c7f95db3cb333e048321822e3f6bd9ac4e38))
- Allow usage of custom storage implementations (#335) ([586218b](586218bc04e2b4708dbbf50843e6a31062d28baa))
- Integrate `keytar` for system keychain access (#342) ([a239087](a2390870fb3c5fbfbf37294ac6603ea09be50a02))
- Implement `BIP39#validate` (#343) ([eb90324](eb90324cb75820b6c5ab9f439d5810714ce8a0f4))
- Implement `Wallet#transactions/sentTransactions/receivedTransactions` (#345) ([5b45733](5b45733ce2bddf2248f8590e22d1fb0a045e67fe))
- Implement `Address#validate` (#347) ([1196c9d](1196c9df3232cd52d7823c293cce7dda37ead5f4))
- Add `ClientTransactionsInput` and `ClientWalletsInput` contracts (#349) ([7f72b3e](7f72b3ea2f929e8022f21b496eb04fb04a37ca3f))
- Implement `BIP39#generate` (#358) ([e1dff21](e1dff21c495b2ca14699d422c68118c455f8a52b))
- Integrate `@arkecosystem/core-magistrate-crypto` (#359) ([220fcdf](220fcdfa63ca04fbfc86bc638a2e1b4628b30393))
- Implement `TransactionService#transfer` (#228) ([fb39d33](fb39d338feff3549754fbef61e44fe8797e6b1ad))
- Implement `LedgerService` (#363) ([3f6cf1c](3f6cf1c02674052a99fc377e7d781f2801acf0cf))
- Implement BIP38 & AES (#369) ([02669a2](02669a2cc5381697fac321c290b9f1ab4e9abb24))
- Export everything to allow for proper type hinting (#371) ([9f2f820](9f2f82030aef408b02d76eb5386cfa7cd4a00907))
- Generate avatar for profiles and wallets (#372) ([741eb37](741eb37fc1a829a1defb6fffb4786b16784f63ca))
- Add `decimals` parameter to `BigNumber#toFixed` (#373) ([7f6c2fd](7f6c2fd96227d06981c2eca8b3625feb9c401e38))
- Implement `Contacts` (#375) ([8b79e79](8b79e79873bcf6ebda5b38c667df7fa885e757fc))
- Implement CRUD actions for contacts (#380) ([108f953](108f953616e84d145303569a4b76e60be8919a47))
- Add `sodium-native` as dependency (#382) ([50d7662](50d76623d68534ede867531ccecbdd1aa7750d31))
- Implement `DateTime#toDate/startOf/from/fromNow` methods (#381) ([dfcbcc3](dfcbcc345c269fc431970dca40dc6d982823fc1a))
- Initial implementation of `platform-sdk-news` (#384) ([623cb84](623cb8419936e26bafb7911c0f35958bb932eaf1))
- Automatically persist wallets after CRUD operations (#385) ([c21a698](c21a698a70bf9dbbfc20aee6ef8bc20637fd3fea))
- Implement methods to save and load all environment data (#387) ([25fd163](25fd16321a7db6eb6e952cb6d7bbf4417b4f40bf))
- Implement `MessageService#sign/verify` (#391) ([b5da8dc](b5da8dc3338a6fafa3509a7cb95b189ddc7721b0))
- Add `ProfileStruct` and `WalletStruct` contracts (#404) ([33f204f](33f204f34770be407feee012c55451e7b0375c0b))
- Validate ARK and NEO addresses to avoid collisions (#405) ([dd5540a](dd5540a416607015a9d18d716f8058808070ea28))
- Validate storage data on read/write (#406) ([c6866b7](c6866b71cdcdb03e7bb4b97cc9cee42248ed1b98))
- Implement `LedgerService` (#407) ([4578aeb](4578aebcbc6bb5440fdff2b3fb27cfb692e3b3fc))
- Implement `LedgerService` (#412) ([9cbd966](9cbd966d586b4c1ddc3ca9a54c7f179c086a216f))
- Add examples for environment, profile, wallet and contact creation (#419) ([e063d8d](e063d8d8818a1c7cbe35c09d06e07bdea2836ac4))
- Add BREAD examples for wallets, contacts, data and settings (#420) ([aab018c](aab018c4bf3a1d76c627a13b62bd674e73efa752))
- Add `Wallet#votes` and `Wallet#voter` proxy methods (#425) ([e10f20b](e10f20bdfc9aad3cfb5aedfb3243682b7971eccf))
- Add `MetaPagination` contract (#428) ([e8c9f64](e8c9f64b77257541419cb7d8d41ccac095f330a1))
- Add `TransactionService` proxy methods to `Wallet` (#429) ([873939a](873939a671d1435665a68793103afb4151b70618))
- Add `MessageService` proxy methods to `Wallet` (#430) ([122deec](122deec2a19ae164f16a2f49d5e584cbe6bf007d))
- Add `LedgerService` proxy methods to `Wallet` (#431) ([31e1a21](31e1a21332a401a583cf1700cfb9e518928c5953))
- Add `ClientService` proxy methods to `Wallet` (#432) ([1a8784f](1a8784f3aeb46de134be91567d037f2f1a0fa3fe))
- Add `LinkService` proxy methods to `Wallet` (#433) ([b59fe62](b59fe627101937877f83d1d0605e48b8a952edd8))
- Implement notifications (#437) ([62979b0](62979b01c4a2fbd116321b5184ec3bfe6ac64588))
- Implement `Currency#fromString` to parse currency strings (#438) ([ed20a90](ed20a90bebc8a8109abe46ca99a8bacdf9256282))
- Implement `QRCode` (#439) ([c6f9bb7](c6f9bb788e71dddf325baa50a89faf1ab27fed7d))
- Implement `WalletRepository#createRandom` (#440) ([3c9f4b3](3c9f4b3cea977dcc4707ed62b13c072b221f5388))
- Add `qrious` as production dependency ([923a287](923a287d6700b07667afa8ccfb48325f99e64a0a))
- Add avatar to contacts (#445) ([b092f93](b092f9314e24812dc097ade62e85f675c8505773))
- Add missing exports (#450) ([82698aa](82698aa4f217bd7c3d6dd08705957740d6138d7a))
- Cache the balance and nonce (#454) ([0ac0761](0ac07619880157d0e327b771ae43ab894c157efe))
- Implement `Profile#balance` (#452) ([7df6ff9](7df6ff94c3c0004a3e157adc75da8f28320fbcb2))
- Implement `Wallet#alias` (#455) ([77f192c](77f192c0689af29e97b650b4c6ba46f49965ea97))
- Add workflow to publish NPM releases (#460) ([826b85d](826b85da4acf683112fe6dcc709b892c120176f8))
- Implement wallet flags (#467) ([cffebc5](cffebc51a12171181b14478515d349275015f875))
- Implement `WalletRepository#allByCoin` (#468) ([de80170](de80170c5bac20fbaeaa6771f1479d47d35866ff))
- Add profile aggregates (#469) ([355d2ef](355d2efddd17ec04c3a1abd84387768f55892790))
- Implement `Markdown` parser (#470) ([13cc7f5](13cc7f57902a9488f288fecc57a9ff0d40ec833a))
- Implement `Wallet#isDelegate` (#474) ([9d8c232](9d8c2326f1e3873bc0c1e88586aec1f7bb3d9489))
- Implement `WalletData#isDelegate/isKnown/isMultiSignature/isSecondSignature` (#477) ([4dcd4aa](4dcd4aacf74444e8b250727343ca3646e7729bc4))
- Add Multi-Signature hosts to manifest (#478) ([c43c442](c43c44240f05128f74975dff39bd2c12617b11b8))
- Implement `MultiSignatureService` (#480) ([986b54b](986b54bfb71484792c26c71423a6b7819f8a44e4))
- Implement `WalletRepository#sortBy` (#482) ([34bd711](34bd7116a5580a3992b1560fe92f25f502881f00))
- Implement `platform-sdk-ipfs` (#493) ([cc8668b](cc8668bbf6030f2284ca094260babe7f79c5c4f9))
- Flag contacts with types like wallets (#495) ([3ddcc5e](3ddcc5ea41a99528e193d8be9790382f80154339))
- Implement `Cache` (#500) ([1346dc0](1346dc0c967fe8bfe6b2263f095889e9e1342d1b))
- Add more banners ([5d32ef8](5d32ef86a800d5e8a68d45825277b4caf809eca1))
- Add more banners ([d4b27f3](d4b27f3658d8ed09189b3ad6e6b57b21a7a5c80a))
- Add more banners ([fd93912](fd93912e03a3187e58e7402aff1b034f7c9611a4))
- Implement `is*` methods to determine transaction types (#511) ([85d09e1](85d09e1c37d029786f55811826f7cef28629c50b))
- Implement exchange rate fetching (#513) ([14eca3c](14eca3c72533f7dd3adb29d3568cacaa7d2d8a6e))
- Implement `TransactionData#isUnvote` (#516) ([43d8abe](43d8abea6db542f031e10bb4b0e1fccea14ab5be))
- Implement `Environment#availableNetworks` to expose available networks (#523) ([c63de79](c63de791f38d09a9f2f20bc16c78b7860e708559))
- Implement `Environment#bootFromObject` (#542) ([031c600](031c6008a3f3de3f85349550e6300873a589fbc0))
- Flag networks as `live` or `test` (#545) ([3c0e08b](3c0e08ba521f595e8560bd1a5a758809bd4fd18c))
- Implement `platform-sdk-http-axios` (#548) ([0cc5a1e](0cc5a1e38e787833ee2214ee60d5656059774fa9))
- Implement `platform-sdk-http-got` (#547) ([17e9c10](17e9c1020ff56cdf84c1f146b41c850cbcdbd0a4))
- Implement `platform-sdk-http-node-fetch` (#546) ([8756f60](8756f605f76c96766d39909d1ff0bb506696a445))
- Implement `platform-sdk-http-bent` (#549) ([e6d07f5](e6d07f5035b4ea152d98fe76be2eb169657a1138))
- Implement `NetworkData` (#551) ([c8c1c96](c8c1c96caef07fafdaa1ad3da7d854a1e3863c13))
- Implement `MemoryStorage` (#552) ([6e5712a](6e5712a7a21543466bdfea02fb6787fdddb13ad4))
- Import wallet by address (#554) ([7bcc9ea](7bcc9ea2f95617887f3b7bdf96aa4d4afe09b0a3))
- Implement `Request#withCacheStore` (#555) ([b1e1ea3](b1e1ea31ba99813695ce884065c059a3156bc585))
- Implement `Wallet#fiat` for fiat balance (#557) ([62ed1d1](62ed1d11c6a45012497c6d5c92bcd99aef008720))
- Implement blockfolio signals (#560) ([1947fd0](1947fd05b396e5da35ef33b9b6d0b330d45e0df5))
- Initial implementation of `platform-sdk-http-ky` (#563) ([44ce288](44ce288aacbb697084ea535d5132b7fe8d6f0a6b))
- Add more banners ([1641e52](1641e52c8f0bca523986f7d0da8c89d3466dc443))
- Initial implementation of platform-sdk-plugins (#575) ([1e1cbc9](1e1cbc910b41eb48a529d39c4ef427e801e7b3eb))
- Integrate platform-sdk-plugins (#576) ([a61dba1](a61dba11ea3873fbcee78de3af28c7f6837a73b4))
- Implement plugin blacklist (#581) ([85b2bf0](85b2bf06c470f52af0ad6e8e2cf4018d02319d1c))
- Add plugins, plugin blacklist and plugin registry examples ([53316a5](53316a5a8beb26e2b5b6133c79fe612ebfacd5c1))
- Add support for profile passwords (#583) ([2dbcc9e](2dbcc9e6fb2573bfdc5c6caa2637104ecef8223c))
- Add `ProfileSetting.AutomaticLogoffPeriod` (#587) ([f450019](f4500198e07faca99c1eacff01a6fa44730deb4e))
- Implement `bcryptjs` as `argon2` alternative (#588) ([1e74f30](1e74f309413da6fd8aff37e4e4623a763edbf702))
- Add `DTO#hasData` method to determine if data is not undefined (#586) ([4a050ad](4a050ade2acb58e762c9eee0931e754aa180d2b7))
- Implement profile data aggregates (#594) ([9dfade3](9dfade3d9903aecdce835a88474b2fec03a9fdcc))
- Sync delegate list and store it locally (#595) ([5cf11ea](5cf11ea963f917807a035d754a688ce865301ae7))
- Implement `Profile#usesPassword` (#600) ([4b0e12c](4b0e12c1f105c1983b21989197aa8cb5cdeaf228))
- Implement `Profile#flush` (#602) ([d80e6cc](d80e6ccff00c40eb24b07be4512234f81b1f6f70))
- Implement `ContactAddress#hasSyncedWithNetwork` (#607) ([690b910](690b9108a171bb00970a4b45acb2f9e271d33dd2))
- Add profile authentication examples ([9e3bb4d](9e3bb4d5854bc3658993674ddaa66d00cdc29083))
- Implement `ProfileRepository#count` (#609) ([a4c564d](a4c564dd331e9e558e5ba9885451872642f90ff8))
- Implement `DTO#hasPassed` and `DTO#hasFailed` ([871233d](871233ddef29548aaa9f8e9e4ce3ce4314ed7e72))
- Support `query` for post requests (#610) ([1f684d5](1f684d595074d47bb70ccbfb37078f60de7b1427))
- Implement `Contact#avatar` (#613) ([6cce3b5](6cce3b5f9358ed1ff1b77592a0fa8af40b70204a))
- Implement collection paginator (#616) ([ab973e2](ab973e22802266a9071d390bc606221ba0aa2f76))
- Support pagination for transaction aggregate (#620) ([7c32d81](7c32d81fa790c8e2e7ebf15905cb77d0f8ebf2a7))
- Add tests for `ReadOnlyWallet` (#621) ([6b463e9](6b463e9e802a487af9b3ced1361eee245ba69a68))
- Add tests for `ContactAddress` (#622) ([12ccf2e](12ccf2ea00dd9092caf76670810697cee8953f74))
- Add tests for `ContactAddressRepository` (#624) ([21b88b7](21b88b73f6e6d0c88d84687ae26842d194678490))
- Add tests for `CountAggregate` (#625) ([010024d](010024dfc83cd65830f9f0db5578eeaa4965c1b7))
- Add tests for `LocalStorage` (#626) ([0f618a7](0f618a7fb9b66bbef1de3f2121d511798bf494cc))
- Add tests for `TransactionAggregate` (#627) ([e13b91f](e13b91f6c0b803daed671fd6bb1877b91f2ff52d))
- Add tests for `Profile` (#628) ([a347cb0](a347cb0e20f94a7a40f327b427d76f48344317e6))
- Add tests for coin proxy methods for `Wallet` (#629) ([c624fb2](c624fb2830be9cf16afa58c2bc2f3d19f55ca498))
- Add tests for `Profile#getExchangeRate` and `Wallet#syncExchangeRate` (#630) ([905f39a](905f39a81f638687367b43752aca1fe849596b83))
- Implement `ProfileRepository#has` ([e277b4c](e277b4c921687efbe93a7eaa8af9dcb727632bc3))
- Implement `WalletRepository#has` ([53d94b6](53d94b68800937adfb5bbb0338d178d9c153e74e))
- Implement `DateTime#fromUnix` ([a58aead](a58aead2d7b79b52761d239ae9e356da1faabc71))
- Expose data validator (#634) ([7a500d0](7a500d0f47b4416847f313f3feae92b5cc6af5c1))
- Implement `TransactionData#isConfirmed` (#637) ([a22de96](a22de965f839b35204de502e6096ec7df4a999b7))
- Implement wallet transaction service (#638) ([bef8608](bef860860eac08f625030156fb017282533f19a4))
- Implement public key to delegate mapper (#635) ([477937d](477937d1c20ef35d0a83d16dafcfaf000ac922bd))
- Implement `BigNumber#toHuman` ([6cfdd26](6cfdd26ed0f6ec77947c84101b1c8c5dd22e208b))
- Implement `TransactionData#recipients` ([084dfc7](084dfc730dc556cd48057226ef31344ab1a7ba9b))
- Implement AIP36 (#644) ([a5fa550](a5fa55033953f4cad1d6ddd51c66c40ff9e0a853))
- Implement `SignedTransactionData` (#646) ([abc51e6](abc51e67618e1ee1c00177357e15a8a5a26435b6))
- Implement `RegistrationAggregate` (#648) ([880cedc](880cedc52ca0c413f06bd3ec39faeb516e88bfff))
- Support listing all entity registrations ([9335c7c](9335c7c1f02559dadbfa23ba3b141fbe8e07995a))
- Implement `RegistrationAggregate#plugins` ([f0ee297](f0ee2971ca33aa712a30d8ff64517c0b4a59a0c2))
- Persist signed and broadcasted transactions (#649) ([7259199](72591998337f5f111c810c3d2c718df85948517f))
- Implement `ClientService#wallet` ([5fedc5d](5fedc5d5f546a8c3c8de119f84f46cd5f1dfab00))
- Verify that expected and actual sender of transactions are a match (#651) ([837b68c](837b68c4ceb7cf8a7227231f86946ac8f1be6453))
- Add index.ts where needed ([d550943](d550943402a2f9e05a9164c37675c7f41876a65c))
- Allow creation of coin instances ([06a9c10](06a9c1094d4969186b2e22b4ef3a147e94d6dd3e))
- Implement `Environment#registerCoin` (#654) ([a09c716](a09c7162f9fb3114f239ffeef119be3a432f14df))
- Implement `DataRepository#first` and `DataRepository#last` (#657) ([323b92c](323b92cbf31bbeebd261149ec604749933315f47))
- Implement query and category for blockfolio signals ([f63c048](f63c0482fc51812af35b1ed6722085dd03085262))
- Implement `TransactionData#blockId` ([023b8c6](023b8c61d8d0629434e51e24647942dc51305229))
- Implement AIP36 transaction identifiers ([ccf9db3](ccf9db3544a125426e4badb37bbd7931b02642f4))
- Retrieve signed or broacasted transactions from storage ([ba6635e](ba6635e6c8a439d51eb31e54a874d20e71180cd8))
- Add missing exports ([5f05f0b](5f05f0bef0fa4ff979a1fcc45cd28114f0b905af))
- Implement `RegistrationAggregate` for profile (#660) ([7a27385](7a2738519a1fe34232eb1b691776b2126c174d05))
- Implement entity aggregates ([b70be32](b70be32810ae4c20054ccf7e4385132205ebf301))
- Add method to return all pending transactions (#664) ([30cbaae](30cbaae39493321945ae312c8340f748f3c224d9))
- Implement TransactionData wrapper DTO (#665) ([4452929](44529290d329fddf4c0e97e10bcb2fadf8342acc))
- Include rank in `ReadOnlyWallet` (#666) ([acb5b03](acb5b03069af1fd7e1d57f1a8cb769699db2a644))
- Implement vote syncing for wallets (#668) ([b26f3d6](b26f3d61e2ffaf8f130f5cd60fa46ffdb063359f))
- Implement `CoinRepository` for direct coin interactions (#669) ([7e5bac8](7e5bac884410079a628875808ee9fd21187cf15b))
- Expose more voting information (#670) ([3def136](3def136b25ee73bea329380165dc583a18884f2f))
- Implement `Wallet#canVote` (#672) ([0ee97aa](0ee97aa5863669e294b289234d39ee59d297727e))
- Implement `TransactionData#total/convertedTotal` ([628a664](628a664ee6d74f81a2e53bc1c1518212eb58ad9f))
- Implement `Wallet#explorerLink` ([0dccd07](0dccd07fb7d9a1ebd7fb3bae2d7dc94dbf572c70))
- Implement `ReadOnlyWallet#explorerLink` ([bb52c1a](bb52c1a39f6c2a47b3f87f1228253451d2adb0b9))
- Implement `ExtendedTransactionDataCollection` (#675) ([196a9b7](196a9b7d84f927b01b4f00ed40a54008fae4a225))
- Implement `WalletData#multiSignature` ([e5c9d64](e5c9d64289fbc2ec3379987de7b8fdce5c6c828e))
- Implement `WalletData#isResignedDelegate` ([03b96e3](03b96e34f70de7d53bf5eff85137ba279dbbc8f1))
- Implement Multi-Signature signing and broadcasting (#678) ([760679f](760679f7d69273c34a2ec8b4a9c29c005dddfb0e))
- Implement `WalletAggregate#convertedBalance` ([49fd156](49fd1561aa59fca07d20b84a86d2f1f506b9e9ed))
- Implement multi-signature helpers in `TransactionService` ([fa60829](fa60829049af4b3319cafbdbb038e503b392ce66))
- Implement `Wallet#isResignedDelegate` and `Wallet#multiSignature` ([543897e](543897e85899f56d9407c150a4248fb5f22d2398))
- Implement Multi-Signature for `TransactionService` ([b171775](b171775c298ea173de216a7aae36e38dd2f7b447))
- Add pending MuSig transactions before checking state ([f2bd839](f2bd8394d1bef809f737e53bee7d34cc59a1f6a1))
- Expose detailed voting information for networks ([534cda5](534cda5bdbe676cc7972c423b018a373e3205953))
- Expose multi-signature participants as wallet instances ([fe68cc3](fe68cc303046e09cd273e0a07ca7f6848763f446))
- Sync fees per coin (#680) ([239adf8](239adf84f9990139476185ad88a7c9861e6bda21))
- Implement bulk syncing of delegates and fees ([1812c8e](1812c8eb238a6a1ba153e76248205428d1821e94))
- Support options in toDataUrl (#683) ([032d648](032d64886176910d13a23f6968dcd5c48f3a5d7e))
- Implement methods to find cached delegates ([37f1190](37f1190021836f2fefe77729740e268a0ed2677d))
- Sync exchanges rates globally instead of per wallet (#685) ([c186612](c186612f5216f29ad26f9c79dbabd92f764ac2d3))
- Introduce `CoinService` to manage coin instances (#686) ([2e864ec](2e864ec892641e8e96dcdfc70f2027c897660ed1))
- Add example for multi-signature checks (#688) ([d19b7c5](d19b7c51e027027007ec885eedde025f25451d92))
- Implement `WalletService` to manage all wallet instances ([801800c](801800cd69b8dafb61ddbb4999bddb875039e594))
- Store exchange currency in wallet data (#690) ([3d9f3d5](3d9f3d5fb8516265e1658c2eaaa91a383d7ba72e))
- Implement `ExchangeRateService#syncCoinByProfile` (#691) ([f9b8b31](f9b8b311a5e1ab7f71621fb206fd72ba9111d561))
- Implement IPFS upload through SDK Server (#692) ([e2dc6c3](e2dc6c3048fcb697a819021acf286007f6c6718b))
- Implement `WalletRepository#update` (#693) ([d40781b](d40781b0541277855963a80e9b2b8b8a2e4911f6))
- Adds some ui profile settings (#697) ([c2a1a7b](c2a1a7b12822c3bce42b723c01c272dc4c7f0968))
- Implement TransactionData#convertedAmount (#701) ([310b4bb](310b4bb9e8a02cb0f2a2688cabbcd9ed60597703))
- Implement `WalletData#entities` (#703) ([b107ff5](b107ff5d955f557b1d78e50f9af8228b601057a5))
- Implement `ReadWriteWallet#username` (#704) ([eb39ae9](eb39ae941e3b85ee079ef398d9901bfa283919ea))
- Implement `ReadWriteWallet#entities` (#705) ([8255a1f](8255a1f5111a2e90fa47cb3741a7d16f26bda5a2))
- Implement `FeeService` ([23fbd56](23fbd5689444e2d72ef4641f20b6eb2102c845e6))
- Add compendia (#709) ([8b9b490](8b9b490b57a9e6de8dac724f0adda9fe0116da28))
- Add compendia testnet (#710) ([57db684](57db6845ee5ccb5425c49d6ad7b41603b0b61e02))
- Add musig hosts ([6b20793](6b20793d31ab59a4bed47f59e9bb91a62236f2e8))
- Implement `TransactionData#explorerLinkForBlock` (#717) ([183268d](183268db9bb1f4a0f49adb38cb992e50ca54de87))
- Implement `Wallet#can` and `Wallet#cannot` ([5cbac4f](5cbac4f62b07ecc0821fef72fb13255b5041b585))
- Implement `Wallet#findTransactionById` ([714150c](714150c9de2aa31a2d2d61ad7bcd0e69d3152c51))
- Implement `Wallet#findTransactionsByIds` ([ba96e24](ba96e24dd100d520554622b1fb5dc016f32ffbb1))
- Implement API pagination ([e1a1672](e1a16729028b18ca49c5939e24fcdd166d976c6b))
- Implement `BigNumber#isNegative` and `BigNumber#isZero` (#733) ([40f4d13](40f4d13080d3919b3a26c99cdb807582fb9e4d19))
- Implement `WalletAggregate#balancesByNetworkType` (#740) ([a70c250](a70c250387eb95b5dbe06908c104876ab0159910))
- Implement `TransactionService#isAwaitingSignatureByPublicKey` (#741) ([24e0189](24e018963e038b6781c5f65e3a27751783ff0cf5))
- Implement `EntityHistoryAggregate` (#742) ([1091497](10914973da4c79496dc47b37ee86290418d0adba))
- Support Core 2.0 and 3.0 (#746) ([764fd39](764fd392fca7b3f591210f2c86d66c6ed5ebd56c))
- Support 2.0 and 3.0 wallet structures (#749) ([4216160](4216160b2c1a71806e22cba794be75db9f5cf456))
- Implement `TransactionData#isVoteCombination` (#753) ([4eaeaae](4eaeaae767b8c907d2fe4d4c60b339846b212ce1))
- Implement `WalletData#secondPublicKey` (#756) ([ec9c3ca](ec9c3caf8c9c9f98e34b83cc689742e4fa488b77))
- Implement `WalletRepository#findByAlias` (#758) ([067ec6c](067ec6ce9ab350cb285275f4f528edcedeca1af7))
- Add `ReadWriteWallet#secondPublicKey` (#762) ([a36ef3a](a36ef3ad323d00635046b5378e867fa375cd6516))
- Compute transaction id with custom signature (#764) ([506a2fa](506a2fa78a88700f1190930cd6b03dbba71fa6c6))
- Support for custom peers (#766) ([9fdee04](9fdee0407f9a5480b5f30d8e5553196f3dcd9c24))
- Implement custom peer settings (#767) ([38d6eba](38d6eba956da3ef931eedd0a0766c4b1f0ff7402))
- Import wallet with ledger index (#768) ([e289151](e28915191b8d9c06005a115aa7eb422c4bdc0497))
- AIP13 & AIP26 compatibility (#771) ([72587c7](72587c703e4f9d1308a40da1ad8fea0bd34f263c))
- Add custom peer usage setting (#773) ([93a32ac](93a32ac15d1ff382de0344f9ed28f2b0fb130364))
- Add development network setting (#777) ([3afe258](3afe258d5b2efae4073baf230cb677a661603f6c))
- Implement multi-peer broadcasting (#780) ([8f39704](8f3970407686ec27a6373a3826c94362a54381a9))
- Add `ClientService#broadcastSpread` test (#781) ([d60e17e](d60e17e02b27bd6ef3d66c133f8ec6eaeeb999d5))
- Implement `Wallet#sync` method ([d29b4d7](d29b4d7ee9c6f538cf72b07d9c26919fadd8d7a8))
- Implement `ReadWriteWallet#canAny` and `ReadWriteWallet#canAll` (#782) ([684bca7](684bca7fe525efb6fef44cd0c672cc403961b548))
- Support multi-coin news retrieval (#783) ([dc5e881](dc5e881d74c27107bac61f0db34c881d25575bec))
- Implement PriceTracker#dailyAverage (#785) ([bdfd0d2](bdfd0d279abc3c9fd4c0a532ca7a5ad707b2f3bf))
- Implement PriceTracker#dailyAverage (#786) ([fe49932](fe499327197cddb980b2eff1e4a67a84513b3525))
- Edit custom peer (#784) ([ec0a43b](ec0a43b7c8a7bba926d7a75e40b6b14b7641e24b))
- Add `conflicts` and `format` workflows (#797) ([2b8c188](2b8c1882da0a6edbd086dd6def4c1aab37d29151))
- Add `publish` workflow (#798) ([b48572e](b48572e665f47ac25b5e3465f2e1a4ff1b0eca6f))
- Implement crypto for address derivation (#800) ([8a9aba8](8a9aba85b62d7d37abb33f994a20903e94edef97))
- Implement `ClientService#entityHistory` (#815) ([d855f67](d855f67adb8f5319741ebf31f7ecd850670c36a0))
- Implement key derivation (#816) ([2a36f9a](2a36f9afde3cdd847b008d5d0ee21655738e567e))
- Initial draft implementation (#817) ([7e73dc8](7e73dc8b358b961a65b53c7ab6636234850afef4))
- Implement `EntityRegistrationData#ipfsContent|marketSquareLink` (#819) ([d6bba66](d6bba6637b752a3a322dec760df3c14106771217))
- Implement `KnownWalletService` (#793) ([f1e3b1f](f1e3b1fd0a8928ff236c99b90f467a8dfe25d008))
- Implement `ProfileRepository#findByName` (#825) ([f543ec5](f543ec5c3a8a50fcd91f25a40f9cc9fbeee70e2b))
- Support memo for multi payments (read & write) (#844) ([931900d](931900d727248f26ca503201d5ca67f4511fa3d2))
- Implement AIP36 Builder & Validator (#845) ([34507e8](34507e808075538829c41e2292eb0fb8870f2395))
- Implement `WIF#fromPrivateKey` (#848) ([4b11e73](4b11e735b7d5720184597727991ee9e699abff59))
- Implement `WalletFactory#fromMnemonicWithEncryption` (#847) ([baf2e79](baf2e796c8b3d2107b7873b272f9cca6ba85cb52))
- Add coverage for `profiles/aggregates` (#852) ([aed66fd](aed66fdd0e8fcbf7bfa54c897dd8d4dce5d4d9b8))
- Add coverage for `src/environment` (#857) ([59e9674](59e9674a17f0c764f1409932e6130485c6e57a81))
- Encrypt profiles that use a password (#856) ([e360e2f](e360e2f1b5108ac92977eb09e5100c248429b5ab))
- Add coverage for `src/profiles` (#858) ([4f594e8](4f594e826874bbd71e80dff2d39b8ec89c1139e2))
- Add remaining coverage for `profile-repository` (#859) ([65fff7f](65fff7f44d87b6c6c13fba10e8d8b68ae10c74e1))
- Cache historic exchange rates (#864) ([cbb6f1b](cbb6f1bbc43b1d6177d04e8e387787685232ed57))
- Cache historical exchange rates by date (#865) ([b657c4f](b657c4fa8571f8c71e47b8baac2fa04555c442c1))
- Implement `TransactionData#convertedAmount|fee` (#866) ([97e67ff](97e67ff3aa5ba54a35971d450bc50ee3010fb937))
- Implement `AIP36#fromStruct` (#869) ([06911a2](06911a2309b7e3afa1cbc2e5b273f267ddf95216))
- Add docblocks for all classes and methods (#881) ([8e5f891](8e5f89119ff37f20917486f45cbf58d4d301dfd7))
- Add docblocks to `MultiSignatureService` (#883) ([b726fa1](b726fa16e2a78d2f55c5e9732f3e44cae50f31db))
- Flush `env` container (#887) ([045052d](045052d548a1d9df9f70a8c001c4bc6d39084920))
- Add ability to reset environment instance (#888) ([6b41adb](6b41adbd38f4ad8586b1420da96d68bc496a1c7f))
- Restore signed transactions into their original DTO (#896) ([00cfd87](00cfd8796d96605769d2089efd699bb8d4f27b21))
- Expose number of delegates on network through manifest (#900) ([02aa46d](02aa46d6a3941e5413b9f3441d71036514ee9544))
- Implement `Profile#wasCreated` (#902) ([187127a](187127a88a188f1433068dbe8894b7c4aafeb8df))
- Export plugin logo from metadata (#903) ([ebe77d4](ebe77d4d9e4174af69e0aad93db02ff8e8b9613f))
- Implement `ReadWriteWallet#knownName` (#922) ([6c963d8](6c963d894999f7f2a0c4634c0a78c665ad2fea5e))
- Add empty knownWallets key to bind network config (#921) ([d0ef6c1](d0ef6c145bf0eb701052ce9db91750626ad26a41))
- Implement `WalletRepository#importByMnemonicWithEncryption` (#930) ([0087dc0](0087dc0974a0845cc6b1d9e0e88297c62469a6bb))
- Add `unused-imports` plugin for eslint (#931) ([4624b5e](4624b5e56d36fefb7726539ca7cbf9fea15a1c31))
- Support combinatory voting (#942) ([dfadc97](dfadc97a5675628fa3c5429014727311d4e373b2))
- Implement `RegistryPlugin#toObject` (#945) ([6b4b3f0](6b4b3f037186e2ef3c645bde528bfc7a5fe73757))
- Initial implementation (#946) ([1d39e50](1d39e505363da067c7be3259f1fe696338956527))
- Implement `MessageService#verify` (#947) ([0269e2b](0269e2b2cc11c39e2a8a1576df3004f2328c151c))
- Sign a transfer transaction (#949) ([18a035c](18a035c34870d770ac0c5ca8442c91338078cd0c))
- Add `unvote` before `votes` (#954) ([3671c82](3671c825e8de0bcecdf11d03db3437ab32b30181))
- Implement feature flag to indicate memo support (#956) ([a495151](a4951515c366f5e94f4229a1f2252b44ae75c5dd))
- Implement `LedgerService` (#959) ([2324922](232492291ba3d1cc0b90076e8eae3ac79b960bb8))
- Retrieve wallet information from network (#944) ([8063e3c](8063e3cafb546ec7e5abd3475c401a7da3b5a013))
- Implement ledger transaction signing (#962) ([9b9cba4](9b9cba49f1652f2e22f045e2c4ad793a179308e2))
- Implement transaction broadcasting (#964) ([1a92b41](1a92b410ec46786660f18089d7369bd53da08a22))
- Implement `SignedTransactionData#toBroadcast` (#965) ([534d630](534d630fad9d803dd136a9d3d63b5f4290bb1a20))
- Retrieve wallet balance and nonce (#969) ([f62f943](f62f943fe9a2d9921bdbd9567633e51e19f8db03))
- Initial implementation (#970) ([1785a7f](1785a7f5b23434880c16cb9b40b32d0b69822531))
- Initial implementation (#971) ([51b531c](51b531cf4160f54ce6425175b874fbb8f3c7b54f))
- Implement transfer transaction signing (#972) ([f5eb510](f5eb510ff1f1a9b0cbe37e0e831c39efd529e2fd))
- Implement `ClientService#wallet` (#973) ([78eea95](78eea95ac3a1537a2fbb1222ad22ad110b4d63fc))
- Implement `ClientService#transaction` (#974) ([f3c72ca](f3c72ca4e520a2d46b5f12f61962eef4064f70b0))
- Implement dynamic fee feature flag (#980) ([82dbe98](82dbe987f946e23ed4be32abff9faa73658b7f84))
- Implement UTXO feature flag (#982) ([632e066](632e0661085cb5950d2a70272f8587962691e8d6))
- Implement `ClientService#transactions` (#977) ([0555b2b](0555b2ba4009ba31d1260c0b7e120f8b8e025924))
- Implement `ClientService#broadcast` (#978) ([f6db06a](f6db06a163545234055edb83ed86e55a9b0b3796))
- Use optional addresses param in transaction aggregate (#992) ([3f5fcb5](3f5fcb51e302eb24c6e90cf4ccb4a04e5d5d0667))
- Add `dynamicFees` property to network configs (#995) ([f25db10](f25db1026a25212af931977d801238e59f9a0e6a))
- Support default value for `Config#get` (#996) ([3cbb2d3](3cbb2d3a3fe01dc543dede76c03116156848f92a))
- Add UTXO feature flags (#997) ([05af739](05af7399321aa08b6f5e045f71d1ba7152375f49))
- Implement `Config#getLoose` (#998) ([65bd687](65bd6876a9ff2b74963b93fb6f2f5849cf3439cf))
- Implement `TransactionData#inputs/outputs` (#1000) ([d63d348](d63d3489a99239cb4c75b1f407b5b2a5b7d0f513))
- Implement `UnspentTransactionData` (#1001) ([2daf188](2daf18849008d927620dd893e255bd85e0441d72))
- Implement transaction listing (#993) ([235fd06](235fd0643222cf77103b74e47fcb30ee1355d6f8))
- Sign transfer with custom expiration (#1003) ([5821826](5821826741af45f942d0742aa8e56520fa2674d4))
- Support additional input for `ClientService#transaction` (#1006) ([5cb3ded](5cb3ded40242b29071dd05edde27cafef5b971b4))
- Implement `ClientService#transaction` (#1002) ([86b7917](86b79179f302b5bf6ed63cbe290ce9832b9c3bb7))
- Implement custom peer feature flag (#1008) ([9ab9134](9ab9134da0e2221aa147daf67b61aee98f29cadf))
- Implement `TransactionService#estimateExpiration` (#1009) ([67bce00](67bce00378dd8075f24122a735d12cc3b4266cda))
- Draft implement `TransactionService#vote` (#1011) ([d15e742](d15e74280a3e318ca634e45876c2cd1e30c0a70f))
- Migration from cardano-rest to cardano-graphql (#1014) ([483fd6b](483fd6bd4dab19b8836a3e7d22531a1daa40429a))
- Implement `ClientService#broadcast` (#1022) ([c4daff6](c4daff65149a30be31f630790f87ac7ffc481da1))
- Implement `TransactionService#estimateExpiration` (#1021) ([cd2135e](cd2135ec4b0c0e56a06703410d66144cdb2769ed))
- Implement `BIP39#toEntropy` (#1020) ([e4eef1f](e4eef1f94a819e03bcece0f42029fc531001a7ec))
- Implement `HttpClient#asOctet` (#1019) ([e908eba](e908eba7bd9146470092e6f5db8ceab634663f5f))
- Implement `MissingArgument` exception (#1018) ([082b499](082b4993524ccb4eb6ce3ffd634a890384217bb0))
- Draft implement `TransactionService#transfer` (#1015) ([25d828b](25d828b1269b2f8b3ac97edff057abf2f96da4c6))
- Implement `ClientService#delegates` (#1023) ([dfff356](dfff356e73b150ab1078ea4384ceadb40c3094c0))
- Implement `WalletFactory#from(Public|Private)Key` (#1028) ([a909f5f](a909f5f6f5c14f186d63734a97a8a480e92aaf1d))
- Expose what transaction types a network supports (#1030) ([26f1279](26f1279e8dd8259ee8d48ca73620692caf94035f))
- Wallet balance using graphql api (#1027) ([219abbc](219abbcf81e74d001bdea73ffcec5f52867c1817))
- Apply managed whitelist to plugins (#1038) ([e515ba1](e515ba119e7c54f86b1a16a0e1b57ba4d84c4e93))
- Implement primary key for wallets (#1043) ([61f6de3](61f6de3fca4eb4ee3936a9e2945841f15ad9216e))
- Implement `Wallet#toData` (#1044) ([c3820a4](c3820a43ed498ae2854c9227757e8aa473c69f7b))
- Implement block and transaction indexing (#1047) ([e10dcc9](e10dcc9c26d121b0942a1c9642ee691a78df12fb))
- Listen for new block headers (#1052) ([be146da](be146da9e3eff91f0bafbd0698826a9a234c9fae))
- Make database configurable (#1054) ([c454186](c454186dcf4aacb2cb560057d18c91bfecc13dd1))
- Implement block and transaction indexing (#1057) ([c687792](c6877927985e463eeebe65009386562340c0058e))
- Add `ProfileSetting.DoNotShowFeeWarning` (#1058) ([dda4bda](dda4bda31ba40a4fe881b92268da97488ea1592b))
- Add `ProfileSetting.ErrorReporting` (#1064) ([6ebbdb1](6ebbdb130b52ea66c7d4627b8f6dcd6372fdf3b9))
- Initial implementation (#1062) ([70dc816](70dc816faf656321e0f8b804d2a59b712f3a97f4))
- Implement transfer signing and broadcasting (#1066) ([0aa5dc2](0aa5dc2a4fddf693e0c3cfc394f2d0ca1f6d67e9))
- Implement `ClientService#wallet` (#1071) ([6d7a0b1](6d7a0b153d653650b15263dc2ef8a625991d0ee3))
- Retrieve fees from `ethgas.watch` (#1085) ([c259a01](c259a01284d8ff72afb7025fb96a8e0cdc34c095))
- Add missing block and transaction indices (#1089) ([e0bd9db](e0bd9db941e1f598130e681b81f5bdf18ba2531c))
- Implement `ReadWriteWallet#displayName` (#1091) ([a886066](a886066ccfef93542a1bd94a5b2572dce7ab56b6))
- Add `ProfileSetting.DashboardTransactionHistory` (#1092) ([e6fa351](e6fa351bb4b2dbc2ca18b2b6492ed88eb3f57d7b))
- Initial implementation (#1097) ([adf5193](adf519357ac1c0daba9d3d5305acd37e791eec8f))
- Set up rate limiting (#1100) ([56e17b0](56e17b045ebebe8b52cb884e3bebe261768f8735))
- Implement wallet endpoint (#1101) ([2b529c5](2b529c55d9dc914b6d0b0bc3e2ffea50a638abf0))
- Implement transaction broadcasting (#1102) ([10292e3](10292e3077a10f5f0caf5dfa4abb55597d9d2900))
- Return state information from root path (#1103) ([b0f9439](b0f94396f440701113f233022735640768145de8))
- Validate path parameters (#1104) ([164151a](164151a7e77418ebd8f85e3e2d7bf4f0a301a339))
- Initial implementation (#1107) ([d209018](d209018f313c90a03d4036519e4cf262d62e6abe))
- Support BIP44 options for identity derivation (#1108) ([acf7651](acf7651f41868fb693b551b916c02d25cc37d45c))
- Initial implementation (#1111) ([95567eb](95567eb40549f396a574e21c38eb716b4de91192))
- Initial implementation (#1116) ([c705cde](c705cde98cd9373e8d4716724ad6acb9644ccef6))
- Implement storage persistence (#1121) ([ae697a3](ae697a38e8050dbb3980990168cf9da0c296037f))
- List transactions for active wallet (#1122) ([abb5889](abb58895e5d34a06163273c1154c57a16ac58190))
- Ask for an optional password during profile creation (#1123) ([b8628e9](b8628e9c50dc96dc96e66bc60eac906cca072810))
- Pagination for wallet transactions (#1124) ([cd547e7](cd547e757b0455b9a9ed61b539119bd7ce7d4b56))
- Implement  `Address#fromPrivateKey` and `Keys#fromMnemonic` (#1126) ([86e7f5b](86e7f5b23ec253c29ece78363c2cdd73cb9f2538))
- Show explorer link for confirmed transaction (#1129) ([f5ff431](f5ff4312a4080073cfe535f7bac706011dd7c8d5))
- Implement `AddressListFactory` (#1150) ([e787e6d](e787e6d07f61359196dc9ba485e6d304dd8d0a4e))
- Implement `AddressList` for every coin (#1151) ([073b237](073b2371c1c15de7cfc8975b4956c5c31afe4179))
- Implement derivation feature flags (#1152) ([df3c221](df3c2210a797cc3a91883fe7beba56de80f78bec))
- Implement `AddressList#fromPrivateKey` (#1156) ([660591e](660591e018c98187d2304344e87fcf979bc54026))
- Implement profile importing and exporting (#1136) ([a24b69e](a24b69e822217949f114c3f4929c1e8f801ec1b3))
- Add username and password flags (#1159) ([60ffbb3](60ffbb353408e531684c1da82d57070c86c79801))
- Support BIP39/44 derivation (#1157) ([7805d94](7805d94e020f6f96945a6d1a552c40c9142eba3a))
- Implement BIP49 and BIP84 (#1163) ([6ad383b](6ad383bfa507096a49fbcb3f4a0c7cdefc25ab71))
- Implement ledger feature flags for transactions (#1165) ([e35cb26](e35cb26729566369748b3a90557ea9f0f39af63a))
- Implement message signing and verifying (#1166) ([09bbcd1](09bbcd1c1711a9223a845ce0ced32bc7f5575b9b))
- Implement `LedgerService#getExtendedPublicKey` (#1170) ([a45dd4b](a45dd4b808a56bacb75492c989b63fe3119dc2a9))
- Implement `HDKey` helper (#1175) ([9af92eb](9af92ebe166b2a020665e07439133c0d19f82233))
- Implement `Base58` helper (#1176) ([0e06791](0e0679139a9e92b10809f93e4412b8f985f557e6))
- Implement more `BIP32` derivation methods (#1177) ([9071959](9071959fb2e94a75ac93bd29090f6d70e6523ba7))
- Add `ProfileSetting.DoNotShowAdvancedModeDisclaimer` (#1179) ([c65ffb9](c65ffb907896646e081af7b33d53f28d846d2fdb))
- Import wallets from ledger device (#1172) ([f8f1737](f8f17370fc901948bff0db221eaabd6d7bc5db79))
- Implement IPFS (#1180) ([22c7348](22c7348eba183761aaa9fece69c15e5ce03944a7))
- Implement voting (#1185) ([27c0e8f](27c0e8fbb029f01956b26bed6435f1a8c59606a4))
- Implement second signature registration (#1184) ([66bfa9a](66bfa9a1f6c9e4462fe40a8fcdf13a7d83648f7f))
- Implement delegate resignation (#1183) ([15753da](15753daa89ff818378d86496a5554726ca3b7d63))
- Implement delegate registration (#1182) ([1ffe1c3](1ffe1c3332de65d3975d2f77e3cb3fd3826a8329))
- Implement multi-payment (#1181) ([f48847a](f48847a8cfe9bb50e7673048920d5ab6c8dab0fd))
- Implement bulk address import (#1186) ([ce7d965](ce7d965d330e273fb8b3130b12ff2f37c8c5e2df))
- Expose public key and private key import for wallets (#1187) ([e83e544](e83e54468a4aedc0fd35894f32f65d57e0347baf))
- Implement `UUID` helper (#1204) ([e23ad13](e23ad13de5c775d89fe0a01a80305e4ba6036a94))
- Add TSDoc comments (#1191) ([7c4a69b](7c4a69b3d59a3674e85c9a22a6634ee7f8d92cbc))
- Implement WIF and encrypted WIF import (#1207) ([846c6f4](846c6f4a671a2702346d23f6ced3895f4829beb3))
- Implement `WIF` helpers (#1209) ([a187a09](a187a096834440eb664a08105776385737f4ada0))
- Implement `LedgerService#scan` (#1212) ([bac3e2e](bac3e2ebc8446b95336d23cd658799646ff8d7d9))
- Add TSDoc comments (#1193) ([9f14cfc](9f14cfc9003169762db1ce4a84c8e905257462b6))
- Add TSDoc comments (#1198) ([bb2f2e8](bb2f2e8dfbb9fc11fa33805aacf84dd0d27fcd20))
- Implement BIP44 compliant ledger derivation (#1213) ([dc24ea0](dc24ea0fd0126724b3c477584fa9af312d626315))
- Initial implementation (#1217) ([5e86eb4](5e86eb491a189163a2db762cb71dd56086ca047a))
- Add TSDoc comments (#1192) ([7d95771](7d957716c90d6b7c1c0427296433d94b09e4fd7e))
- Add TSDoc comments (#1199) ([28ad8f7](28ad8f7eb325258e41bf5e3a4b79d7278918049d))
- Implement transfer signing and broadcasting (#1219) ([dd5f1cb](dd5f1cbc6ac099361e0788059053136946cdd42d))
- Retrieve transaction, wallet and delegate details (#1220) ([6693580](6693580550ee01b60aa438eab8e64e6712bb8885))
- Implement wallet generation (#1225) ([d0ffc13](d0ffc13acd8eed08c0b46c11cc496425bf8c8b67))
- Add TSDoc comments (#1194) ([65dbdf1](65dbdf1082771547a7b1bddfb61c1e4791a4bd3a))
- Add TSDoc comments (#1202) ([904da0d](904da0d852de5876989a893c47327af2064c83f9))
- Add TSDoc comments (#1200) ([ac8da2d](ac8da2db75cfc1c555c6a8fd1ceb62ce28586714))
- Add TSDoc comments (#1201) ([290cbb1](290cbb18742a5ddb7ab21860991578463af2d45a))
- Implement message service (#1228) ([c3bfa90](c3bfa90fc521a494c4eeb0d36a857579e96219b3))
- Add TSDoc comments (#1195) ([58bb8c2](58bb8c215278d1e6c9c0e062e8443d0246c0b83f))
- Implement storage that uses system configuration path (#1232) ([e06cd77](e06cd77c263c5556b1d753e34e9ff11a14fb4748))
- Sign message with wif (#1244) ([aacc2f3](aacc2f36a31b649092064130cf6a8aa302924c57))
- Implement transaction listing (#1247) ([a69fb46](a69fb46e9daffa4c62f44c9fb4f6187fb2dd77c1))
- Initial draft implementation (#1261) ([9eef078](9eef078c57d9503d33ee83923daa354704c06425))
- Initial draft implementation (#1263) ([23ea9dc](23ea9dce4fcf3b346588d015e1bcf8b5d7f582a5))
- Support `vendorField` search (#1280) ([f52e093](f52e093da42ccd27a6bda85e6f625a2ee5fbf818))
- Implement portfolio breakdown by ticker (#1281) ([af67a59](af67a59d3e443e6bf3bb2f8b5e417efb6119b34a))
- Add kusama manifest (#1306) ([1fb0a70](1fb0a7048855a7095106366c3a0f693368bdb0d4))
- Add basic naming conventions (#1310) ([95b951b](95b951b336ceab4abbe243ae2741ca95f49556b9))
- Add TSDoc comments (#1196) ([94bc243](94bc24381dca15db86858731c59588e10244048d))
- Add TSDoc comments (#1197) ([6c46274](6c46274cdcbca244e48c8773189c41d129e2ffbd))
- Broadcast transaction using graphql (#1034) ([9597abc](9597abc76b9f0ded77168b8cfac8595337ce2acd))
- Add tsdoc blocks (#1332) ([6c64ed5](6c64ed5a1027651b7167df2eab40eb508351b6af))
- Implement `AttributeBag#hasStrict` (#1340) ([b1f5bf1](b1f5bf1d2b5ac934f97bec556e1c534218716d03))
- Store transaction fees (#1333) ([f0566fd](f0566fdb463d706f8226276e6f3f4de44750bdef))
- Add missing interfaces (#1348) ([c7a6c1c](c7a6c1c158857a0608656bafe40177c23d07b31b))
- Store recipient address when indexing (#1344) ([c5cd33f](c5cd33f23d4272d25b7fa0c86707f1b517ba1a59))
- Introduce event emitter for internal events (#1353) ([5a831ff](5a831ffccd58f148aa480a65604d90a85eeb4b1d))
- Add coin name to manifests (#1356) ([38faf34](38faf34cf7b0716351fe012a63d42517c59e2935))
- Implement `IProfileRepository#push` ([5b34d52](5b34d52f23ded34a53bc00158e004ac1c9ce02da))
- Implement `IProfileRepository#dump` ([78396fa](78396fa17c173aa11a083d74bc34d6b8b272faee))
- Save environment on change (#1375) ([a38ad46](a38ad46fe7bf19c27788b49c18470617be0bf609))
- Initial implementation (#1384) ([cf56c97](cf56c9784f35bee372213a754924543f16f8542a))
- Implement `IProfile#hasCompletedTutorial` (#1381) ([5d996bf](5d996bfd622a2570b247c7e0d4c53fefc8b24145))
- Implement `IProfileRepository#tap` (#1390) ([2056a69](2056a696f3bdbf795c392b4a7c11435e1c724785))
- Add missing coverage (#1413) ([e1d2d0e](e1d2d0eafa744b8da1eb53d191b724542870ea9a))
- Implement `ClientService#transactions` (#1426) ([033d8a2](033d8a266b960a771d112e85ea7628b0c7dccd5f))
- Configurable number of parallel requests (#1436) ([1386fb9](1386fb9b9248df23a1d148c8ebb8ca2695eed856))
- Initial implementation (#1446) ([6dd9703](6dd97034b124477341957b3f0e210d093c652716))
- Implement `IPasswordManager#forget` (#1452) ([00188ff](00188ffa445f78469149a0852a73f14bbc27de75))
- Create complete tutorial function (#1453) ([a3f8b2c](a3f8b2c49d603a89a9614b9f31c3c923ed34d277))
- Add usage examples (#1409) ([2a80f01](2a80f01357861ded15db4040fef4f8e30fdec2f8))
- Implement `PeerService#validate` (#1468) ([b900d19](b900d1983b342a33a7c75b2e3c909f869f59916b))
- Add support for multi-balance wallets (#1469) ([aca833b](aca833b26f92aa73135a1321bf38575345eb74b8))
- Implement secret derivation (#1471) ([320c625](320c625d049ac0b0a77f7efaf5066192ffb6be15))
- Implement mnemonic derivation (#1473) ([2c232d9](2c232d952b11a70311c06091d056adeeba6ac708))
- Return default values for all fees (#1478) ([ba4ada1](ba4ada1b8ad4657729ff8dfdfb20cdbd6be3e5fd))
- Implement wallet derivation (#1476) ([3de1dbc](3de1dbcf19fccbb69a92693ea97bfa691f9418ea))
- Initial implementation (#1466) ([f0e1be4](f0e1be43fd565586d8ed8eb939927fe517a78498))
- Implement profile status service (#1493) ([a8eb772](a8eb77205f9608abf7e04c4244db7ac45a9b2c30))
- Implement `ClientService#wallet` (#1501) ([51f4c3d](51f4c3d2edae4dfc96e312574151198e24ea47d8))
- Implement `ClientService#transactions` (#1502) ([cf8bd44](cf8bd44cc1ae241ec3958015cf9ddae105d48612))
- Implement `FeeService#all` (#1503) ([b7a6afd](b7a6afdde572027c8e9b43e3c72ae3e941c25d81))
- Implement `MessageService` (#1509) ([9701fa5](9701fa5da69189a82b9b1bb0249f95925b591580))
- Implement `MessageService#verify` (#1510) ([b531783](b531783e7dfc45b34246ad20bcdfce2d1bee8567))
- Indicate zero transaction fees (#1525) ([f8bfd82](f8bfd82831c24a8a84391570a232fecaebc514bb))
- Message signing (#1537) ([6e1c314](6e1c314b9f5fd0d8afd7d5081896a3fb26a18240))
- Derive address from public key (#1541) ([5678e62](5678e62b1c5ff9aa52e0b2b0b74a9859389f2640))
- Add missing coverage (#1553) ([3807064](380706494e79ea8d791028452b87a89cbf4f8bb8))
- Implement `MessageService` (#1557) ([504c39e](504c39ed156b9bcbe998dd55f8907cc992b6ee39))
- Add missing coverage ([11fe52e](11fe52e2cb89b045b22c4f8ecf4f4007f128f61f))
- Add BNB networks (#1592) ([20f00ff](20f00ff942f93de7c62bc9c7864cb817fd80c418))
- Include tokens in network manifest (#1598) ([c54fd89](c54fd892fb80b578c732116c68d2275ac6e639f7))
- Add `timestamp` method to `SignedTransactionData ` (#1593) ([da89a0c](da89a0c2e359d965d016668301e6ca26f768fe82))
- Add `BigNumber#sum` method (#1602) ([fc11ab7](fc11ab720e4fb18e961fd9831776c3655c5d0ec8))
- Nano transactions & broadcasts (#1520) ([66c7a36](66c7a368656b8b5e18734e94c61579458640bc45))
- Implement `WalletDiscoveryService` (#1620) ([b6066c1](b6066c1f6e992f91f5d2d03df9edfb58f664e1d5))
- Implement `BIP44#stringify` (#1632) ([a2e186d](a2e186d49c87de878d43849575eaec1f9fadadf0))
- Store decimals in coin manifests (#1643) ([f37ae32](f37ae32ab862272af6e00e2b732b22d678edc395))
- Add missing coverage (#1663) ([c7dd596](c7dd596a69cb9e7f04741d79053c37cb5f54cbfb))
- Add transaction to manifest and fix braces (#1662) ([bde0140](bde01400493e8126309dbee55e592211740e9255))
- Implement indexer and server for news (#1670) ([0222118](022211873d3f6df1cb9296d1d81902a751e3c93c))
- Add missing import ([67f02b6](67f02b66b21b01fc50e071fbbdfcaedc05ce125d))
- Implement `IReadWriteWallet#canWrite` (#1699) ([0fde8c4](0fde8c4455f8f457ad66a28481e1c05b27b054ae))
- Implement `LedgerService#scan` (#1705) ([8db9b06](8db9b06fb839920075a6dc7089c887d203cf4696))
- Reset dirty status after persisting profile (#1703) ([c2c749a](c2c749a65a2a7c1c9ac29e39fa439260909a926a))
- Derive addresses and public keys from ledger (#1714) ([9bcc790](9bcc790032e3691c54f2c90f579d7b6af82efeea))
- Implement `BigNumberService` (#1718) ([145fc8d](145fc8d29dba4559eba10c8fa869c923694ec73c))
- Add `compendia.testnet` network (#1721) ([efe1179](efe1179312fa1b5a569e84ae3863f6e637ea6831))
- Implement `BigNumber#toSatoshi` (#1729) ([89c2b62](89c2b6298f557f0010a566c858b3dbb243db92b3))
- Implement ledger signing (#1770) ([ab0dfe5](ab0dfe5c82354516fc02baa4510786123a0107c7))
- Add delegate resignation DTO (#1801) ([ea2949f](ea2949fdc23db5efb6b9cde6a32006b7705977d6))
- Implement transformer for `client.wallet` call (#1836) ([ca09c4a](ca09c4a17bbc1e6243ac9c3548dd6899dd392434))
- Implement `TransactionData#isReturn` (#1837) ([9b0dcc9](9b0dcc962bab0bd22d99e311a1d220a753bb6daf))
- Add test cases for signed transactions (#1825) ([fa50729](fa507299e15a38547ed5376032634beb5ff526bd))
- Implement `TransactionData#isReturn` (#1841) ([543240b](543240b9af97ae785c521d3591458b9291e0a9ee))
- Implement `business.withdrawal` (#1854) ([d1e6629](d1e6629c4d4b0f13c4236416835e9adba4449c19))
- Implement password removal (#1867) ([3faca55](3faca55ae1dc27526c86e6b2ae9aef4b3e0b7630))
- Add missing coverage ([253f7a8](253f7a84d1ab572b1eb59c83a2e37cf1804f1754))
- Expose number of multi payment recipients (#1877) ([dd6c449](dd6c449e211e5954c8e1ca7c49784d46e7981f00))
- Indicate if an import method can be encrypted ([395e7df](395e7df0130c2808a8433f0dba2ca8eb9c62cda6))
- Add missing methods to `ExtendedSignedTransactionData` (#1889) ([46d0718](46d0718c98eb75cd946afa66ffce9d7d3d13a4f9))
- Add missing methods to `ExtendedSignedTransactionData` ([0a9e2c4](0a9e2c480a4c255643110abc41792fd1939f8ce8))
- Implement second WIF support for MuSig signing (#1898) ([f114e81](f114e8123997c6368d09279b72c0f0367a0830b4))
- Add final MuSig signature with ledger (#1899) ([633549c](633549ce91b61c927bdb0f6e122cf38a36400349))
- Add MuSig participant signature with ledger (#1900) ([cdd2f0e](cdd2f0e1e54521f5e034ba181a77297be4e1ef4f))
- Implement methods to identify ledger device model (#1906) ([5d0eccd](5d0eccdad7889b08ac9362debf91109d0f8e56d5))
- Expose word count for BIP39 passphrases (#1908) ([29969e3](29969e3bc3465ae7012538ade0c66d440abc2084))
- Implement `WIFService` (#1873) ([6d7cb1d](6d7cb1d69a1326d8ffde82c06ee10619f3101122))
- Sign transactions with secret (#1925) ([b15db55](b15db55b47868683d27b75a654e57a3dfa5b42cd))
- Add `fromSecret` to `WalletFactory` interface ([813bbc0](813bbc065fbfc8c7d75c3cc83bfcfc25b8181ce9))
- Add `secret` method to `SignatoryService` interface ([1f47ec5](1f47ec500e0c8a3822ecb1ccc5da1ec35130b768))

### Changed

- Readme and cleanup ([67739fe](67739fe6dce961f75465497309d3fd7adab25320))
- Update dependencies ([3525bb7](3525bb70ab10a96986e9000e50ab158b3d8ba22b))
- Update dependencies to latest versions (#7) ([437dd82](437dd82293f45cb1163153fba46395394b74b004))
- Implement DTOs per adapter with a contract (#10) ([ba882c5](ba882c5f7b4e72d0d458f9a2d5d0c7671799dd24))
- Update dependencies (#12) ([4c03c69](4c03c69c83a0843d22289224a636344bd80e0029))
- Organise concrete implementations by token (#17) ([1f01292](1f012929e809ef30b23f3b0d775e9b1577aeb217))
- Consolidate types for `Record<string, any>` (#18) ([c0884c3](c0884c35c1c9706c86d21195ae8edf2c28416031))
- Move DTOs up a level to flatten directory structure (#19) ([cd9e430](cd9e4307ce68086e0b87471456c2b69fe7bdd449))
- Basic setup ([61d2169](61d216938bb7d8e32e90a9d1376965fa98899c06))
- Bump acorn from 6.4.0 to 6.4.1 (#25) ([8e67aba](8e67abab163c329f0179f4b4db313fef5cbfdd1b))
- Disable conflicting eslint rules (#28) ([7f9dc89](7f9dc896aaed32e8eb46a51098a5fe1f2fd75684))
- Update dependencies to latest versions (#31) ([628dff9](628dff91885f6c6ce21700fa6e80373b8816049a))
- Update dependencies to latest versions (#40) ([6aee249](6aee24925fc126082258d1b5f52324e241d9acf2))
- Update dependencies to latest versions (#42) ([395ae36](395ae36a453ffd52cd3e3098fb4c846890778f1d))
- Use @liskhq/lisk-transactions-old for mainnet and testnet (#44) ([b946b52](b946b52291e9ff428e1c36aa5e3a6724cea104ad))
- Remove getBridgechainsByBusiness (#46) ([9b89150](9b891508201f0fbae587318437d7403fed50e4a1))
- Remove block methods (#49) ([187a678](187a67871b46f69c720fc788d0d1750718ff5fce))
- Use yarn workspace with multiple packages (#53) ([e38562b](e38562b31d9fbcef42d54ac4ce4d3a6bfa88e19c))
- Setup boilerplate for NEO, XMR and XRP (#58) ([ca079e5](ca079e5264ab0d1e23544b5b9553ce312bf82031))
- Break down price trackers into multiple packages (#61) ([aad6b24](aad6b240418629e004b09aee2b1b9e8ea38b2c02))
- Move everything to its final location with matching names (#63) ([2684b89](2684b89dcbc3a797c73e3dc9d66fde89fe0ec1ac))
- Final package names (#64) ([7bbca21](7bbca2181828d09b4edfdc22997fbba590afb3b6))
- Expect an array of transactions for `#postTransactions` (#74) ([777d782](777d78218555b2d186d41b1066a34f3cf8bebb6a))
- Make all public API methods async (#85) ([72a5dd0](72a5dd0becd9bdc15f93ddbde2d3630a35141ab7))
- Return normalised object from `DTO#toObject` (#87) ([8e413df](8e413dfce4519374a1494426d986bfe26681dc01))
- Remove unused block code (#90) ([64127a7](64127a740277b8e472d0c272671ac1948fc3d968))
- Standardise the input for the `Transaction#create*` methods (#95) ([b9fe08f](b9fe08f3743e807c51559bd9d1734386f21a65d8))
- Use ripple-lib connection for API requests (#93) ([31617bb](31617bbd23d4d0915d3d0880f111aee6c860cdd0))
- Final method names (#104) ([0b239fb](0b239fb32139dc04fd8b6c2bc35e58f06ee34f2d))
- Drop `ClientService#searchTransactions` and `ClientService#searchWallets` (#105) ([9cb7f2b](9cb7f2bc46c1134d21e0b38fb278bc9bcef7a23d))
- Merge `ClientService#cryptoConfiguration` into `ClientService#configuration` (#106) ([4d5a414](4d5a414dd04deb66b455e284cd529152ce5e1168))
- Merge `ClientService#feesByNode` and `ClientService#feesByType` (#107) ([9a6406b](9a6406b7fb54cf1c5b5d9f0601b50d04f762d1af))
- Turn `PeerService` fluent helpers into options (#121) ([9eaecaf](9eaecafe8987ae1432aa72b6a64d31886caddbb8))
- Always collect coverage ([529876f](529876f6194f48466d6e873ed2c6646074af3340))
- Update manifests (#123) ([6dd5e40](6dd5e40e444961704ca9c431aeb2f1f8b5c2fcf0))
- Update formatting ([a3a2090](a3a2090e8c70da742d934a81452d421ef09e1b55))
- Replace bitcoin-* libs with bitcore-lib (#136) ([ccc6b1a](ccc6b1adc8e661f2c379e8284b720ff49a0d721e))
- Include basic network information in `manifest` (#145) ([54e59a7](54e59a729ad0b43db1fcd3ea3714b7e63deaa380))
- Normalise `Factory` options (#144) ([04c02c8](04c02c890028bc4ee0276258b4759bd89930f662))
- Rename `PriceTrackerService` to `MarketService` and add documentation (#146) ([aed26ab](aed26ab540a1ee8090facc072a3e0117436c707a))
- Use the platform-sdk-server for communication (#151) ([478a790](478a790db28c7c84d22d54e56896d4b53eb03b66))
- Setup doctoc and formatting workflow (#153) ([7738402](7738402942a46b016bbbdbd6a01abe425ef7d410))
- Update manifest (#154) ([7b0775c](7b0775cd978dd73166531a9865b702887a7e7f25))
- Remove `IdentityService#keyPair(publicKey)` (#156) ([e540ed1](e540ed17abff679924b192905ad635edf0ce85f8))
- Use `platform-sdk-server` for communication (#158) ([db0db34](db0db34d409464d7b0574b4c0549b7e6c33f0e37))
- Remove `ClientService#configuration` (#164) ([2b5b501](2b5b501b56c003b5b29c4c354f18e187cae9cdfc))
- Update manifest and docs (#172) ([a2229e0](a2229e08eba98b833ac9a4b8276aa38380cbed0b))
- Split up `IdentityService` into subclasses (#174) ([13524ae](13524ae738f9a5f496eacf54759bfc0eab0f9d51))
- Force network name to be live, demo or test (#179) ([33dbb69](33dbb69516c62a3c09b2064623019385a767c5ac))
- Normalise `ClientService#broadcast` response (#165) ([32a8067](32a806706706191056b97a9d301e26616abdeecb))
- Update `IdentityService` documentation (#187) ([38e34a3](38e34a3f8f9a7a4d4ce6a90483e29a32ad594922))
- Always treat `nonce` as `BigNumber` (#200) ([e6b0b99](e6b0b99bd8b12e84baea0c5b423db00d09964c30))
- Update manifest and documentation (#201) ([e5ae3ec](e5ae3ece92a0b32503760ee7b074ccfae232fab1))
- Use `BigNumber` from `platform-sdk` instead of `utils` (#203) ([47deb97](47deb97c04c175fd4fd092b4aac3b7a2a1c5770f))
- Group repeated `Buffer` behaviours into a class (#216) ([319d24f](319d24f35dcf1b0d2ad98e153cbac3727c15311e))
- Automatically instantiate the `LedgerTransport` (#217) ([aee0149](aee014963cf64f8e8cf70053796d80040725ba7d))
- Return `undefined` for `TransactionData#memo` if it doesn't exist (#220) ([97ae565](97ae565d9b83e02e1069e8e6ac09393d16341748))
- Expect an `object` for `TransactionData#asset` (#221) ([710796c](710796cf0f899ff2a91feb89e8c81babd86acb2c))
- Remove `TransactionData#nonce` method (#223) ([37b9d7f](37b9d7ffd42f9e819aa9009e4e675aea17eeba85))
- Remove `@arkecosystem/utils` dependency (#224) ([b3940cd](b3940cdf164f231599a1350a4b17307098b31b02))
- Return a string identifier for `TransactionData#type` (#222) ([7079406](70794060d88b3f7e372d291e7370419e1481e5dc))
- Replace `AbstractFactory` with `CoinFactory` (#247) ([111ee2d](111ee2dd9514ef4e9cddf4a75c772a93d4f715f1))
- Implement `Coin` to slim down `CoinFactory` (#258) ([651068a](651068a73b7e736ecbc23cfef36ac196f2d27d6e))
- Store network object in `Config.network` instead of string (#268) ([fc870e2](fc870e2c2db1876c5204d71804f089fef7e8e7c4))
- Generate API documentation with typedoc (#276) ([4cd3469](4cd3469b7b0979f4c9f146c876725977793ca184))
- Setup editor support for yarn berry and typescript (#303) ([01cd9e5](01cd9e5f8c5b7fd0e386cbc5c7c115552ded7a16))
- Remove imports that cause issues ([dff61fc](dff61fcde7b787e44d7011f503fdd673f896431f))
- Make `BigNumber` immutable (#317) ([9478fc4](9478fc48784c248f390891b52f422bbb7943a73c))
- Rebuild documentations ([8de4569](8de45696e14b2239dcb66e47aa33923b03328807))
- Update dependencies (#320) ([df91763](df91763d9dceef80210bedacd2b8921ee2e31044))
- Remove `PeerService#searchWithPlugin` and `PeerService#searchWithoutEstimates` (#321) ([519595e](519595e748969f3d90d0ac14fc05e225ecbf4f13))
- Rebuild documentations ([4298d41](4298d41b4d708afa41be876cd04ceae2247299dd))
- Change duplicate error wording (#329) ([7eded51](7eded51e98952f7a2ef93fb238d6589935cfe751))
- Rebuild documentations ([4dfe282](4dfe2820d91803a6bffa33f3069b574530f070fc))
- Extract supportive functionality into `platform-sdk-support` package (#338) ([e02ed11](e02ed115ec1c24ede4179e739300428240e9c333))
- Move crypto functionality into `platform-sdk-crypto` (#341) ([50c6348](50c63489c193e465b230d15923e4f05d2f30c301))
- Replace `bent` with `reqwest` (#350) ([bb2ad1d](bb2ad1d9f0be8f10887690ea5980315a876bb273))
- Update dependencies (#357) ([d707b26](d707b26496cfc25d34ba99ac69ecf8c4ec8b22f5))
- Require the consumer to specify an HTTP client (#360) ([d8dbe30](d8dbe30a5626c6eb0f14b6b7dca73567e8866b0d))
- Fix type inclusion errors (#367) ([2625503](26255039cf9cd3d295f7baf9b2ee4abf15603a35))
- Automatically persist contacts as profile data (#379) ([1312f7f](1312f7fb50d927d86bcae99441a0effdae5fe9e5))
- Rename `passphrase` to `mnemonic` (#383) ([f7fc2aa](f7fc2aa8c8c8fdea0b3a9b7df559accf3093f4f8))
- Use container to manage references (#386) ([510e7e7](510e7e72359a561d1ff4231361fb9a073962b824))
- Rebuild documentation ([9ed7ae1](9ed7ae19880a650340c035b30a3c8ee3020effa7))
- Replace `@hapi/joi` with `yup` (#400) ([16d5d2f](16d5d2f75865fe0cf6b98315b7bb7520b8aa4c5f))
- Pass supported coins to `Environment` (#401) ([1493672](149367222a498b2555e06eb34d715fc829776492))
- Rename `secondPassphrase` to `secondMnemonic` (#408) ([a74e054](a74e0549c1af97ec8ceac54355fa7f55ed0f6215))
- Rebuild documentation (#413) ([361ae23](361ae23880fd52c997c4808c5097dae4fbef5190))
- Update `LedgerService` (#417) ([e03a875](e03a8753d255005c34b2294b32b05483e1b17df1))
- Fix formatting (#422) ([6e78f95](6e78f9512b73dbc77d31b2d6305de70b7c2829b3))
- Use UUID as wallet identifier (#423) ([f59dbae](f59dbae1ee62b976705ec089601c767c2cb79093))
- Pass in `HttpClient` instance to markets (#424) ([3adf924](3adf92496a5b7730fb782e0b3b92aeda6f890b90))
- Make `ProfileRepository#all/create` sync (#426) ([285453c](285453ccac52128e24ed54136328f464d55f535d))
- Setup boilerplate for `platform-sdk-json-rpc` (#394) ([baa6477](baa6477645b6329010a951d951b4344ba4871e6c))
- Replace `passphrase` with `mnemonic` (#427) ([1993231](1993231f1ea742533d8647cf96ddc8babcdcecc4))
- Rename `signer` to `signatory` (#434) ([1c0d1d6](1c0d1d6b0de9d356caf60e11afa82a3401f7735d))
- Rebuild documentation ([592e212](592e21231f145d1052bbe3aa33065c76d6641e76))
- Less noisy coin proxy methods (#436) ([9e8e003](9e8e003efedd513f9585210a3eaf75780f163c26))
- Rebuild documentations ([329dc73](329dc739d325df7b951f77fb47a4d5e53cb14809))
- Rebuild documentations ([9ddc7ea](9ddc7ea829827b5dbb6cf9bab4d38bf64470642b))
- Require ledger transport to be explicitly passed in (#441) ([56b38e8](56b38e8e8af8e9780f5789b78de53ee6629c2a92))
- Rebuild documentations ([eeabe1b](eeabe1b835505b1fdf14b8593fddd6868873ca5e))
- Replace `qrious` with `node-qrcode` (#443) ([e2bb32c](e2bb32ca12c5f3136ff860ee22d951f89e9e06fe))
- Update dependencies (#414) ([b899a96](b899a9624f89f8064a6fda6c095e665fab48bed1))
- Rebuild documentations ([4e1414d](4e1414d281e153c2bf082123abbd4526218dc671))
- Turn contact POJO into a class (#447) ([661793a](661793a4ae59393b7e1872e0a939c3a753aa821d))
- Expose voting support through manifest (#456) ([bfcdf08](bfcdf08605ab4f0e4d29805564d2f82b973b414f))
- Use `Coins.Config` by reference (#461) ([1c385c3](1c385c34d39b26f13371b77c595fd873e827c899))
- Rename `Wallet#create` to `Wallet#import` (#462) ([64907e1](64907e13a008210d1ab2bde5ef6b533f2354ce8c))
- Update dependencies (#471) ([4977bf0](4977bf01cf7749cf2b99a006bd2a7efb663d267a))
- Remove extraneous `await` ([681fc24](681fc241e4d9798401e373c4b1def4bed7a961ff))
- Rename `WalletRepository#createRandom/createFromObject` to `WalletRepository#generate/restore` (#472) ([7ac4fd6](7ac4fd6948d69e9e47cd6517741a0e296e5dc9a9))
- Update `ethereumjs-wallet` to `0.6.4` (#476) ([f212563](f21256326f25ca17b0e50ea42b24688e7361aea0))
- Merge `WalletData` and `DelegateData` (#475) ([9788bc7](9788bc7522a6c803ac79377b1e3b8b4924d1dabe))
- Update `ethereumjs-wallet` to `1.0.0` (#483) ([e28f8c3](e28f8c3f7f25ad735ccc1dae1ca346ec93d967b3))
- Update crypto dependencies to 2.6.42 (#492) ([4ee8e95](4ee8e951960b0f65645564e01dd7f5d350f6a71d))
- Pass profile to `Wallet` and `Contact` (#494) ([86c4e4f](86c4e4f9b1c5472694cafa3e9d1fbda9c7830607))
- Cache the avatar of a contact address (#498) ([1386e62](1386e6298fa5e5259c86942f6f511b462e19e1d6))
- Organise source and tests together (#501) ([d37a57f](d37a57f565977ff872f01c377ed52e788585a085))
- Use `@vechain/picasso` for avatars (#502) ([5f4f02c](5f4f02c81969607cd1d618366f64132811f1121e))
- Use deterministic values for avatar generation (#503) ([8c0f4b8](8c0f4b844711ca7091e7c18af2509daec78d5ad4))
- Update dependencies (#504) ([f647022](f6470220ab71e72ff8b628ba2fcee9b25b4bac27))
- Organise models into separate files by type (#515) ([5623239](5623239418c58a039b0ed90c091dbc38c9676fdc))
- Use configured HTTP client instead of `@arkecosystem/client` (#521) ([2938d0b](2938d0b86474b2be618a07f61bc108eb535350ba))
- Rename `ProfileRepository#get` to `ProfileRepository#findById` (#522) ([ec8d4be](ec8d4be2b91e923b172f644e438500145a785c57))
- Rebuild documentations ([f8b218d](f8b218dbc8c428fc4f7bb93d0a34dbd3fabfccd2))
- Replace manually maintained API documentation with typedoc ([d638f5f](d638f5fc1808cfd791d08fac64e04e8febc694af))
- Organise profile setting keys ([1dadcbe](1dadcbe738ae2bfd6c21125f98551da990edf1e2))
- Update feature list for ADA ([c102578](c102578525fa7f11685683c32787648ed6c8f87b))
- Update dependencies (#526) ([584b7d5](584b7d5df61e01ec70962064cd3d44247dc3e2f5))
- Update docs link (#527) ([00e7436](00e7436e8f41f426c0f54e21922ec58aad4a957c))
- Expect coin to be a string (#528) ([74bcd0f](74bcd0f2317ac21d06dd18276908fc0a81d2cda1))
- Update links and package names (#530) ([89e4717](89e47170daf2f4a550b6bd5c8d09a6cd275c9a88))
- Migrate from `eosjs-ecc` to `elliptic` (#535) ([6d96fe9](6d96fe9b84f0279b1d24bcd7f00ff650d848e6af))
- Update dependencies (#531) ([24bdf6b](24bdf6b47add0e28932be5c0e5ce16ee6359dce8))
- Rebuild documentations ([a40e3fa](a40e3fabc9f7548db686e2e8f4fbb6e2f1fdc85b))
- Update examples.md (#537) ([5342de1](5342de198a92412d36edcea632bba84869774049))
- Rebuild documentations ([526e738](526e738c8800fc3159825b0506126e3f65131ae3))
- Rebuild documentations ([8708d4d](8708d4dc4cc523fd5dd1a39b29d406327326264b))
- Rebuild documentations ([cf40837](cf40837e3159f742530a49d90f68e76042ef2f21))
- Rebuild documentations ([2486aef](2486aefe692b28305a8e2866880682ee65fee47d))
- Implement fluent interface for HTTP clients (#553) ([d510108](d510108f138333020cdc027f5671a40dc1b468a8))
- Rebuild documentations ([7068a7b](7068a7baab291ad971e303085f32bab846b1b461))
- Update dependencies (#559) ([2884e44](2884e44fa1454cc5e1fc85b7732823fa66ddd51b))
- Update hosts (#561) ([8f1f7cc](8f1f7cc572e846c6e4fd61291aa6c883dc39d8c2))
- Rebuild documentations ([b2ed289](b2ed289bc0253dbf2489a811020d2052a538e15d))
- Update dependencies ([685f68d](685f68d9b63a1988ff1b8a2a56d08d27d421f532))
- Remove `sodium-native` dependency (#565) ([7900eaf](7900eaf9aeead66b80dc1e8bb0fc5d02a6dbd69b))
- Detach contacts from wallets (#573) ([e20d67c](e20d67c2c0b6e64c7c7b4b9413c90f5da0ddc769))
- Rebuild documentations ([8efbd01](8efbd0101e4f0d84aa115018c652fd49f4d7b59d))
- Fix documentation links ([99c87e3](99c87e3c3e1d3e6d2bab283091eca9e2ad918963))
- Treat the profile name as a setting (#582) ([3654f77](3654f77e3fe85eab411c362c754893ec02e19d48))
- Use browser-compatible argon2 dependency ([92a881c](92a881c784186bedefca7decffb1b3a1b086e90a))
- Allow strings, numbers, booleans and objects for settings (#591) ([7df67d9](7df67d97364ab60f531e96cc734da6cb27fa9ce6))
- Return type-specific transaction DTOs (#592) ([6bd1227](6bd1227f2002cef035edd0fd374a00ec026c9afc))
- Move authentication behaviours into `Authenticator` (#597) ([c5e58e0](c5e58e0dfc6f44f087a74b691de15cf4d307bf0f))
- Throw an exception if the wallet failed to sync with the network (#598) ([918b126](918b126dd540e22dbf1fb8df0479cf0fe4c1ef1e))
- Export contact address types (#603) ([b7676bd](b7676bdb7676b9041fff6f472d04ae5bb43a3e7d))
- Streamline profile repository methods (#604) ([562a78f](562a78fcbe4c158821f13b343371e0e0e53ab62c))
- Rebuild documentations ([54b894b](54b894bb8c8ce5a1964771bdc3317627b98f070f))
- Rebuild documentations ([1ddee2d](1ddee2d5db96e2f3567795a75e296575d633413a))
- Pass query to transaction aggregate methods (#631) ([1ddd635](1ddd63514d0ec73f04f7c3d034c72bf05a752147))
- Mark transactions as signed before broadcasting ([37649c6](37649c65ef6800b409af3711758267265c15d8fb))
- Rebuild documentations ([44b696a](44b696abd998943f052087a3f3f286f933d1c3cf))
- Organise by domains (#639) ([59c75e7](59c75e763c098535a72f72d05e24b54d945e2061))
- Rebuild documentations ([f3e833f](f3e833f84982e3642d922fa8c0acb4b950f2ca7e))
- Only return the ID of a signed transaction ([0482c98](0482c98bf0161545a7cc2d96d10bd41699558c80))
- Rebuild documentations ([d68ec07](d68ec07148ba0fcd1af4ecafb18ed9ae4b30c44b))
- Update dependencies (#642) ([3b30bae](3b30bae50f0f1e61a3f9f3005fcdec9635801afb))
- Return timestamp as `DateTime` instance ([bfef4a9](bfef4a9b5954b19ed6571f5abfd7223802a68a98))
- Return empty array from `TransactionData#recipients` ([5245c5d](5245c5dc33e9d8c1813556d2be9b26d66ddb63e3))
- Default decimals to 8 for `toHuman` ([8e1939e](8e1939ecbf0c95e3461c1754b16f86e4fe6fe1b1))
- Update dependencies ([2f2e8ac](2f2e8acb13b0604f7125879754511841f45b8e5f))
- Determine transaction type based on `is*` methods ([be4101d](be4101df523a513d56908b8d0991e06330b430ac))
- Serialise and deserialise transaction after signing ([d0c61d1](d0c61d11ffc54cd052b8b35de0d2b86c108a33f2))
- Use helper methods for wallet balance and sequence ([50e7221](50e7221fe22e023525cac611c37d9174769f6888))
- Update dependencies (#655) ([05cec1e](05cec1e33031eb2c8577963289368f1ea27363e7))
- Rebuild documentations ([40178b0](40178b0d214a0e01ce0ae1a5f69bb0394dc67d8b))
- Expose more information through `SignedTransactionData` (#659) ([00b48ba](00b48ba0d8bbe8446f19094837fbbfa7d9f32770))
- Rename `AutomaticLogoffPeriod` to `AutomaticSignOutPeriod` (#662) ([7d6fbee](7d6fbeed8fa8584fc6cba7c9191df8eb97e47ba9))
- Update plugin interface to include plugin data ([138a5aa](138a5aa50c587f02a8c05342d60faf2bd660cede))
- Update dependencies (#663) ([bd51bc7](bd51bc731d027d4f34e832b71a6137911d9c5d5b))
- Rebuild documentations ([a9379ee](a9379ee51d02085d386aafef76f5e72fe9dd229f))
- Implement Profile and Wallet contracts (#667) ([09aa999](09aa999ff4e9fd0e58e3050f0e0e5c923370f035))
- Rebuild documentations ([0f5ae56](0f5ae56ed7cb2c8921b381ced453a3a2ec5fcd1d))
- Decouple `DelegateMapper` from `Wallet` (#671) ([11620f2](11620f263a9febc71aeb462a5c63e3cfbbbd1180))
- Remove extraneous `Wallet` methods (#673) ([ae11ed1](ae11ed1d788caaa1fa55ba76f92ef0f324ac22de))
- Export `DelegateMapper` and `CoinRepository` ([8e0822a](8e0822ab8926fd9e22695ac4bf5ea8d48477dbd0))
- Throw error if `syncVotes` fails ([4cc16ce](4cc16cef896566bfcc7f28fbc951d5b186a21039))
- Export DTO classes ([630430a](630430adc478c1dd089ea8b20ac907323f307953))
- Break up environment booting process (#676) ([7e58b7f](7e58b7fde6cd58e38fd4aad714a4f6222b640acc))
- Sync pending/ready multi-signatures from the remote server ([3d73644](3d73644417a1805a2df33c8a77d7bfb1c431113d))
- Integrate `@arkecosystem/multi-signature` (#679) ([963860e](963860e79a987659939ea21bc8db1c59513185ce))
- Update dependencies ([f1f0716](f1f071600ceab9a291c0c787d0e3507c2ee8300f))
- Update multi-signature examples ([4a9e483](4a9e483f4c448e69a6c92b58b2fe7d691c93b36f))
- Update multi-signature examples ([26bb685](26bb685b644599724ca7980981c75dbf36d67eae))
- Broadcast one transaction at a time ([d89b92c](d89b92c46f66dc206a352f3c3a68d30177b2f4ae))
- Expose wallet network as `NetworkData` instance ([1e7f41d](1e7f41d2d289e99ae948f2272c23cd73e0245999))
- Disable betanet support ([8f2ba45](8f2ba4587fbd4318e2fa0822f96d9c846d322769))
- Return delegates as read-only wallets ([67593e9](67593e91c42719528e43d745fb998878d607083e))
- Split `CoinRepository` into `DelegateService` and `FeeService` (#684) ([17752b5](17752b5acf07bc25bf21b569aa7121f5c2448764))
- Update dependencies ([dceb414](dceb414ff58041d3335cb9a2ace3c2b6eba9ec8d))
- Throw `CryptoException` if any crypro-related errors occur (#687) ([b1e8a14](b1e8a14916f50ebcff156b66d20bd205a54d387f))
- Simplify `DelegateService#syncAll` ([e0fda27](e0fda275c946c55acd27b3919250bd68c42c8e06))
- Sync identity before votes ([0132ff5](0132ff5adaf8707e14c988995d47fadaea1d9739))
- Throw exception if HTTP request fails (#689) ([25feb1b](25feb1befab38abe6db1db16c2fc51644746b254))
- Rebuild documentations ([69c809a](69c809a8b5d75dc5f22a9fc891361fa99854354e))
- Rebuild documentations ([ee75816](ee75816a1ce20747aaff02cd443c4662338927f5))
- Merge entity aggregates to be type agnostic (#695) ([4252bea](4252bea489444694724742be2c0f4bd4e0ef0d06))
- Make sub-type optional ([b5cd90d](b5cd90dd3eb00e80aba89225bf976d85abcbd8c6))
- Restore default profile settings after flushing ([3c7d5ab](3c7d5ab33b882fdcf9e4aa321930c5d96216abcc))
- Fetch fees for 30 days ([31e0b7a](31e0b7a9f24001f46baa6287b366678d2c519111))
- Set defaults when creating profile (#699) ([26896ae](26896aec5e152e82ae87cfafcc343efc6584cb1c))
- Remove workspace dependency from root ([10a17d8](10a17d831bce057e21c6cfa74b59a96710d2ce37))
- Update yarn.lock and pnp ([a613a11](a613a119ae8b911d271ba7d4766cfadd3c3a84ee))
- Use the Platform SDK Server to interact with data (#707) ([722bd44](722bd44941c8e915ed026f0a595abedf51b3da19))
- Get AIP36 transaction fees by type (#708) ([f575fe0](f575fe03a0b82a758b198c230a683e14ccb6cf40))
- Configure identity service through network ([8cced2f](8cced2fe8117d41000e692c98e3f7e05833d6e24))
- Prefix networks with the token name for unique IDs (#711) ([2941d47](2941d4747fb3294c45e72795f2a77ca375007c88))
- Pass categories as array to signals endpoint (#712) ([fd783e0](fd783e0565a42dae6d9719b81623b0cb885831ae))
- Return broadcast result (#715) ([a865b1e](a865b1e1e4d1d9b341279b8ec8cfc733d88a795a))
- Adjust return types in notifications repo (#716) ([b5e71c2](b5e71c203d9bb1a8e1548849a9afc2dddf5da976))
- Extend `Notification` type (#719) ([3d9cec8](3d9cec8be2d427e52a68974a1f7c41ce9240a9f8))
- Determine abilities and signing methods per network (#721) ([caf2125](caf21252d9244e163365e569610ae621fb15e21b))
- Reorganise manifests by type (#722) ([e80cc1a](e80cc1a28d5fa5b2b0d5f6594301f7a443596ac9))
- Update types according to AIP36 changes (#720) ([120154c](120154ceec0337026718afc269ca8568078ee3db))
- Merge `NetworkData` into `platform-sdk` (#723) ([e263e82](e263e8214996fa59ff06e2eedf6ce98b1f19f5b7))
- Merge plugins and profiles packages ([b15f63b](b15f63b7f3f3ecd4839f2aef08aecadd9ec142d4))
- Remove remnants of `@arkecosystem/platform-sdk-plugins` ([c5e41e5](c5e41e52352077aedc18a631e81ea8be34c72adc))
- Remove compendia testnet (#724) ([1ef72eb](1ef72ebbb97297d29a073a620d0cb9531ffca63f))
- Re-apply ARK configurations before every crypto method call (#725) ([ee26ad7](ee26ad7f233fb0f558889aa271b55a37d66e8dbe))
- Don't enforce api limit and sort tx by timestamp (#727) ([09dba75](09dba752d3b29745085516f447a50b3db5352829))
- Handle delegate format in WalletData (#726) ([7cb9a92](7cb9a9239b198fbdd89ce467e10b8c1c46660d8e))
- Update dependencies ([589dedb](589dedb1197abdc463ab4b0d953ab5d224150108))
- Enable `betanet` support (#730) ([f283098](f28309869cde55b7640baf90701fabbc9d79b7c6))
- Move `URIService` to support package ([4b0b35c](4b0b35ce42983439cd7fd6ab2c9362231c412ee8))
- Update dependencies (#734) ([710a316](710a3160f4e24f0a5d383a7202077f185dca9bca))
- Expose `Profile#convertedBalance` ([7f4f5ce](7f4f5ce987f63130c551162bcfa1b5142b8e8879))
- Remove `typedoc` and generated documentations (#736) ([e161bd6](e161bd67555e8cfb12d8f392611fec32fc92fc1a))
- Update documentation links ([faa6fc5](faa6fc5215d53597d0b41c4c2cd54fc05c0f3155))
- Rename `WalletFlag.Ledger` to `WalletFlag.LedgerIndex` ([21c27dc](21c27dc1710054199ef3c17f7f83f9e028dbc815))
- Update documentation link ([858cbb6](858cbb696c0bfa5002c0a94f3e0663b03b41dec6))
- Update dependencies (#739) ([18f1964](18f1964a25a7672fd3296294d455b13f9d4afb78))
- Expand supported properties for `ClientTransactionsInput` (#743) ([222d90d](222d90d38ab28582593af98b754063510df68fb0))
- Use UUID as unsigned transaction identifier (#765) ([82dfc2e](82dfc2e74af280f88b95b371850eac926ce4c442))
- Use UUID as transaction ID for ATOM and NEO ([dc92422](dc92422be320d4a146ec54c3bfc492886b92dd54))
- Keep URI scenarios in JSON files (#772) ([a07a169](a07a16931ccf35d86ab711163e49c3af6b1ffd2f))
- Store name and type for peers (#775) ([91b6d3c](91b6d3ca349d4eb41264f1271cf4701174c1c27a))
- Update banners ([a99e96c](a99e96c6465001bc126664e639ef387e65fa746d))
- Update primary banner ([615a8ca](615a8ca1cfbd006795a3fd9d1e65e6aa01445a19))
- Update dependencies (#778) ([6d0fb03](6d0fb0391b011985a89b3b1639cfd73aaab5cc49))
- Fetch exchange rates only for live coins (#779) ([74b87fd](74b87fd7b1e68d0be31184b21e1953605faf1f34))
- Remove dead import ([3eaf8dc](3eaf8dc862ae33b530bda51dd543940a13aa5283))
- Use `Promise.all` to restore wallets (#789) ([f188785](f1887852c36b8e9525b8ff3a15e5e57426421f04))
- Memoize the avatar by seed (#794) ([cb9f7c6](cb9f7c6fce926258df6c8cf6c892bb5f0b45ffba))
- Use `Promise.all` to deconstruct coin services (#795) ([25bbb0d](25bbb0d6fa365d017fa3ebd433dc9d3610db67fd))
- Use `Promise.all` to construct coin services (#796) ([c89f030](c89f0300f1926374ea9bf2774d5b34cf70fdc77b))
- Remove no longer needed warning from readme ([978d89b](978d89b72246e2a2d79128d8785681ecb6552f6f))
- Remove NEO check (#802) ([a37780f](a37780fea98715c046a48ad172add85006ca8195))
- Move responsibility of service bootstrapping to coins (#803) ([90fb66b](90fb66ba2fa0226093e4e0b1d317f7e1ff57882b))
- Import contacts and then sync them with `Promise.all` (#804) ([42558c6](42558c64a48dfb46dfd261687e65011b9e5b17e8))
- Remove service exports (#805) ([4c873f2](4c873f28b59972c04ab5f1efdcdb4b610d65d750))
- Pre-sync 1 wallet per network to avoid duplicate requests (#806) ([d14138c](d14138c44bf28122e9f0635517d591901007535a))
- Restore wallets before contacts (#808) ([655fb0f](655fb0f5dcb7e96cfb2c215c544c49882d7d158b))
- Compare network tokens after retrieving the crypto configuration (#810) ([c8a115d](c8a115d83961947ecc9fbf3e7079c54718951a27))
- Use `p-queue` instead of `Promise.all` and `Promise.allSettled` (#812) ([c18266e](c18266e8e1dd44f1d77adad0d1a9ea6da05d1f06))
- Implement `pqueueSettled` stub (#814) ([2d7822e](2d7822e8cbd722201c3728a5e99d6d65ae16ff04))
- Use explicit-restoring for profiles instead of auto-restoring (#818) ([e5e4b90](e5e4b90efc75dad69ab3950514f45ae7c3764abd))
- Extract profile creation into `ProfileFactory` (#821) ([da29a8c](da29a8ce04eff2bf5a683bfd9c33ba760028f0ba))
- Extract wallet creation into `WalletFactory` (#820) ([d9190e5](d9190e513d99f33c29dcef36fa703f505f0c611f))
- Implement `ConfigKey` enum instead of using string literals (#822) ([48e277c](48e277ca98654a62ddf8ada93240729bc9f54958))
- Make `Response#json` return type variable (#823) ([cf1383c](cf1383c6c68da77f43fad38a49727679a0d7cb27))
- Enforce 100% coverage (#824) ([28e05f4](28e05f408b9ed991e7a1df5851fded637c26948f))
- Enforce 100% coverage (#826) ([c46fb1a](c46fb1a45cf67c7c86a2043466aae1f716060d70))
- Enforce 100% coverage (#827) ([c958e26](c958e26299a9a63acb66d36f5b6456a6cfb11605))
- Enforce 100% coverage (#828) ([f1aeb6d](f1aeb6d49d9153139afa3fa0d7737410edfae826))
- Enforce 100% coverage (#829) ([e52f0f6](e52f0f685c9f6514cced7af9fc82edb3c6351cd9))
- Enforce 100% coverage (#830) ([d8f5d41](d8f5d41d4562e3edc7014d7ef6c90df709b7a3dd))
- Enforce 100% coverage (#831) ([bbcdc95](bbcdc95fcefba0f96a232b7f5125d8ca2a81156a))
- Enforce 100% coverage (#832) ([dba16c0](dba16c00b5691a59595aac90430efd2cbdb2a9be))
- Enforce 100% coverage (#833) ([4321c60](4321c60d736e298b59cddd19b04ebf8e01d04cd5))
- Enforce 100% coverage (#834) ([012e28f](012e28f3a5526d1f48433abdcc3f64d3de20c4e1))
- Enforce 100% coverage (#835) ([e9cdbf5](e9cdbf5eb59e79bb09db9e2d728ee17479a7217d))
- Enforce 100% coverage (#836) ([67ec4ee](67ec4ee420a701c67ef74739a7579ff61edb3c09))
- Enforce 100% coverage (#837) ([09def8c](09def8ca5c762d3b204df4d8c4a5284d5f89bb0a))
- Enforce 100% coverage (#838) ([b4a06ec](b4a06ecd6f7c8cd40abb573f952e30bad7547a2c))
- Move `TransactionData#memo` into `TransferData#memo` (#842) ([1bbae41](1bbae419392b5b156419ff2512c3a1892aa457ae))
- Build pagination cursors (#843) ([aefdecf](aefdecf1ad65ee78e2d936cff4ac8cdfd6f0ba11))
- Enforce 100% coverage (#840) ([8744716](87447167de105a4d6896348b288d3f4c6352521d))
- Use `node-cache` for cache service (#846) ([4cca604](4cca6042e3d0a089fb7b0b2a85fa9ab8f71d26b6))
- Enforce 100% coverage (#841) ([794e51f](794e51f0016fa804debc77de0d0846e636e2326f))
- Drop distribution from AIP36 schema (#855) ([b51de27](b51de27fbe258f1bdc74d11708b3dcb87fcfc93a))
- Pass storage to migrations to allow for raw data modifications (#861) ([aeb3c51](aeb3c510580b870abc01861745ce10d2598ff2c0))
- Apply migrations per-profile instead of per-environment (#862) ([3b0f502](3b0f50234d0f89ca65741b1ab77b6bc4abfe0271))
- Remove codecov (#868) ([f616034](f616034b2d7dc72aabc93cee37cc6ae2d081dc71))
- Throw if an unknown binding is retrieved from the container (#875) ([e103d12](e103d1230a269e42c2af00bb58fd3d636208632e))
- Throw if known bindings are tried to be overwritten without explicit consent (#876) ([a55381a](a55381aaa3e8afc6f82b80335b3e5f55825f9909))
- Remove entity transaction signing (#877) ([17479a4](17479a4214b89fcb89a2fda966dda72cd158995b))
- Export `Migrator` (#878) ([b29900e](b29900e4a223a7ddb721c3b6e9c36e88d0eb725a))
- Drop AIP36 builder (#880) ([d5649e6](d5649e678d617a1d01d0042b07e0577e7fc2679d))
- Replace `yup` with `joi` (#882) ([d17e8ce](d17e8ce7411c8ebecdd6c18daef9cd0d3c1d978b))
- Store name and avatar in profile struct (#884) ([08401ba](08401baf753b31dae4021755d5d3c4f9968203fb))
- Split up changelogs by major version (#886) ([7fad019](7fad01968536d898f644ee44cc1f2f1789429c6a))
- Flush only the aggregate transaction method (#890) ([70fc1b2](70fc1b23eb5391a8c66eb8bd915bcd381bb045bf))
- Deprecate `@arkecosystem/platform-sdk-marketsquare` (#893) ([4313ab4](4313ab42f059fb5e86f4281fd755f042385deefa))
- Retrieve plugins from NPM (#894) ([611197e](611197e3a3cdc298ecd2bd55cec0f282a52c5ed0))
- Deprecate `platform-sdk-ipfs` (#897) ([d6d7350](d6d7350ebc06b51d19876ed9c695a8faf1a76aba))
- Deprecate `platform-sdk-xmr` (#898) ([ff9ec48](ff9ec48562d8311944528b2653a5abd0b3cb5b86))
- Rename `wasCreated` to `wasRecentlyCreated` (#904) ([ae7f3d4](ae7f3d46c651e59514b59692a6d7f02e52b0d572))
- Throw exception if non-password profile tries to verify password (#907) ([f7bd083](f7bd0835dfede72770fcfc3dea07e05d00a9c2ab))
- Update changelog ([134bec1](134bec16f988d6fe8e8214d1671859970a1ce1b5))
- Require explicit profile encryption (#910) ([0911acf](0911acfd0a2d28af35f851ae1177108fd7c2d418))
- Use in-memory password for encryption if no password was provided (#912) ([a0ab5fa](a0ab5fa7e5ed81c798ddb6ececd8963be3347492))
- Drop `betanet` support (#914) ([03e9003](03e9003eed7a60a407c1922883d0b0a74251a10e))
- Require manual profile dumping (encoding/encrypting) (#920) ([bac9e24](bac9e24d94c1465cf698a7f170c5c16a9a2dce80))
- Handle all save exceptions ([3cbc496](3cbc496e7e160ec1504adb2a7cbfff7d50c28d33))
- Use HTTP client from container within `PluginRegistry` (#926) ([c490abf](c490abf9055f009384c1c2d2ad696bf761f3da88))
- Change plugin ID type from `number` to `string` (#928) ([034ae79](034ae79f7447b64b2cc147e95a6cba2b811d1eaf))
- Remove `signTransactionWithSchnorr` and `signMessageWithSchnorr` (#932) ([c272379](c272379e39699da4e52a6c551b95809d312ce839))
- Use `schnorr` for message signing and verification (#933) ([5aaf2aa](5aaf2aa67380dc2e8a1eba2855e768d6f547b4d7))
- Only return partial information for npm listing (#938) ([c694a8b](c694a8b23d0e28e69eee32517254afa876d7ef66))
- Return empty list if known wallets response is not an array (#936) ([0bb24c6](0bb24c66272afcb115a0f5467f92e693c90d2d20))
- Ignore plugins don't publicly expose their source code (#939) ([8783c60](8783c6009a88f594d1ed8b5562a29472bd65e49d))
- Split requests between NPM and GitHub (#940) ([9fc9134](9fc9134e754752b1a0d7b887bbba845024b0aacb))
- Update dependencies (#951) ([c451edf](c451edffe9b27dd3b5fca5823c5f1e866a178b31))
- Verify message without mnemonic (#955) ([892bc34](892bc34f959f031ef9d6161a54755d81f20a55c9))
- Define `LedgerIndex` as `WalletData` (#958) ([8183cce](8183cce76f299a66b24ff367027ec14ebfe0c98c))
- Replace `WsProvider` with `HttpProvider` (#963) ([99ee9b9](99ee9b96f57a07c862d615336fc5856ed5353cc2))
- Drop AIP36 entity related code (#966) ([95995fe](95995fea2aa4f5a2f6fbeca333953d2d6d7b8d2b))
- Prefix lifecycle methods with `__` (#967) ([6e16114](6e16114d73dc2b2ae1d6be0e9511df099fb9f820))
- Return strings in fee transform method (#983) ([83b2d9c](83b2d9c500dc114b5ffbaca9a69c4e348b6e9fe5))
- Make unsupported feature flags optional (#984) ([2f8df21](2f8df212ad92bd10126e114b26db5ca6a6d6bab8))
- Remove extraneous properties from feature flags in manifests (#987) ([048eceb](048eceb03b6abbfd126c47f1769b07190e56345a))
- Treat manifests as code to make use of typing (#988) ([058436e](058436ec500f17e5cd8a2909658fe94882de1295))
- Fix syncFees error message (#1005) ([7421b38](7421b381f57cb135a204cd3a68d2c5ef4b2a7046))
- Implement partial wallet restoration (#1012) ([0716315](0716315b296fca18b17cbb0c1c14cf5be0e837ab))
- Update readme title (#1016) ([247fe32](247fe329dba5da145d179ea8f888996d48355ac6))
- Update banner (#1017) ([efc3d9b](efc3d9b3766688a57c30b845b9c5994e15f85676))
- Drop `avalanchejs` for message signing (#1026) ([a4b86fa](a4b86fa5f7921e8114c5138b84c81cac07fca93d))
- Extract `postGraphql` helper method (#1032) ([08f33e6](08f33e60593da1cc458ec9e76a96bd21b3cd9351))
- Resolve build error (#1033) ([301dbc5](301dbc5216954dffa6c21c46f4ea9634070be982))
- Remove blacklist plugins implementation (#1039) ([8fb867d](8fb867dbdad35ca47922982a8b60a3dac7285a6a))
- Set up skeleton (#1045) ([3cf4267](3cf42679f8ef342a7e7858cf98d23efbb12d4c8d))
- Set up skeleton (#1046) ([e2282ce](e2282ce45cd1ed43e2cdac5a2ea2be3ffd0c3cf2))
- Use prettier logger (#1051) ([5fcc974](5fcc9742898282426bff2d8e80191687023ac7f5))
- Update `@konceiver/foreman` dependency (#1055) ([6eddb53](6eddb538f237658c9cfcf5a55da398cfa8349514))
- Extract database behaviours into a class (#1056) ([1fe7726](1fe77267a3cdc9f0e0affb8f169c76236851e4e9))
- Reduce concurrency and log errors to the database (#1059) ([ceb6433](ceb643392e988a495630374835b552564936b82f))
- Update `string-crypto` dependency (#1061) ([7f32313](7f323131b80b7bb525b60520072c65bbff3f1714))
- Update yarn and dependencies (#1065) ([b54cc90](b54cc903d9542c8e9a6b0b5f191eeffa0b32ec83))
- Omit days from fee requests (#1068) ([de260f6](de260f67a31be54500c90279afead8ca6a54409c))
- Adjust DTOs and some API paths (#1073) ([756ff46](756ff46cd1da8fa5caebf84086d732a1cd528b0f))
- Store plugins with an internal UUID (#1086) ([5fd0f0e](5fd0f0ec3ef3d3198a7cf930dc6049f8811fc207))
- Use SQLite as database engine (#1090) ([62202ba](62202ba96b7af86b3e4da4814411fbed273dffd0))
- Only store data that is required for API consumption (#1095) ([f6ee2e2](f6ee2e28390cfc7d767db1886a518fed548ae88c))
- Create changelog for 2.x (#1110) ([91bc505](91bc5053fc86f9c3262e1889ebc8af995c6a27a3))
- Update lockfile (#1120) ([7960218](7960218d7d84dd557eb4ab4f0b3d4b89169e4080))
- Use internal and external transaction ID (#1125) ([1c3e493](1c3e4938dc6eb19a926ee3d9da28f2c8e45796cb))
- Register more coin implementations (#1127) ([b7a6156](b7a6156eaf0ba478c88c54630f63ec5145be52a7))
- Fix eslint (#1128) ([20822fd](20822fd1f605e714c92d9295b811dac56d7f46f2))
- Remove outdated TODO comments (#1130) ([21ca1b7](21ca1b773a7c319775148d597d8b5fecbf4bce72))
- Use `@microsoft/rush` for repository management (#1137) ([13b5947](13b5947a0d9babe07a6843b3bd6df81dd8a96470))
- Remove yarn leftovers (#1138) ([43b1bc2](43b1bc2704f12caee109886f6244664d5613c3e5))
- Deprecate `platform-sdk-json-rpc` (#1139) ([6ef42d6](6ef42d65dbd0a6127f8dfb81fbe9490a1db5358a))
- Enable pnpm workspaces (#1140) ([9c5ce95](9c5ce9503dcf2f12f5196e185341bf84c56a6f58))
- Remove deprecated deps (#1142) ([8a0e430](8a0e430d00d9c6e60b8b9dd29db83e826bd2e209))
- Set up `eslint-plugin-import` (#1143) ([2605d5a](2605d5ac5ff9fdf576dfe8559f5f775bec074098))
- Use `@emurgo/cardano-serialization-lib-nodejs` for address derivation (#1144) ([02b0938](02b09386803f2463b93605fa1de0c8adc6e1d0be))
- Set up `eslint-plugin-tsdoc` (#1145) ([488dcae](488dcaefc491e6ff290618cd87bf5b79c903e624))
- Enable SOL integration (#1147) ([afa7556](afa7556f465194a2046aa862f0ac88baeec905d0))
- Use enum to access configuration values (#1148) ([4a01069](4a01069c8cb084304399b2b95310fd901992df2f))
- Update readme banner (#1153) ([e67b960](e67b96088610e46d36667d127df4aede0a30c6c1))
- Update readme banner (#1154) ([3f0676f](3f0676f7e343d1e01ea5103126b8f8d402cd2494))
- Make `AddressList#fromMnemonic` asynchronous (#1155) ([96080cc](96080ccd1985ddd34719a2092944f810ba7eab59))
- Allow passing in of a BIP44 purpose to support BIP49/84 (#1160) ([a9b639f](a9b639fa22dca6b0e9c21b50d8801af142457a3c))
- Update typescript to 4.2.2 (#1158) ([ea1a781](ea1a7810a9d9452a87c0238ef7720d0a201d1582))
- Use `@emurgo/cardano-serialization-lib-nodejs` for message signing (#1161) ([97c3e8e](97c3e8e13656a094c475bbf7694c1bfb9d785d92))
- Use `bech32` for address validation (#1162) ([e51cfc7](e51cfc71502230c8fd1a1cbe5ede681931180159))
- Separate BIP32 from BIP44 (#1164) ([dbcb6ba](dbcb6ba25a890f255052680601e13239457b7286))
- Remove unnecessary database columns (#1167) ([bcf9739](bcf97398cef96f4c9beb3542df5a4aea8e99ce75))
- Update publishing command ([962680f](962680fd727b99b451fdd7c7d3c4f83e3985dca1))
- Update changelog ([70357f3](70357f34431ede23c57c45fb6a95bd03f37c754c))
- Update network manifests (#1178) ([cbf04fa](cbf04fa3ee82cbeb606b563e4e0b04444fe859e3))
- Append trailing zeros only if value is truthy (#1189) ([f30a82a](f30a82a2b336c809b7e64a7c78048731d18f4bf6))
- Remove excludeWalletsWithoutName export setting (#1216) ([27cd78a](27cd78aadfa4da9116a8d7ba23bd7928a2fd1576))
- Cache coin instance based on network (#1224) ([eed90c3](eed90c38b7b9d04daefc019887decd90a8e231e2))
- Perform concurrent delegate synchronisation if possible (#1230) ([41ce33a](41ce33acb44710bf811b72da4b79e3b7e525b27a))
- Move default implementation into drivers/memory (#1233) ([31d8951](31d8951d4b8d9db586b02bdb496ca1446fa6b296))
- Extract environment configuration into drivers (#1234) ([c13b10a](c13b10ad8fa357ddb199ac339662672aafe9bd10))
- Extract implementation contracts (#1235) ([207944d](207944d80414abda11e1bbf15db1ceeced029914))
- Move DTO namespace into the root (#1236) ([09e4b8d](09e4b8d9d6aacefd0b4184e1b4432d7220aaea4b))
- Temporarily prefix all contracts with I (#1237) ([136c2a3](136c2a31979bc5c6b42259bed6b26e2f19eda9ed))
- Use new implementation contracts (#1238) ([758e299](758e2999a181db73515f8d7860913c4de1b3e7ef))
- Expose externally used classes (#1245) ([b7083d7](b7083d776006cbfe59b6c661625a8ae004832155))
- Lazily construct driver instances (#1251) ([f0f2880](f0f28804513d21825c82c6dcc08ac4c14d23df02))
- Use correct peer, plugin and notification interfaces (#1259) ([8f783ef](8f783ef724227143b0e2121f7d577056fee2116e))
- Use `inversify` as DI container (#1239) ([53a1860](53a18606d258a37b98975a5841b2037e623eb8f3))
- Split profile restoration into separate methods (#1256) ([71d1adb](71d1adb16fc53be5bc7b12c677e585e3908e6d69))
- Rename `terra` to `luna` (#1265) ([e653f55](e653f55f34a29c4176a1a0fba00d610f5d987bf1))
- Make last known network configuration available before wallet sync (#1268) ([180fdaa](180fdaa5f65592f7176f243ada2fb3f98cf1e136))
- Implement `ReadWriteWallet#setWif` (#1274) ([056370f](056370f924760e9d0ffe1968e7c45a7a0a8432ee))
- Compute transaction ID as sha256 hash (#1275) ([73c9858](73c9858ff5d46ce9c2c831fb3f9578b5ed9b3b24))
- Implement `Network#expirationType` (#1271) ([891f818](891f81850814ba4b648903cca86b7e5cffdfd005))
- Split v3 and v4 changelogs ([c7ca64e](c7ca64e5fca5c0472393fcda36de07bab3ebceb1))
- Return BIP44 paths for ledger scan (#1279) ([90671f5](90671f527c691f76a164c37791c32d0f733118e6))
- Include cold wallets in ledger scan results (#1283) ([3cddec8](3cddec82530318bdb80e742a0ab9db756d14e98a))
- Update changelog ([8e8d675](8e8d67528f0d1e6b656a8b4d69fa38edbf3c992e))
- DRY up peer determination (#1287) ([19a4e8e](19a4e8e3598ef740322f2d1e483dc104cff16b11))
- Mirror `__construct` and `__destruct` in `CoinFactory` (#1288) ([e3205cb](e3205cb0e3ef12dba0ce1321ddeca268ab9956de))
- Prevent duplicate coin synchronisation (#1290) ([733ff58](733ff584715d5086ad1cb8189f71cfe73cf13ec3))
- Implement `IProfile#hasBeenPartiallyRestored` (#1291) ([3df253c](3df253caa5b86a86a08eb86f1075b84ac4e8d511))
- Target `es2020` (#1294) ([b55dbe7](b55dbe72cc80052efb58ffdbca2323713a872c00))
- Only return 1 cold wallet from ledger scanning (#1299) ([ddc91a1](ddc91a17c881878b8895da523f021e8c5e9ceafd))
- Reset all restoration states ([014ea0f](014ea0fb0b2120f756db0179d4f6d6d9aecd6969))
- Mark as fully restored after coin has connected ([6202ac4](6202ac48c6a22cafb49c949f40e54eb7c96e6fac))
- Determine if coin instance uses a custom host (#1303) ([00692b0](00692b074ff21ffcdcc9b9c4cd5afcc6cc2ac4e5))
- Accept locale as argument in `WalletRepository#generate` (#1305) ([5186482](5186482f100c41334907d5ce4490e44d60af0b1a))
- Expose if read-only wallet is a (resigned) delegate (#1307) ([a213f03](a213f0303a0f9b2ade840909870cfa387a90d818))
- Split profile `restore` and `sync` (#1293) ([38f26c3](38f26c33aea4c35ca5b6d82db2e69448740b6748))
- Make coin instance available offline (#1309) ([9f5f1a1](9f5f1a1666af6f01d6532a596eedf9e6c865d605))
- Update changelog ([c2948a1](c2948a1410c43cef211c7162e59e02b87f7d8c0c))
- Drop inputs and outputs from database ([43ec375](43ec375a23c3621b4d0916978b51d3f45fb7bc4e))
- Type hint interfaces (#1319) ([3bb6fbc](3bb6fbc10d98702e7b2bbd3fdc08e3f0944698a1))
- Require `bcoin` server to be used (#1321) ([0aadb9d](0aadb9dab1fe0efc9974c039c4d18df6df228958))
- Require `BCoin` instance from `QuikNode` for `UTXO` support (#1322) ([e9f1cf9](e9f1cf93538fb757615f0e29ac5b8e9140d0f3ca))
- Enable transaction listing endpoint (#1323) ([7177c27](7177c277781be846c6c5caab9add61c903b47ee0))
- Store active profile in container (#1320) ([f3d77c7](f3d77c7095c99af2df5c8aae2611ccf9d052c9cd))
- Dry up password key generation (#1324) ([ddf8160](ddf81604510e1642612e41c086004e83196aacd3))
- Apply migrations before profile data validation (#1328) ([faf743d](faf743d0c70f752de53d9680d232836f86215be4))
- Use proper type for wallet object data (#1329) ([4d2ffde](4d2ffdee6902797b71cd98cede6f0f93d2d8ad27))
- Document `Profile` (#1331) ([857f3a5](857f3a539ca3245c630218a2f53baa3a580b70e4))
- Remove import methods from `IWalletRepository` (#1334) ([972ec42](972ec422ae84d7626dd05fe7e895d5baaca91f26))
- Extract ability methods into `IWalletGate` (#1336) ([e7d47bb](e7d47bbd497b8d327f0c0fe4d51bcf57ebe8f4a8))
- Expose internal wallet data through getters and setters (#1335) ([85d416f](85d416f24a0254e98db5e19a92cb8e65bb00ac55))
- Remove profile proxy methods for peers (#1339) ([34b9037](34b9037677dcc975f8c21bac305225b464f5342c))
- Extract mutation methods into `IWalletMutator` (#1338) ([a01af55](a01af5513c61d308410105dbf50c327772dc6847))
- Extract synchronisation methods into `IWalletSynchroniser` (#1337) ([c94d909](c94d909ed77a72bbaaef94480762389b3d3687d7))
- Replace raw data methods for profile with `AttributeBag` (#1341) ([77ae350](77ae35092471c6daf7ec2bd85f1077b1195c4b39))
- Extract `import/export` and `encrypt/decrypt` into services (#1343) ([b9b1761](b9b176162263f7ec6f7fc5a1296e783da684fd59))
- Extract dumping/serialising of profiles into services (#1346) ([9165963](9165963c873cfeb1eff123ac2f0bcae0983c207b))
- Split wallet into smaller services (#1347) ([82be24c](82be24c9c5f4ae4e0839bdb96f5b0de377e42720))
- Move property methods before functional methods (#1349) ([7047118](70471181c6dfa88dbc9ab02dd927610b0b3e73e5))
- Clean up some inconsistencies (#1351) ([b35eab9](b35eab90a061612ab96ecd4b0dcb4c9c9ceda814))
- Inherit documentation from interfaces (#1355) ([86e39eb](86e39eb08d5f5865919ccabc2ed58def6d177765))
- Ability to set a start path for ledger scan (#1352) ([f2a0458](f2a04583d00d5af98a476b1c84cc7bcd72dd0d0c))
- Emit fatal logging only in production (#1357) ([aea7802](aea78020f516b4a0b14b825720e37fc2bfc8d587))
- Rename gate methods (#1359) ([59c6733](59c67339559b54ab623d7e60832d2999937a975a))
- Remove entity transaction types (#1362) ([1763e2b](1763e2bb28a33ad59c244aa0904aa87180e1a0be))
- Export container ([a0dbee4](a0dbee4fcebb7638c390d6a2f8dd15ba4133c746))
- Update changelog ([b518990](b51899063f77a35090cb1656aa07449068f06264))
- Only validate address length (#1371) ([4129872](412987293452b5b8e3abd1de565df6d7d7b04702))
- Treat magistrate as a generic transaction (#1373) ([918ea40](918ea4037c86498a3d854d7e88ce25a4e471bf61))
- Remove magistrate remnants (#1374) ([1efc419](1efc41977afee68a983ee4356c359098e23684a9))
- Update host lists (#1378) ([a0baa64](a0baa643449c13004babc4059d72858cc4afacf0))
- Update changelog ([f8bbf75](f8bbf75d840eb20071d019a07f1049b3460b3890))
- Store import method on wallet (#1383) ([f590fe8](f590fe84310af59c37561ed33f1a016830a92db7))
- Only require account index for BIP44 arguments (#1386) ([a3732e8](a3732e8675a673c6bb0eb1f56d3f9326201761c8))
- Implement extended public key import from mnemonics (#1385) ([0284fca](0284fca79f63629eafcf23df5d9d952f75b8634f))
- Temporarily lower coverage requirements ([4101fc0](4101fc03927b54acf7bf4fbf43e9a4a0f18fe01f))
- Update coin libraries (#1380) ([7cf8941](7cf8941523daa275ff925a807e2c6abd0bfad842))
- Remove duplicate name type check (#1382) ([417fd34](417fd34b933b7fd7df01f1c00e5ff45eaef0d33b))
- Update coin libs (#1388) ([aaec28d](aaec28d6982ce73c8f35aa0d6887a07d4fa79f5f))
- Update coin libs (#1394) ([c68aafc](c68aafcf736800a1ef5e59a7efbfea66011a3b0f))
- Bind password manager to profile instance (#1395) ([92df8c4](92df8c4d3ce7c2b2287528a2c7030be25f3c1be7))
- Update `dot-prop` dependency (#1397) ([111288b](111288b5c77bb809fd5fcc8202d1e550a053c7bb))
- Use symbols as container binding keys (#1401) ([fc40c40](fc40c40b294f8126854d2ef2609b82b22025249b))
- Use constructor injection for profile (#1400) ([af88ae3](af88ae36b649cc44bff80357d08202e8d7c6d00a))
- Expose parent coin through network (#1402) ([70eaafa](70eaafa1bc782b893f6df7ff37d4bb9d0d5ce72b))
- Allow `estimateExpiration` to return undefined (#1404) ([1317034](1317034a95905c80bea5558fe8f1ecf68987ee17))
- Allow BIP49 and BIP84 as import methods (#1412) ([b75a048](b75a048a1edf08a7f69001d44720abfd42f82fa1))
- Throw an exception if the archival host is `undefined` (#1431) ([1a2c5f0](1a2c5f02d4d1a1932c4f33f95615efb77f548403))
- Default to BIP84 derivation (#1439) ([b0e168d](b0e168d35bfe444204c62564e18e771bfa700b22))
- Estimate transaction expiration if none is specified (#1440) ([04a0404](04a04048260b9e2d74bfddceb33a250847f397ab))
- Return some default fees (#1443) ([790fab0](790fab0d7899b2cbdded3cd8da8d91dbe32d6760))
- Use standard API to list transactions (#1442) ([bef9a15](bef9a15c907fcaf89b349ff04d356c41d14bc313))
- Use simple console logger (#1455) ([b535daf](b535daf907c9f7c6304b9084380bef2c9328db09))
- Use config keys instead of strings (#1458) ([921e2d5](921e2d56f203ae342dd1bc6b364dfcd5bceefdcb))
- Replace mainnet peer (#1461) ([9db4f96](9db4f965d5a6778b6298c1da6a384de769de3afa))
- Remove terra coin (#1462) ([4df125d](4df125d648a5d3cb298d620a3c4d0fd1c1171864))
- Update readme banner (#1488) ([b06ffe6](b06ffe62684da353a0df37f02e31de1019539838))
- Update readme banner (#1487) ([0ff1953](0ff19534f8c600e4867de95f25345dd2b2b38c49))
- Update readme banner (#1486) ([98d474d](98d474d0b3780b2f94d93704d1c7205921723277))
- Update readme banner (#1485) ([7d3843d](7d3843dacb4328fbaa37b37e8cbc65e1c91f09f4))
- Update banner link (#1489) ([7f168ab](7f168aba20200ab0b696d446119676cb6f8c4602))
- Gather all coins while restoring a profile (#1490) ([884b062](884b062f7be7c48484e772495686a0beedb13209))
- Remove spread-out broadcasting (#1491) ([9ac9d4a](9ac9d4aaee28b0a73df32aca99485b26baea180e))
- Save changes only for restored profiles (#1494) ([6b00c7c](6b00c7cfead14a532ae7e7478540501b1b3383c3))
- Example TRX transfer (#1467) ([3efd290](3efd290f24d259e059c8250fa23b66bc3643116c))
- Remove total balance (#1497) ([b91bf7c](b91bf7cbe3e9c5944789412153bba2122b7adca2))
- Update manifest structure (#1500) ([42f7bf0](42f7bf000b14c456a257f496c41fcd5c1aa32711))
- Split tests by type (#1477) ([5b4a994](5b4a994b02b7b61b9f325edc69f8e66d4ff170de))
- Make env auto persist optional (#1518) ([08ef1c5](08ef1c5ea2a146a2bf46d22e7903ccebe3670e4f))
- Remove custom peer remains (#1527) ([029a79e](029a79e5ceea8bd9c3e1aa89802b3c1bde22dd29))
- Remove seeds and peer search (#1528) ([18621b0](18621b0088cd0212b70ef5890e993fc8db92730d))
- Explicitly declare fee type and ticker (#1529) ([4876427](4876427b9e9e06c10f91219a08227191d71d9272))
- Fix transaction amount (#1535) ([2008d78](2008d78b2342c759b939675dc39c1463afce7e32))
- Handle profile validations from `IProfileValidator` (#1534) ([a25fb10](a25fb10d4b3cecacf337192d9febb4416a6b910a))
- Always use manifest peers (#1542) ([e77af28](e77af281b36fd14153b59e5d9ca70fe993a02c7b))
- Make validator sync by moving out migration (#1544) ([7e91d95](7e91d9575c431551d42944e7ed024a70f4b4c2d3))
- Make theme available unencrypted (#1547) ([86b5c74](86b5c74e7847ee21186ba6ea6bd7f2d5548d0c66))
- Mark profiles as dirty instead of saving them (#1545) ([a6371bf](a6371bff7be9883619494b666a975175c9913213))
- Replace transaction signer values with `Signatory` entity (#1540) ([816a5f9](816a5f99a19abc9148f6b8ab66bb816e7b42a873))
- Use JSON-RPC instead of WebSocket (#1551) ([5f71a29](5f71a294fbe1c86559187e350a882b0dc6e2a9d5))
- Delete websocket fixtures (#1552) ([4043c4c](4043c4cb53846eab16982eff1980cbd4c103f576))
- Introduce `AbstractSignatoryService` (#1554) ([02be717](02be717a20ad8f735ba7458123232e918233d843))
- Fix examples using signatory (#1555) ([38794c8](38794c8720a30a0125df9f652a560727ad135d80))
- Example transfer (#1550) ([de398f8](de398f8837afd4126f0fb0d2bb10836a47a3b787))
- Merge upgrade guides (#1560) ([7b0e26f](7b0e26f5ce56313b45ad08058670b72cf7fccc16))
- Expose `SignatoryService` (#1562) ([f78d64c](f78d64c2cc7fbdb6756515c5439ec38049f91410))
- Use `Signatory` for `MessageService` (#1561) ([222d0f6](222d0f6ef68534653aa4d321c7ef29c5b1078eda))
- Fix password service broken link in upgrade docs (#1565) ([81a4666](81a4666a0395f89797f7b47fa5de96a3bed63d9d))
- Indicate available signing methods for transactions (#1566) ([d42c34a](d42c34a148f19d1453ef3acac1e8b949386339c2))
- Implement `IProfile#hasAcceptedManualInstallationDisclaimer` (#1573) ([469bb50](469bb506f4058e1a26f1623d3a1a0bea7c470724))
- Streamline manifest structure (#1571) ([a1ae0ea](a1ae0eaf9db2f45e28e72b73b7556a3248b7cd21))
- Remove `PeerService` ([e0233d4](e0233d4f99c749f13d8507b5711d568f43d1dc4d))
- Streamline `LinkService` implementation (#1578) ([c76f76c](c76f76c563f043a56a955109f1d09148bfa3678c))
- Remove `IContactAddress#name` (#1582) ([928297f](928297f2934d22e757d02b43dd2fe9d09e535541))
- Further DRY the `LinkService` (#1583) ([d136f27](d136f27fe781d912b9df1de0e48931c1fd2c1b44))
- Mark mnemonic wallets with specific import type (#1584) ([363fe3d](363fe3dcfbc184c1b36556dd8ffebe728f66b613))
- Update changelog ([4a52c6d](4a52c6d84fd82f53c0747da743f79f90f63d78ca))
- Expose fee type, memo and UTXO usage (#1590) ([4639774](46397746677a55b5664e2def1be2323434ac64ef))
- Return DTO instances from identity services (#1594) ([0eae242](0eae24223114d9b1fd8146da72eb3ad4effde5d6))
- Store derivation path if available (#1596) ([10bf552](10bf552a6c860642b1aebd6bea3b638b34f7567e))
- Normalise signing and confirmation keys (#1599) ([02975ba](02975ba2f9b37486ba32ea5e73a7d57a842efebb))
- Introduce `AbstractIdentityService` (#1603) ([cdfa325](cdfa32584c4a2b301dc62d63192b38518d02011f))
- Remove leftover methods from interfaces (#1605) ([0e3bda0](0e3bda0aeca6bad35dd03922b6d773303cd6dea8))
- Strip unknown keys out of environment and profile data (#1606) ([129bc6b](129bc6b2541c2465694788b4ac2a5c92d66b26ae))
- Better handling of parallel fetching and sequential processing (#1600) ([1b6a270](1b6a27091a6041fe5434b4d03f8c7fbabcfe872a))
- Use `prisma` as database layer (#1572) ([891b1d0](891b1d07c2b4df24c86077d02c77cd8c001d2bd8))
- Introduce abstract identity services (#1613) ([779ee8f](779ee8fa210c7cfbf24991240576650da2a10a17))
- Introduce abstract transaction service (#1614) ([d8a3be5](d8a3be55bebd87274fa0e521e6577b361d8ce435))
- Normalise signing keys (#1616) ([0f151ca](0f151caa09ad7a9d0c1fe2bc0b09e4a055f80e84))
- Crackdown on illegal `any`s (#1623) ([13dd3a5](13dd3a58e0b79becc749cc8cb25b0ff84faa9c9a))
- Dryer `randomHostFromConfig` (#1622) ([ea98474](ea984742eb6cc9e097cc9d1a8df4ea3c866db0b0))
- Respect BIP44/49/84 settings for `AddressService#fromMnemonic` (#1630) ([85851c3](85851c3205568bbc1b477c947a660ac25f7c635e))
- Use `bitcoinjs-lib` where possible (#1631) ([4589e6d](4589e6d51a4403678e72ed227fad72b6b5b18278))
- Return BIP44/49/84 derivation paths (#1633) ([f34755f](f34755fdcb86669afa406bfd626a1781b90a141f))
- Return more meaningful broadcasting errors (#1635) ([37728c8](37728c80391a68b7dc76f1710ee7ebea14253452))
- Remove `stellar-hd-wallet` dependency (#1634) ([7506eab](7506eab00ca93975827bec008f212bd6d1e1223e))
- Sort package.json fields (#1638) ([4e3a438](4e3a4384898f8b88702bf27169f39fbbdaa17968))
- Store derivation type for wallets (#1639) ([e0a1213](e0a12132e978d77aaa1e68c50ceeb8b93a60acd2))
- Update snapshots (#1644) ([6321be3](6321be3a2d6f95e447545ef9ee3d005ceb38548c))
- Store coin service instances in container (#1645) ([60f6bbe](60f6bbeab07bac6c231e14de129e1bb9f14f70d5))
- Make coin and config private and read-only (#1648) ([23e74bb](23e74bb7b222b97ee48f0b03f34b09b9f42e42e6))
- Store required wallet information as data (#1649) ([1678366](167836619fa12427e619d20e20a656e6078ece8c))
- Normalize input amounts (#1621) ([ba799dc](ba799dcd08a2224d687de90ed90d748af11d03f5))
- Persist profile data only if marked as dirty (#1650) ([e3eeb2b](e3eeb2bfdbc5714ef27879d86819b6a589ec3a6a))
- Directly bind crypto and status values (#1657) ([823b2ac](823b2ac4ed74ef71194911bd33ff5d95f5a4bb4c))
- Temporarily revert back to config bindings (#1659) ([17d3c31](17d3c312d0c15cb0ff39af46ce338de099b0ed3e))
- Integrate `examples` into the CLI (#1669) ([e318ba5](e318ba5dad7876707be49956d6d286e487af807f))
- Change `amount`, `fee` and `feeLimit` to type of `number` (#1668) ([2a479cb](2a479cb9c81857e6861aa6b72f1c3ef3f626948d))
- Sort package.json files ([27fa5fa](27fa5fa8940b5a6f975fff97fb1293d9f40f3e71))
- Introduce `AbstractClientService` (#1672) ([f689f10](f689f10b27704b42e6747068b711b2ae1ef1386d))
- Update manifests (#1673) ([0344352](03443522a4b3f4ef675f20728530f4d6ec4080e0))
- Introduce `AbstractLedgerService` (#1674) ([0e4c8fe](0e4c8feaacf4439353bbf4e6cd3fa5a8bba677e4))
- Introduce `AbstractFeeService` (#1675) ([5b48e1e](5b48e1e2347665175ba3de21de689575b4b2c6fa))
- Introduce `AbstractMultiSignatureService` (#1676) ([8ba482e](8ba482e9ea598ee6bf6ef7586e9eecd5b58da55b))
- Introduce `AbstractMessageService` (#1677) ([1a79cb7](1a79cb70ce816a13abf1263c3d5ced8f5f6795b0))
- Move `AbstractSignatoryService` from `Signatories` to `Services` namespace (#1678) ([c991554](c991554bcfc1722d8019c1c3c644d6e5a55690c4))
- Introduce `AbstractKnownWalletService` (#1679) ([83e99ef](83e99efba9fd106f793ea6a2629061288d662925))
- Introduce `AbstractDataTransferObjectService` (#1680) ([4109c3a](4109c3a77b3e0497cd8cc02f9f463eabe3284109))
- Ignore coverage for abstracts ([40fd7ae](40fd7aeeab1f6d9f4e06b73b4afc3460410a249d))
- Replace `LedgerPath` with `DerivationPath` (#1681) ([a3387e1](a3387e1f05ca1b36f4855a99f1a4f94376f707c1))
- Organise services and contracts more closely together (#1682) ([183f38e](183f38eae74aa50debe92b9b5ef1f5a85cb77747))
- Update to TypeScript 4.3.2 (#1683) ([129c595](129c5959009bb301282845d196e6045e34847954))
- Use method name property when throwing exception (#1684) ([cf108c4](cf108c4fc5e0f97df83b34ffa2771aef0fd9b3ab))
- Make private methods also private at runtime (#1686) ([1587d7f](1587d7f596a3ffc6a3b3606e4c5453b84c9e98d0))
- Merge all market drivers (#1687) ([b551568](b551568ff7af99fbc21e2d130b37604a77250ed7))
- Split `fromMnemonic` into multiple methods (#1688) ([1dee2a9](1dee2a9ea38283a218b44a9dddbfefa07865d579))
- Replace `fromMnemonicWithEncryption` with a `password` argument for `fromMnemonicWithBIP39` (#1691) ([3533031](353303114e907ad01a36a4c8a86c848a3d8e8b8d))
- Replace `fromWIFWithEncryption` with a `password` argument for `fromWIF` (#1693) ([3e75a26](3e75a2686a0f207d7c2e3dfa157402d739fe1b09))
- Turn `WalletImportMethod` into a constant with nested keys (#1694) ([2d2a5ee](2d2a5ee49fbde093d009c215b0bbc66880e863a3))
- Branch out HTTP contracts and functionality (#1697) ([02902a2](02902a23e8b23a7bd610964d3a051ed1df4261e0))
- Separate `Coins` and `Networks` (#1698) ([6eeb6d9](6eeb6d9cac724fc73e059680b50f41215974e045))
- Adjust slightly substandard uses of object rest spreads (#1704) ([bde2a9a](bde2a9ab125af2d0d2bee81287fbd062805ddadd))
- Remove `@ptkdev/logger` dependency (#1711) ([702deec](702deecc9611675d0b6fb5200a24e0c925a656b0))
- Respect decimals for denominator in `BigNumber#toHuman` (#1666) ([d70f0e3](d70f0e33215a11afee497aa897256fc70fc740ff))
- Update `prisma` dependencies ([f131b6f](f131b6f8fd690f144ffffef5809a002ec408bffb))
- Sort package.json files ([d7b88a2](d7b88a2f7a970b989eeb86964e51f0cd2da76811))
- Implement `bigNumber` helper for coin-specific instantiation (#1719) ([91715c9](91715c93bcf7579cece0e738952b690f0a1fb918))
- Cap `max` fee at `static` value (#1720) ([026db89](026db89b19b6ac1b1c69877baba158e77a72cabd))
- Store `compendia` as `bind` ([e841636](e841636375f0d9286a80c100250860f890b94105))
- Unbind if service binding exists and then rebind ([3fdf3d2](3fdf3d2d9103b5c0b106c8a6d99eeec3662a008c))
- Return fees as `BigNumber` instances (#1731) ([0b0c1fa](0b0c1fa534c35ca61daf9c8f1fca61c38cd18d5f))
- Migrate coin architecture to make use of IoC/DI (#1735) ([8e9655c](8e9655ccaec1700ae83fcd20bc448ab03cf772dd))
- Store explorer path schemas in manifest (#1756) ([0ad2fbc](0ad2fbc1f61247a282ee00789ce1933617ca8579))
- Provide default implementations of services (#1755) ([4c92e04](4c92e04ea4720ed8a9e7c0b2c2b4f6706e29efa1))
- Initiate inversify through constructor (#1760) ([cc28e93](cc28e93c652de41d8303caf1c1e186116474d625))
- Destroy container bindings in reverse order (#1761) ([a541b61](a541b6124015102a57cfd7c9f6362ecf61e081ae))
- Only ignore error if unique constraint violation (#1767) ([a5571cc](a5571ccd07c569297da5afe673467ca00d15b6a7))
- Use upserts for blocks, transactions and parts (#1766) ([afccd8f](afccd8f0e14868f5658a5c5ec22f987cbed7480d))
- Throw an exception if a duplicate binding is attempted (#1771) ([7f7965b](7f7965b7b9fe36a61d14d954d6043333d39984fa))
- Store pending blocks in database (#1768) ([531b961](531b96185bf6f90f904a0e84e07125d4f0f41c2d))
- Handle ledger signing in `TransactionService` (#1777) ([4f7f2c2](4f7f2c2f69ad007cf75cfc0aa86e8ed7fd225d8b))
- Remove `TransactionOptions` in favour of `Signatory` (#1778) ([665dbfa](665dbfadec94667faf9d76ba0170ddcfdfca43a9))
- Remove `SignatureSignatory` in favour of `LedgerSignatory` (#1779) ([8f65cf3](8f65cf38fb331cedfa43970cd87a83852931437c))
- Derive ledger address early to determine nonce (#1781) ([cd27e08](cd27e08090e4c74bf5b0a28ba6361383e9ebffc3))
- Provide default implementations for DTOs (#1783) ([628d2a1](628d2a123dc911275a7695dfeb70aa9a1a4342db))
- Use flat directory structure with types as suffix (#1784) ([40c97ae](40c97ae8d0a2b92918c3e5d5e1a9ae40758202bc))
- Transfer example code (#1785) ([e5e60c7](e5e60c7a82b9b40b5e55cf9a9951dcbbcda34259))
- Use flat directory structure with types as suffix (#1786) ([a63e236](a63e236fb2bf8a9cbc65c7c387969dbdd6e01d61))
- Use `source` and `distribution` instead of `src` and `dist` (#1787) ([f880f7e](f880f7e7dcef2d772da14ac9a2649ced50398c5d))
- Delete dist folders ([0898bc3](0898bc35e7cde9c195aaeb29a2fcaf09c9373383))
- Update naming conventions ([f9d6ffb](f9d6ffb4e6c7e9a91e9f8f98291258567a5a0c12))
- Flatten feature flags (#1788) ([0a74581](0a74581d64316949874975e73803aeed15e86656))
- Remove link methods from feature flags because they always exist (#1789) ([aab0fe3](aab0fe304cf5811395631b2070cd61af343a915c))
- Dry transaction DTOs (#1792) ([efab816](efab816519c8590c653144e0d1b0ff3ba57ed551))
- Rename `SignedTransactionData#isMultiSignature` to `SignedTransactionData#usesMultiSignature` (#1794) ([c3d7749](c3d774941837bb6a810f02b575a43cf7ec967c81))
- Enforce strict structure for validation (#1795) ([fd431a3](fd431a39822c564d24e2d7b29a421b7d0040e223))
- Common code in superclass (#1796) ([a7004f2](a7004f26bf61a101f04de9adae04cef66534dba8))
- Rename "helpers" by more meaningful names (#1797) ([17512c9](17512c96996c71db56cbd169815239a9e7f9f00e))
- Set up publishing workflow ([52f5350](52f535061190c0a3a9ef7f560fbf8a0511834c03))
- Tweak configuration (#1799) ([309ad51](309ad51a296a9d291e52f2f5069971f58071bec4))
- Less strict notification validation (#1803) ([d8d4a36](d8d4a36c29d833f257702d28efbf4aa270268ff7))
- Enable transaction history setting on profile creation (#1805) ([291d88d](291d88d09c3764563c6951301438518e83a5fcc7))
- Faster processing (#1807) ([50bde2d](50bde2dd73786f6a220f82070d5318ddb407eb38))
- Rename `isMultiSignature` to `isMultiSignatureRegistration` (#1815) ([2dc9eee](2dc9eeed33e66c722d58830703f4f9a834862797))
- Update changelog ([90d2a79](90d2a796cd50204a0fb089d05b8ac43ad6a45c21))
- Merge `toObject` into `toHuman` and `toJSON` (#1819) ([c470cc1](c470cc1854e5717c57b9527c42fb9d8d944b421a))
- Enable `noImplicitOverride` flag (#1821) ([40f78ad](40f78adb511ee8bd46397469c01ad3904d481094))
- Update `prettier` dependency (#1827) ([4d50ecb](4d50ecb18ee9d4da8c6d2f724145252eaa73eb42))
- Replace uses of `Helpers#toRawUnit` by `BigNumber#toSatoshi` (#1826) ([1b144ec](1b144ec7683240a5648828963504e0ee15481241))
- Replace `prisma` with `pg-promise` (#1828) ([75e9771](75e97712a25a9e8dcffd127c7a895cddddf87c56))
- Integrate `@arkecosystem/multi-signature` (#1829) ([c1cc4da](c1cc4da96706a56461002fabfe96755609b793e1))
- Flatten directory structure (#1834) ([6e0804c](6e0804c1db7b644927eacde4b5da1387e3944a1d))
- Process blocks whenever we are not busy (#1839) ([9faf8d4](9faf8d49f5441da096eca784bae2183d6c736000))
- Treat balances, amounts and fees as numbers (#1843) ([9255267](9255267ef3af530b3515a8567ef42778149d7505))
- Normalise signed data through `ExtendedSignedTransactionData` (#1848) ([8170a9b](8170a9b3f5905e1a15e84570cdb14ea962b4b93d))
- Deprecate indexer and server (#1852) ([ed05af8](ed05af8dea9246db22514247681a16e99f04d7e4))
- Make Numeral locale optional (#1853) ([c173f54](c173f549b008fcf8159efd3c04a1f1d4d315ebdc))
- Temporarily expose username, hash and recipients through `SignedTransactionData` (#1857) ([a415c8c](a415c8cc909b1541339e6af6dd62cdc6554f4475))
- Proxy temporary `SignedTransactionData` methods and normalise their output (#1859) ([b9b904a](b9b904a3fa04215811f94d4fc4c365c12ff7e02f))
- Export `Profile` class (#1862) ([d4de677](d4de6770c47c21cc7a4a57f0017cf75dc49455dd))
- Export `Wallet` class (#1864) ([392db72](392db724c7332d152dc1e5a96771a13fcb0645c2))
- Use maximum fee as static and maximum (#1866) ([ef47e6e](ef47e6e58968c5bb9820e068540186bde0abc0f7))
- Throw an exception if invalid signatory is used for `addSignature` (#1882) ([aa3e856](aa3e856fe29fbdb0ce4fdcce039dce871db2b5f3))
- Return transaction broadcasting error as string (#1885) ([603450c](603450c586d1b7d883ee4b2e62c69be09d9a525d))
- Stop normalising broadcasting errors (#1888) ([b7a1e9d](b7a1e9dd6158977bf98f27deae665f85a131bd9a))
- Consolidate confirmed transaction DTOs (#1892) ([fc86bb0](fc86bb0a2c1102ddbbc6e4b1d9e71b6078054618))
- Implement command to update feature flags in manifests (#1667) ([b102a07](b102a07f5788e7664e1c86d7f9fd2eafb4a6bde1))
- Update changelogs (#1914) ([edb209a](edb209af217434df1bdae838fb2d3a474d178c3b))
- Enforce BIP39 compliance for mnemonic methods (#1918) ([712902c](712902c62f4072a5f81af343f7a826b014d9013c))
- Deprecate news indexer and server (#1921) ([7b78010](7b780108849e6d6edef6df0fb5a6dd0a65ce5731))
- Update tests and fixtures (#1920) ([02ba8fe](02ba8fee4457f73c73c2b80e8b00675f74bed6f1))
- Return broadcast response after adding signature (#1923) ([f432096](f43209625bfda2c691ae80beaa2379b4eb21d9ba))
- Drop AIP13/26 support and require coin/network (#1930) ([590852e](590852e383c5ef9fcc68673d3250de281401bae5))
- Implement `Network#displayName` (#1932) ([fd28309](fd28309c6c7cb616d89d10189e30ed8f501b7955))
- Use transaction ID as index key (#1934) ([bfac88d](bfac88db6c80338914b5eccb40eaa798c774e6e4))
- Transfer ownership to `@payvo` ([f5c0436](f5c043682e32dac93235fac7e7885849a25a8b27))

### Fixed

- Export price tracker contracts ([81fb042](81fb042be12de08e7d1bc017d70219b1aa7cde8d))
- Export IdentityFactory ([d09b2eb](d09b2ebfdc8cafc85b51fcc04ec7e60fde24c3fc))
- Usage of exceptions (#21) ([a6a0d1f](a6a0d1f20d3bf2bc59510b337deea8a0856ab17c))
- Re-enable all tests ([c838696](c83869606076f91b67ea2846f610913f49034d4c))
- Default lisk to betanet (#27) ([8b1e86b](8b1e86bdf39fa42caab5d4cd694f0061a126efae))
- Include meta data in collection-based responses (#35) ([73ee7b3](73ee7b32a6c72e1b2fc1e0f47d0c61270802d1ef))
- Fix failing tests (#54) ([df7752b](df7752b0a815fee9fd018e6ff05c81cafacd1b70))
- Fix failing tests (#55) ([fbfab02](fbfab02066b5dc1472e71791d4768781264817f1))
- Fix failing tests (#56) ([5813e51](5813e5124ed09d5c14ed6c6e61d3cd497114a536))
- Treat amounts as strings (#71) ([d7d0d9c](d7d0d9cae087b471d8ed05bc8e44953d4ceccca4))
- Only list payments when using `Client#getTransactions` (#82) ([0e0c796](0e0c79663b3507f771217da5eb5131e526270fee))
- Use testnet transaction structure (#81) ([ac85331](ac85331e62cf7c8e1c14528adf3b31989b5d3cf7))
- Return `asset.payments` sum if transaction type is multipayment (#83) ([78bd067](78bd0671c3750ef843648bf2e831f1defa530cd6))
- Handle underlying effects of new factory arguments (#148) ([be625fe](be625fe45bc49930771e2096b23943eae3637c68))
- Try to first use a peer and then the network for the `PeerService` (#149) ([4859be8](4859be8bad2044b7418bc351a88d4b5ec39cb2f8))
- Format UTXO response for transaction builder (#152) ([5edb4aa](5edb4aa71d4f8f5910d167fc766b230efde2ddae))
- Adjust outdated assertions (#159) ([9081dbc](9081dbc3a7992cb3b88300d7a89948d650bf5246))
- Setup mock websocket server (#190) ([20b6836](20b683630f0843635875c34b128d3a0f52efd6f0))
- Utc declaration for dayjs (#191) ([c3461d5](c3461d504e71a91e42df0025b5371c88e25afa4e))
- Return magistrate fees (#229) ([ba0be8b](ba0be8b59ccdc67644e30fb8ad02328991da1eda))
- Only list `XRP` transactions (#230) ([dc85f36](dc85f366beaeaa2f6cc839db2a8b8791fb0ffcdf))
- Always treat `fee` and `amount` as `string` (#235) ([9c5b875](9c5b8758d9ed79245f36089c1e7a03fd1d0c57fc))
- Export naming (#256) ([1d3626f](1d3626f93a93b761820fe16f393c0a00d80e38a1))
- Use fallback host if no peer is provided (#271) ([81a3328](81a3328bf68ba2b9ceeff8650c198cda9c1f288b))
- Increase nonce if retrieved via API (#275) ([4fbe49d](4fbe49d8b39854dccec17e3f1405fe7286072540))
- Wrong method name (#284) ([f315cec](f315cec91978b5e4b8b371ae03105cdf35989fd1))
- Normalise passphrases (#304) ([1eb0d3c](1eb0d3cb32d3551ea0c2d3486e2403d9d3d3d645))
- Pass the locale when creating a new immutable instance (#314) ([6b05bbd](6b05bbdff2da6b2a5e73c680472ae3e66463463a))
- Prevent duplicate wallets per profile (#327) ([ccfaf1e](ccfaf1edb8c4f8690ab004f20efb78bf74641f4e))
- Import dayjs plugins to force type inclusion ([d0de77d](d0de77dd0afd0ee1c69b4e93acd46237c401881e))
- Prevent locale change for `DateTime` if it is invalid (#362) ([e525307](e5253074b2b292676baa04b20c8152f5df6ebdfd))
- Prevent invalid settings from being stored (#366) ([b9c5dac](b9c5dac2110d93b1eaba3caa7be801bd1c714da3))
- Use same data store for profile and contacts ([f5f751d](f5f751d640b1c6f2afd452b3a65fcd8c01b0cc95))
- Cover that custom `slip44` can be used (#402) ([045c475](045c475f161ba266cb90363928729fbb5fbb9360))
- Include data and settings in wallet object (#403) ([2746433](2746433a533ca6b1fc390148510ac823b6a1f3ce))
- Handle connection attempt to peer of a different network (#409) ([dbc3921](dbc3921de206411d278c82618a9ddd704d1623fa))
- Set profile avatar based on ID ([53ef7ca](53ef7ca9c074e5d45056e9cdbdc70329aa73d4fb))
- Set wallet avatar and include voting manifest into validation (#457) ([342e678](342e67888f4d5f820cc007d47e0b8c21eb74b971))
- Use `day` instead of `date` for differences (#487) ([e217a2d](e217a2d0cccd395bebd5bf35fc439c13b6a45650))
- Validate data in `SettingRepository#fill` (#536) ([65332ff](65332ff538ef8d391d72d3338ad1eb20188ff474))
- Export `NetworkData` (#558) ([eed60ee](eed60eecda85e4192023584d76db3211023485c8))
- Use a random default host for the peer service if none is configured (#562) ([f3ddb68](f3ddb68d3126bd497ac3c452cd22c3dec0d19568))
- Fix failing tests ([881047f](881047f75333e9daa2e54de35684dc977b84016a))
- Use `&&` for `findByCoinWithNetwork` filter (#566) ([435b121](435b1210295ec116e2d8a9d641c3ef7dc6cb3544))
- Modify contact instance instead of object (#572) ([56cf84b](56cf84bed5ea2c1fd599b02e79ec1c37a0fedf22))
- Base profile avatar on name instead of id ([7c4077e](7c4077e0f68cf2dd11797712cbe57efc53544158))
- Timeout neoscan.io requests after 1 second (#579) ([c338189](c3381891bf6cd3757923ecdbe47f6661f1249733))
- Restore wallet data and settings on boot (#580) ([3b2ee58](3b2ee58c4e6f7f4470201880ca9af7a47eed0b80))
- Restore wallet data and public key on sync error (#590) ([058806b](058806b35736a45834ea7469ac639e03efbffc1d))
- Use `addresses` parameter for address searches (#606) ([5204510](52045100cce5ab9b2347cf5e2ed772867355a8a4))
- Exclude out-of-sync wallets from data aggregation (#608) ([5d4555d](5d4555dc24d89f78451bf46ec8c839d50139229b))
- Ensure uniqueness of contact name (#614) ([ac50eac](ac50eac5afcd9b62e0a57c8af9dc487d87c42cca))
- Default to empty object if promises haven't been settled ([e9bbced](e9bbcede172c4f0365a009056a0a7582131d5db6))
- Bad relative import ([6973255](6973255821e6eb79c55703c405b7365761b57a87))
- Return unix timestamp for transactions ([2256523](2256523188f0af9540d8109d0c850a8c26576d51))
- Ignore the name of contact that is being updated (#632) ([ddad507](ddad5071f49124415bf71884fda347181485e479))
- Call `isConfirmed` to ensure confirmation ([7dc07ec](7dc07ecd8d7cc23ac006592e0799d84bc124f0a4))
- Send `limit` instead of `perPage` parameter ([4d6aa2b](4d6aa2b93a0de72aa90639a0969c1810013ca745))
- Call `toFixed` with argument if argument is 0 (#640) ([5538dc6](5538dc65218bc4ef66d14f60bed12f475170f4d6))
- Access transaction service to sign transactions ([e866ba6](e866ba6f755f87ceaa95907a0572bd7d5b056300))
- Temporarily use `.getStruct()` to avoid serialiser corruption ([64867d2](64867d2182b8b4e69c927aeb447158fe5cc787da))
- Normalise `TransactionData#recipients` return value ([ffb9b52](ffb9b5206d63c3ce4c7fcbc279909bcfb5f263ea))
- Use `senderIdOrRecipientId` in place of `address` ([ca26763](ca267638b9e32ba11b37f8fcfc28f85afe0266b0))
- Handle main and beta transaction types ([b20f444](b20f4445cb620524879d633ffc19574775701060))
- Update DateTime assertions ([e7ec28d](e7ec28dbb802a3853056c793ff0ead958a85ffa8))
- Update API url ([e8fc48c](e8fc48c3a588dfa9e1ce964db4a84fdbc5077d51))
- Update mock urls ([91211e5](91211e56e3dbc6c6ec5537ac26f171b13603a242))
- Turn signed transaction into plain object before broadcasting ([d1db6c3](d1db6c382d34bc73e91be92b469a42d092187de8))
- Only persist and restore known wallet data (#652) ([198083d](198083d10465542a48047dd204b46589415986c2))
- Always cast the balance and sequence to BigNumber ([59edcc2](59edcc2debf22f1d31347aa79340f6eb68bb4401))
- Throw an exception if the ID of a newly signed transaction is a duplicate (#653) ([0f58708](0f5870892071086838287f96edf6bb6bb2bfbf9e))
- Identify AIP36 transaction types ([ffb09ec](ffb09ec2603f5ed9b8b6e3fc77f05cfb5d07907e))
- Return `VoteData` for unvote type ([9ff39c6](9ff39c68455f3c4aab78ed83e352dcb57a1b707e))
- Fix profile registration aggregate query params (#661) ([e1f34bd](e1f34bd399e0d286192cf56a4a3b46f7d4b7b385))
- Fix failing ([573171a](573171ad7018614f7fec90067329d2de7f2851b2))
- Map TransactionData according to type ([4638697](463869725fb4042de9c5c5c0f87607d1f7856ff8))
- Fix failing tests ([dc66518](dc66518e123de328f7e42c670df9bc9ff8568629))
- Set transaction ID ([690f89a](690f89a01f7423b28e401d14c8b5908d03ab1cd1))
- Ark explorer links (#677) ([8881f50](8881f50ff1165f504557173c5c63c12b891d070e))
- Normalise `MultiSignatureService#findById` output ([b6bab55](b6bab55180e2ba0c5fe39e1afdff0ec1a88cfdca))
- Broadcast raw transaction data ([133e99f](133e99f57e63f79ae55636c753a832bcbb10f8c3))
- Pass SignedTransactionData to broadcast ([40d025a](40d025a90f632baffc51476a9cd8c37180175743))
- Use `getStruct()` if the transaction is a multi-signature registration ([80e8342](80e834209e9bd85d2168bc7fc1f87395b48e4bce))
- Fix failing tests ([794d0c6](794d0c6c8a990da8b36b646be5ccb352efe82585))
- Return result without mapping when using `findDelegateByAttribute` ([0eba2b8](0eba2b889a7d26ed8846c39325e9ed94fead8789))
- Return early from `promiseAllSettledByKey` if there are no promises ([30ab7d2](30ab7d22a29ff47a82c39d49a85f5a756322f1d3))
- Persist pending signature transactions ([fa46824](fa468248dd2eb679dcfd00eb95396c07ab7df491))
- Respect sub-type in cache key ([38acf97](38acf97d8dd06560bbe55324b651820b4990349d))
- Allow type and sub-type of 0 ([7225d2c](7225d2c4f8c228353d1f57f541580b4c2741e4d7))
- Process magistrate fees ([e8578a5](e8578a53953c4c63832d364cef1107a6fa62e51f))
- Require entity type and sub-type as numbers ([e8a6e14](e8a6e14dc2c98f4913d5d619215fbb8b8c4b24b7))
- Fix failing tests ([5cadb74](5cadb74f0158693dcbc670b4a5cec936012cd1c2))
- Do not set avatar during initialization (#700) ([00b7e51](00b7e51c5ce509be9d88236cd66a6d39efd96b28))
- Update error message when address wasn't derived ([480aa9f](480aa9f1ee0c18d95216b7ba014464c8bcc728b3))
- Update fees url and fixture (#702) ([8267e7e](8267e7e1f76f9647a8632e91a5abc08282e11adc))
- Fix failing tests ([f3ee21d](f3ee21de33202d16bf0faea69a11cfccfab98082))
- Fix wrong assertions ([1b0a46f](1b0a46fb7b2e61088c8c8b68992df9591ebb8853))
- Export `FeatureFlag` enum ([df5454d](df5454d6c16e80c1a35307bc08a05311cf8ba995))
- Include AIP36 in manifest ([fa63f11](fa63f11bc99b11ae4b047527942c0b24c80b67c4))
- Include `crypto.signingMethods` ([b286ef0](b286ef016483d0571e570b9e2438bc430fff7715))
- Use last response cursor for delegate aggregation ([85850d9](85850d960883910733b9028f81a5cbe671024fc7))
- Ignore unknown parameter ([fa2a485](fa2a48546e6a6ea94202085ca68b274dceed0f20))
- Fix failing ([7bd1984](7bd19849706aa4bd753d972dc90b664d7404ef7a))
- Use `@arkecosystem/crypto-identities` for stateless identity generation (#729) ([cbe4aab](cbe4aab76c0e106ac8d7f26fb72c28ce183f7388))
- Entity action check (#732) ([341f2eb](341f2ebddb5d14332834f0df8eb21a109463ea14))
- Include transaction methods in `ReadWriteWallet` contract (#731) ([1326387](1326387a9b3bac2d61eb6394bcf74ab3d3649165))
- Stop division by zero in balance calculation (#737) ([657d553](657d553a752e7bcb7a9b89ea767d0af3c8b81b64))
- Update slip44 version of devnet (#745) ([98011bb](98011bbd718ab315f1d2bb0d0bc6965f4815f87a))
- Use `address` instead of `addresses` ([44902c9](44902c9b5b9a4175ef9c87a41c33534d1e517739))
- Use searchParams instead of body for Core 3.0 (#748) ([83efcfa](83efcfa65c2ecc4486447457ef97ec72aa30ed4f))
- Use `senderId` instead of `senderPublicKey` (#747) ([c146d58](c146d58e4125e3a37f427eed166c639afdf82f8d))
- Validate address before checking neo network (#750) ([de90bdc](de90bdc02be52df2447ad1a1fd7be64acd2061a1))
- Get votes from attributes object (#752) ([a585870](a585870e374c8d91b15af48c073006a1f4e68430))
- Update entity type enums to reflect AIP36 (#754) ([ac4d650](ac4d6500848fe818314acae7d28f9a9b8a67332d))
- Return specialized entity types with over general type (#755) ([bca1c23](bca1c237ce5de65e77f5f1de202a2b03addc6087))
- Confirm lisk transactions greater than or equal to 101 confirmations (#757) ([6fed844](6fed8443c74a883bf220dfbf6da3af887d472fc2))
- Off by one error in api pagination offset (#759) ([ba9b468](ba9b468570ba30779c0d91e47d26b43b5191843b))
- Check wallet is synced and delegate in aggregation (#761) ([529412a](529412ac6d7b2f6882b6fc816f35a0a1abab34b5))
- Normalise wallet balance before converting it (#769) ([b3075db](b3075db36da2e62827f15c07af962929fa9066b4))
- Divide transaction total before converting it (#770) ([a0bf482](a0bf482630501c204469ce203dffc1a72395c994))
- Return 0 for test network balances (#774) ([58b1fdc](58b1fdc473de02b8af39a8add6ac3c2bc06be39f))
- Reset array indices when forgetting a value ([9419e81](9419e81e0981bd751b52feacde7b12447afea073))
- Call correct method in `Wallet#cannot` (#787) ([f7d39c8](f7d39c80cfb34f7d9ce7069c925614ab956e79ba))
- Ensure that custom custom peers circumvent object caching (#788) ([ca75040](ca750408d08a37ddc7af4d1fcb655c15861c794b))
- Allow wallets without public keys (#790) ([8f8f797](8f8f797e681fe5fab08890e9f9b52887f144bcc0))
- Respect contract for client input ([4de276c](4de276cdade2c9cfd5ad309295fd733a0e578933))
- Increase coverage (#849) ([4b0c84b](4b0c84b1a7ffd147d2203195b7e03011c082ed35))
- Coverage for `environment/services` (#850) ([e689667](e68966795c61349d961f11942939690425344ef7))
- Increase coverage (#851) ([c9d53d7](c9d53d74988862c3be0dc92f414655321075635a))
- Full unit test coverage (#863) ([762db5f](762db5f40162741a2d06b7cc9a6a61e788648e6a))
- Increase unit coverage for `WalletData` (#792) ([4fddddb](4fddddb9ccadb1d54406450e3dad78e6d5797dc3))
- Set in-memory password when setting the password (#870) ([6570e95](6570e9505b9280e4d689914af25ba2a3e23a40b0))
- Transaction#memo return undefined for types that don't support memo (#872) ([9887766](98877660289e7bb61598388bf8e90534dea3c2ac))
- Prevent null entries in `ExchangeRateService#restore` (#891) ([4262264](4262264f6dea116f80a5fe1e28d7aba4ce53bd03))
- Assert that environment dumping/restoring works (#899) ([3cc5a9c](3cc5a9c23e8fbb4880f75d3543617f7d3320302c))
- Check for `pre` and `post` restore password usage (#905) ([5d3cfd9](5d3cfd94e298d47782be435d315a31e59bec4e0a))
- Store encrypted password from raw data (#916) ([ea33458](ea33458153e4601d77152531103887dfe07f45ea))
- Apply base64 encoding only if not already done (#918) ([890cbec](890cbec47cd0a89b4bee8a993bbc75aeb89d6b8c))
- Only use password if it is a string ([0a8d00d](0a8d00d055e4c86a0febdb8528931f696ec61dd1))
- Save profile after creating it ([b86ee72](b86ee720c19d8f142702cbb8215f895b669623b0))
- Store flags when dumping wallet (#937) ([6dd50c9](6dd50c96dcd906c01024d3525bce45cf700ae354))
- Set `ss58Format` before generating keypairs (#948) ([9637b51](9637b51b3a44b523d3dd1001d2dbbb612f67970d))
- Access correct transaction data properties (#985) ([5bd318c](5bd318c14d74c17f627a03bfdc93ca91887b5953))
- Normalise wallet balance to `1e8` notation (#986) ([34769e8](34769e8f648813ebf1f1069f4694f69b5145cf4c))
- Fix failing expectations (#990) ([2a2b101](2a2b101bb17ad67237bfbf5c717f5739f59acda7))
- Update manifest fixture (#991) ([7010c05](7010c054291fd4ddf184ac425f45235777d28099))
- Only use page, limit, orderBy as searchParams in v2 requests (#1004) ([c87ebd4](c87ebd4f3b23d526063abcca3004b169d41d35a0))
- Expose `ReadWriteWallet#transactionTypes` method from wallet model (#1035) ([2f4bec7](2f4bec7f9f7a83edc22c3f38f4b2626ca03c7e40))
- Pass arguments as string to pm2 (#1049) ([10eaca1](10eaca13609c33434265412f448ece30270b4480))
- Use `EGLD` as export name (#1070) ([003c67e](003c67e10350a977e62eb8c508b47eef52e59826))
- Expect `egld.mainnet` or `egld.testnet` as networks (#1075) ([706c907](706c90762bc6c6cf7d2ec056faa8b56423ad1068))
- Expect address or list of addresses for `ClientService#transactions` (#1076) ([5673411](567341164ac8bc43510c3ba1eda30e16b3fb5d4a))
- Adjust validation of plugins (#1072) ([fbd078f](fbd078fb16b9cdb856c70432d66ed7c57d07515f))
- Normalise numeric values to satoshis (#1078) ([4d4e3de](4d4e3defcea377548155aa65d68917a4fee0b68a))
- Normalise fees to satoshi (#1080) ([a2ccaf6](a2ccaf622c98077f49fafb2f941f9bb8bfb32901))
- Link `blocks` to `miniblocks` (#1082) ([d0b02ae](d0b02ae2988f8fad3feaf7861e2819ee72fdb432))
- Treat transaction timestamp as unix (#1083) ([2009aeb](2009aeb92a550a4e560d4aa7ed86a6d98f764f2f))
- Include ID in plugin data (#1094) ([4864c8b](4864c8b5a6801e0c7b3553ec5bb54bea4113bb84))
- Strip out unknown parameters (#1105) ([baefe13](baefe131e086da17976f54c7f8a1b22312138763))
- Allow block identifier to be number or hash (#1112) ([8418261](841826191f63708d4ffebd696e552c0637677da2))
- Ensure transaction amount is greater than 0 (#1118) ([efa250e](efa250e3786b3fe3297681b2f7ad8616ccda97b2))
- Dump stale wallet state if it has been partially restored (#1132) ([26b1c6d](26b1c6dae7b94905dfac3dd2335f6442950774ae))
- Fix coin name in manifest (#1133) ([f4f36fc](f4f36fcb7b5ba16f808742ef611fb1413e7b65f4))
- Skip actions if values are falsy (#1146) ([6c60fe4](6c60fe40ebc3f984eb7edbc5191144cba4c0a55c))
- Rename height to number ([0dedbf8](0dedbf8785bc4056c08f33e6b4185d9c7aa5fe04))
- Query last block by number ([f8dbadc](f8dbadc5f3c2afde0ae446d3cf9418c84b1e4fd1))
- Rename output to outputs ([6c22f5e](6c22f5ece553d50474ca2007676b6678984181a9))
- Expose `ReadWriteWallet#wif` and `ReadWriteWallet#usesWIF` methods (#1214) ([0324720](0324720780acd1adf9fb420670cce1dc875b9e44))
- Include bip38 data in ReadWriteWallet#toObject (#1226) ([2fef13e](2fef13e22d098ae3142a132815ddcbd65adad1fb))
- Handle different broadcast response error types (#1240) ([4a7a442](4a7a442e2466d5a785f4cd02006c1c8647052b19))
- Export Avatar helper (#1242) ([ec01481](ec01481172a114576e18eddac0a72705f2fa27a5))
- Only use custom peer if setting is enabled (#1258) ([b461135](b461135f43843acbf37c40987aff6cfd9760060c))
- Make `PluginRegistry` an `injectable` (#1264) ([67cdaf6](67cdaf62a9d69a86b2790cecce926d896fff3682))
- Prevent addresses from being overridden by query (#1277) ([821bd64](821bd6429ec4a13d1fce83f180d8164dda52e4fc))
- Fix failing ledger test (#1285) ([35c821f](35c821f9e6fda58978ef5586b45ab3bd7ca03404))
- Compare address derived from public key (#1286) ([23b1cf1](23b1cf1c6022dd4386c8d4bd51733ad88444cb87))
- Map correct path for BIP44 derivation (#1295) ([4bc1c90](4bc1c906c15a33584ca67b197982626b0cfcd0ba))
- Don't harden account key segments (#1298) ([619cc0c](619cc0cf5eee86bdf31eafc11bd2e360ef45f3b7))
- Update snapshots ([aa98733](aa987331296f776904b6fde470d96b51918bc3ac))
- Expose locale as a parameter in wallet generation (#1315) ([a522758](a522758c005dc62977d30afc5b27d43a784d895b))
- Ensure wallet is marked as fully restored when coin is synced in `setCoin` (#1317) ([05a3819](05a3819f453b4cbcffc3b9fa235a56447bc353a5))
- Use `height` instead of `number` (#1327) ([5bf43f3](5bf43f382abb11185d9b4607d51cdaea54497876))
- Set delegate status to false when resigned (#1342) ([9addbb3](9addbb3f1fbd20e11bc291d05bd84806eceb3ce6))
- Use non-resigned delegate fixture (#1345) ([e227d31](e227d31aad604b88d850d32bef5947a9f7eb2f18))
- Accommodate endpoint to new db structure (#1350) ([ffc4365](ffc43652b6b736a7f24a6de8d85039a2c19123ee))
- Restore ability to reset settings (#1363) ([d8688ed](d8688ede6099f8a3752042cf014a7d9158a05890))
- Set profile when importing ([d924bdb](d924bdb5b637d968101333a5b5087aa5e925536c))
- Adjust fixture for BIP44 derivation from mnemonic (#1377) ([265ed48](265ed485a5d79b10299c3ef7b873d8877f7091fa))
- Enforce 100% coverage (#1392) ([b0b1fd5](b0b1fd5427df27f83a680f36d8d4d978bfb33a83))
- Create snapshots for available networks (#1398) ([b4eebe4](b4eebe474b1fbb103440fb0a27538b88aaf33981))
- Enforce 100% coverage (#1393) ([14ec848](14ec848ac0a1be5fccf5efc35d7c68daaf554b4e))
- Return `undefined` if `estimateExpiration` is not supported ([ebe39c1](ebe39c1047a39f080ffb13a930f7ed44164b8e0e))
- Cast amount to string ([ad6b7a1](ad6b7a1ffa1d42522278da7058a845e57315da5f))
- Create coin instance if necessary for contact address ([a91dd9b](a91dd9b3149d4f5eb57813e51ec02240599ea51a))
- Avoid shared data repository for coin service ([127f3c0](127f3c06788af889a7ae11e438d52757c5d5493c))
- Return default values for methods that are always called (#1415) ([eecc3a1](eecc3a1dbcfdc76adef3383993b89b24315b8de3))
- Divide balance by `1e18` (#1417) ([9b88c7b](9b88c7b9e367e1fb76a86d1e113637b4a2c9a04d))
- Multi wallet balance by `1e2` (#1418) ([ecf0b0d](ecf0b0d3ee419872f4705d021f5117f96a8255b1))
- Return `undefined` for unavailable values (#1419) ([cb38228](cb38228813e82b865333db136fbc211bc969732e))
- Look up specific address or first address (#1421) ([1505e51](1505e518eee7e310e1565280b340480a93f778bb))
- Grab amount for new field (#1422) ([5bc1c7b](5bc1c7b3ddc6425f6c297162b5ad17d8c11a12db))
- Use correct explorer paths (#1423) ([1738e3f](1738e3fb1cabcda89af688125e503c25e405d98c))
- Use archival host for transaction listing (#1428) ([7cfec6b](7cfec6bf9424694b97e5bbdef7717ec3cbe56b77))
- Handle empty values within transaction data (#1429) ([6a3b611](6a3b611403050536b812b7135ec9a54499559299))
- Merge default network manifest and stored manifest (#1432) ([b8682dc](b8682dc20625dc771f6eb8f74b8c9d8ec9cf62c9))
- Store tx id instead of hash (#1434) ([c93f391](c93f391db2220f8af917965dfc7c1d2200849d92))
- Include jest-extended (#1441) ([f55b887](f55b887cdc45971be46597ca01e20c5d8f6fd4fb))
- Make password available when restoring profile (#1445) ([5df31d1](5df31d1522b0f80f8daf158d29d321ffcdb632fe))
- Use token name as manifest name (#1449) ([8642a29](8642a2970154df60019f68a02be3411155750ec3))
- Use of network expiration  (#1454) ([5c5c08b](5c5c08be82af2cda3e6ed5bb664bfe6a1b60319e))
- Import logger directly (#1456) ([a72b38d](a72b38dd0c01b6f41637674d708746d75f76d8fa))
- Treat bech32 addresses as valid and turn balance into satoshi (#1459) ([3bb8aa0](3bb8aa08a4669c7c859bbe7bc3ff6c4fc32f634e))
- Get wallet balance from bank endpoint (#1463) ([5d13486](5d13486a3246c53496f0b649f373d96664e3998e))
- Fix transaction amount representation (#1465) ([4aaad8f](4aaad8f51a4b84736f9e82e72abe388c07868679))
- Await profile restore (#1472) ([a399239](a399239c25d4748af106b8f29934ff351bb1df5c))
- Derive private key for transaction signing (#1479) ([5230ca7](5230ca752491d234684b8b4443c68b119b10284d))
- Take frozen and TRC20 balances into account (#1480) ([3e31b3b](3e31b3b77944f5d84ca4ed18d0b1775b4b503a7a))
- Resolve signing and broadcasting failures (#1481) ([5b7af7d](5b7af7d99bf422e6fb01c1a5d4f2cb4bd474c6c0))
- Map correct signed transaction data (#1482) ([38d8380](38d83804eafd77c4b2486d7b1cc4f72efcb6067d))
- Temporarily ignore some coverage (#1492) ([201db9f](201db9fdc443469aa0be7d5cc6aefd65450fe1a5))
- Correct balances (#1495) ([9af2b70](9af2b70f5d5a9b5504e0eab9517d85489d92e29b))
- Generate explorer links (#1505) ([a8d9343](a8d93434a1d318b6e3a24e7b77bccbb955d3d2fd))
- Treat `previous` as `next` (#1507) ([7ab8293](7ab82935aec217f2a3402f562dcd858544621693))
- Ada transfers get utxos from mnemonic (#1496) ([a64b97e](a64b97e56670b50918a9e4d41392b4cc7e92c096))
- Handle lack of frozen balance (#1513) ([c5f5311](c5f5311540b7d8d3278e7262e2024043cda9091b))
- Return undefined for memo (#1514) ([09aa800](09aa80070d69c26f678bb84ac47c0d661069e1a6))
- Memo parsing and inclusion (#1516) ([ae77ea8](ae77ea8e29cc153feeeab0acb6a3abcad15788d1))
- Avoid return a BigNumber instance that is a number as balance (#1523) ([ae1483a](ae1483a6ae83db149957581d9432f1216e5dfc20))
- Testnet explorer url (#1522) ([b813911](b813911d558c17363e06f520f8f38594346ae6b9))
- Memo and block id extraction (#1521) ([d7c096e](d7c096ee125a902cac0f54e9aa1563074ce8b67d))
- Throw an exception if sending to the wallet owner (#1531) ([5cad3bc](5cad3bc209cf2ab505ddf8457466c022ad2f0c1f))
- Normalise amounts (#1532) ([b4bfc07](b4bfc0772f090a6d472544f6ad4021cbf06ff077))
- Update fixtures (#1536) ([aa2ea00](aa2ea0038e919b22447c2853f491b8ca413ca8fc))
- Manually serialize wallet balance (#1538) ([c88cb14](c88cb14be7a68787e29b5bed486f903c81555e6f))
- IsMultiSignatureRegistration returns false (#1548) ([e4a99c9](e4a99c9b2168c36402747e8c277b2f5af7a28fd0))
- Explorer links without trailing slash (#1546) ([22cfff5](22cfff5ef294f1aec933d58fde8c821247438816))
- Broadcast tx handling (#1549) ([27ea992](27ea9925c8b53bbbfd368b7baa849b10cf2548ef))
- Persist profiles before persisting environment (#1558) ([3fec678](3fec678231e9ef1dc488484bd34213dd70e68b43))
- Proper way to fetch payments (#1567) ([c67d71c](c67d71c49fa28d99aa24e5300512f401a4cb8e87))
- Respect BIP44 account index option (#1570) ([32f6342](32f63428e014155f04dc2d5114eea64d312300cf))
- Pick any of the given addresses for wallet details (#1576) ([7f7a97d](7f7a97da744b41cdefbdbacb0dc430807a07027c))
- Update wallet wif jsdoc (#1579) ([b40a643](b40a643157b75b486b96e8ee488a24f3bb7becee))
- Match coin transaction enums with `TransactionMethod` type (#1580) ([789c73a](789c73a88d6892d1e1cda27ce922b7ad7a24593f))
- Use ARK as coin name for devnet ([e674b7b](e674b7beec684e739a4c3953411c5d1b0a1f6571))
- Update snapshots ([a93506c](a93506c60cf3c101e1c994e7e59bbb9666a08476))
- Expose import methods for network (#1585) ([0046791](0046791700509fdbc15aa325ff56cf29c72cc7d1))
- Apply signing key for double signatures (#1608) ([e7d239e](e7d239eb6b8aff235e56484a4da3b5da3f2e31f5))
- Convert `NANO` to `RAW` (#1612) ([60a1341](60a1341694748b17f844bb259ec0522f9ef0052b))
- Change `supported` assertions to `implemented` (#1615) ([257f57b](257f57b88e083146e6c22f56aa2ba1e09f8ba5a2))
- Use configured client instead of got (#1618) ([6ee7a16](6ee7a166a9f73a205237e00336589c5c40ce433a))
- Prisma client is not a dev dependency (#1610) ([275fbc7](275fbc7c613755d53c68babfacafdeb6b94ff8dd))
- Use the schema file relative to running code (#1625) ([9c2da2e](9c2da2e42167d2cd67061a66dcaee82fcd9ea110))
- Specify binary client targets (#1627) ([de27769](de277694809c688d7fe0942fc05b1dfb71af1c72))
- Use `p2sh` for BIP49 (#1629) ([894bf86](894bf86a3b563e53c70f5763c7718bead0787af6))
- Increase test coverage (#1636) ([c99184c](c99184c1342dae1efdaaf33864c169cec34e05fe))
- Accept partial address data (#1641) ([15073cd](15073cd258ae9a28a62805185f9e2f3fc5d9b0ae))
- Set explorer link (#1646) ([56909cf](56909cf0524f8602b53b5e73a10312c3bb4e2eb0))
- Explorer links (#1647) ([d308e53](d308e53f4c2a3c16a63483a887f19ef8714fc602))
- Store musig timestamp (#1652) ([360a72f](360a72f637a8067325855886d0d2e8f08502f653))
- Only mark BIP84 as default (#1654) ([87e5436](87e54364dd44e1863d969b21414b0dc75e4849c1))
- Cover ARK mainnet import (#1660) ([164d8bc](164d8bc9fe21b96f9fed90860abd6253206cbffa))
- Fix manifest for fee all (#1664) ([ee99ddb](ee99ddbb71ca0d2644ddf93b5ca4d9ac4457f13b))
- Update snapshots ([bd10d8d](bd10d8d68d54ed16948d37627d4e2a15c1309975))
- Case insensitive censoring (#1685) ([b9f2e9c](b9f2e9cae8abcacbfe62353639a7b6622298d456))
- Update wallet factory calls (#1690) ([b339569](b339569155843561ecc1211f49eeb49f58483d79))
- Set address derivation method based on purpose (#1695) ([3419607](34196074dc42a25587e14ab8bd910a4aceb3754d))
- Update compendia mainnet peer (#1701) ([57a7e29](57a7e29c650dfccc46af96eee02260e75add64aa))
- Update snapshots (#1707) ([5087cec](5087cecc90cb0e259e819a00010740b133b16241))
- Use signatory instance to sign transactions (#1709) ([9f324a2](9f324a2ff451c7497eacfba3cf76957c0ebd878b))
- Use decimal-aware `BigNumber` instances in `IReadWriteWallet` (#1713) ([d83d6fe](d83d6fee05ff85c07977041190547a9b3129b18b))
- Store import method when dumping wallet (#1724) ([3971321](3971321c64740e5280d794a9e6f1f534723d269b))
- Only add container binding if it doesn't already exist ([131395c](131395c37ee708823f638fe5662089e42afdd6c4))
- Update snapshots ([30e3338](30e333878c45a0dad8bc029085800e1953f35083))
- Do not import from `dist` ([2f2a93b](2f2a93bb2a76432d0315d02ce783fe2928e6a682))
- Use strings as service keys ([e87a232](e87a2322c50a207517b797ccaf144148d39cd2de))
- Tests for ledger scan (#1728) ([6411700](6411700f643932e2d7f7990ab501d45fe458fb34))
- Fix failing ([4e683c1](4e683c1b906971c1404950c2d3b91ddaba01c2cf))
- Don't construct or destruct if already done (#1762) ([f962b58](f962b587816cc7a1203e57b4f123edcdcfc25b58))
- Only unbind if binding exists ([15f872f](15f872f8fefb7f5122dc7bf773779b4987665fcf))
- Try/catch syntax ([6b588fd](6b588fd173d2552470aec6780f5457bd75753a52))
- Ensure that coin instances do not share container instances (#1772) ([b0767b0](b0767b0f2476d0d2c6ff84bc38466f3e662c59bd))
- `compendia` => `bind` ([92d662d](92d662d3cb87279c72d3e7b7a4e7292d54003cc4))
- Prevent `Coin.__construct` race condition (#1775) ([2bde3af](2bde3af46728f3060f8a38722a39c35617f78e5a))
- Increase coverage (#1765) ([9ec7bff](9ec7bff59e9f638f5b353dcd0f8c32f681796965))
- Use ledger service to import wallets (#1710) ([9a06aa1](9a06aa18c11412ce0d7269121d7468795159b5fa))
- Limit all fees to static (#1790) ([5c34036](5c34036d90c441c63ce6b0d1208d69848d9d07a4))
- Turn transactions to JSON for response (#1810) ([a4aab36](a4aab367f7ad38f8086058e6abb0f0de45262f02))
- Return numbers in human-readable format (#1812) ([0ab54fd](0ab54fd5523d14d713e97e6ac9b63a8dc2afbf19))
- Use `isMultiSignature` for wallets (#1817) ([dfc9027](dfc9027eb2130d808d34f2b2c97877ab16f9cbde))
- Update snapshots ([12a1892](12a1892fb21107b3ec50b21071f5199bd8623d82))
- Use `denominated` amount for conversion (#1820) ([5160b32](5160b3225005a2dbd98c5adfedef9937dd71bf6f))
- Ensure correct `TransferData` instance is used (#1822) ([d6f3fc5](d6f3fc502487b2e9e22a67f7fdd421d96836ae05))
- Export `SignedTransactionData#type` type (#1823) ([934eda4](934eda46bd4297bab0b59ca93d055c641d606805))
- Indexing more robust (#1831) ([aef2fb0](aef2fb0d4541e161c5db44ae90b226aa16c5d36d))
- Prevent duplicate DTO transformation in `TransactionAggregate` (#1846) ([04e8674](04e86745cfd71a148bb37b867e583eee4f854c90))
- Export `ExtendedSignedTransactionData` ([93bb6a5](93bb6a5f06ca35185a4633f14977430cc3ab1642))
- Handle all expiration errors ([c0cc13c](c0cc13c3cdb8bcdc7566e2dcd115940869a5144c))
- Create `WalletData` through `DataTransferObjectService` (#1855) ([baec078](baec0781cd4620f082cd5d2d8b3e6832ce38f9d3))
- Confirm ARK and LSK as soon as the transaction is on-chain (#1868) ([51ea344](51ea3446aae2177055a902fb6c40a885e02c4ce7))
- Handle edge-case where confirmations come back as 0 from APIs ([2ad8b2c](2ad8b2c251b91448948506a9d2c0fee84d6a16b2))
- Normalise multi-payment amounts (#1871) ([d985969](d985969056dc9aca1c4846cd543290d7304785f6))
- Always use `BigNumberService` for `BigNumber` creation in DTOs (#1874) ([45a6060](45a6060e1a0a79789e1c713ba4913dc849df8cad))
- Derive address for nonce with second signature ([892b7ac](892b7aca6667bf64f398cad6aea4894a474eb9d8))
- Correct multi-payment recipient count ([d3f068d](d3f068dab6d9ca03e2f0a18b1b373f09e0d2fc1c))
- Update snapshots ([327509a](327509a369d4801272f35fb04c9353c36a956294))
- Pass plain object to multi-signature broadcaster (#1884) ([ab99054](ab99054021df2a97ba1c1d43f392d5233aaa97b2))
- Multi signature registration process (#1883) ([00eb172](00eb172f12c57959648b22b50db6a9c9b95f836c))
- Compendia testnet host ([eac533c](eac533cf8a8413171dc9381811918f3958a2f0a9))
- Set `recipientId` before ledger signing ([5972e68](5972e68a13fc96bbb91d3eabce0294920ff41b7a))
- Ensure ledger public key is associated with MuSig (#1903) ([cab2fe0](cab2fe09b0db6e974041ab7f2646c9e833ecfea3))
- Respect word count for wallet generation when passed in ([dc50e77](dc50e777be4a9737398ef305453c2598c8a1cac8))
- Correct coincap daily average ([5f32f29](5f32f29930968d8b8b77b247efb3be190a01fe05))
- Return maximum fee as minimum and average for multi-payments (#1912) ([f231723](f2317231d6fe5be51320325049d4e2fac6a9639e))
- Update hasFetchedHistoricalRates logic (#1916) ([84c4da8](84c4da84aa70f1adfd88d88a77605686fe5008d6))
- Set wif from mnemonic or secret ([adfdb66](adfdb66259bd62784018fffa26243226a27efc61))
- Await WIF setter ([007b146](007b1462f7b88c17c5f4ff43253cc381b2a1f43e))

### Removed

- Remove unnecessary `get` prefix from methods (#5) ([d51e6c4](d51e6c41d445a694c8ae8eb53172ad9962bb63d0))
- Remove empty tests (#22) ([23511e8](23511e8eb0e39d2a47e59c2ecba429a960680191))
- Remove no longer relevant tests (#157) ([4ba8a27](4ba8a27534593093e8cbb699d4e8e618e3e46804))
- Remove vote prefix from public keys (#596) ([8fa0ae4](8fa0ae416979b4b038bbf634390aba2fa548a1d9))
- Remove stub env before running tests (#623) ([bd2b802](bd2b8023027386aa915bee64dcf66341b0be9d6a))
- Remove signed transactions once they have been confirmed ([e819783](e819783334a7368f9d85a6530dabb1cf46b8094f))
- Delete "entityAction" after using it ([3530970](35309700cb7a00e28bfbbe233e700d52aa377d8d))
- Remove double slash from explorer links ([b211d3f](b211d3f64277e97d4ed985a50850cf80950ec8ee))
- Remove usage of `multisigAsset` ([0919910](0919910dc9ccfac5a13208a92c7d7c248e40dfe1))
- Delete pending transactions that are already signed ([2eb3c59](2eb3c591ef56917b2b4da3ac75e004f241d9fb52))
- Remove timestamp from MuSig Server ([b35656d](b35656d3e1b06a850a50106e662816fa4922970f))
- Remove name from update ([088b088](088b088004ecf7c6330cbcad592943df45211377))
- Remove publishment workflow ([600bd74](600bd74b680c508b2c81497834569d5687530194))
- Remove faulty test ([39fdcd3](39fdcd3246e97ed83a23ebab5aae2c36a211d491))
- Remove default avatar value in `ProfileFactory#fromName` (#908) ([f7c725e](f7c725e4edf47464ae7a0c98397784af726602a3))
- Remove trailing commas from SQL migration (#1098) ([969160e](969160e4ba8d9c77660d3d010b3dab60b208964f))
- Remove trailing comma from migration (#1173) ([ac3a51c](ac3a51c52f5deb6b1eacfff0f3b895501eba1d25))
- Remove duplicate profile saving events (#1354) ([55ac850](55ac850a4e261b9c940b3a2312fbb367ca575c83))
- Remove contact address name validation (#1587) ([c9edc62](c9edc62c419b3a9215b5d73e452ce981eff221aa))
- Remove forbidden properties ([6e208fe](6e208fedcc7d48610f01ea6e9d37758b701261c3))
- Remove `coin` and `network` parameters after consuming them (#1732) ([e74a86b](e74a86b457bbbc9c62ea5ca0824ecf47df7185bc))
- Remove `toThrow(/is not implemented/)` scenarios (#1757) ([6b1ac5f](6b1ac5f9e8cff36670da54db676ccc3bc04e44da))
- Remove coin and network from cached instance (#1809) ([253f6a8](253f6a868b23713415b4703b7e54b0458d30a20c))
- Remove multi-signature transaction flag ([995b538](995b53888617ddccdad1b87177251bff8939494b))
- Remove `multiSignature.ledgerS` flag ([cf53b3e](cf53b3e6b260f1e9d0adfadee7a2afe2f20a8b63))

<!-- generated by git-cliff -->
