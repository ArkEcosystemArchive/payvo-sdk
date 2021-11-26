import { describe } from "@payvo/sdk-test";

import { BIP32 } from "./bip32";

describe("BIP32", ({ assert, each, it }) => {
	each(
		"#fromMnemonic - with network %s",
		({ dataset }) => {
			const mnemonic = "praise you muffin lion enable neck grocery crumble super myself license ghost";
			assert.is(BIP32.fromMnemonic(mnemonic, dataset.network).toBase58(), dataset.expected);
		},
		[
			{
				expected:
					"xprv9s21ZrQH143K4DRBUU8Dp25M61mtjm9T3LsdLLFCXL2U6AiKEqs7dtCJWGFcDJ9DtHpdwwmoqLgzPrW7unpwUyL49FZvut9xUzpNB6wbEnz",
				name: "default network",
			},
			{
				expected:
					"xprv9s21ZrQH143K4DRBUU8Dp25M61mtjm9T3LsdLLFCXL2U6AiKEqs7dtCJWGFcDJ9DtHpdwwmoqLgzPrW7unpwUyL49FZvut9xUzpNB6wbEnz",
				name: "btc.livenet",
				network: {
					bip32: {
						private: 76_066_276,
						public: 76_067_358,
					},
					wif: 128,
				},
			},
			{
				expected:
					"tprv8ZgxMBicQKsPf2ei92yiyfhLQ9C6yHBTNtnkCkff1JWwsmTQEDCs9dZkRSRGDfXYFjMQx3PZzhGnri3s31AtJ2beftnEaEt1Q6Zncq79d7f",
				name: "btc.testnet",
				network: {
					bip32: {
						private: 70_615_956,
						public: 70_617_039,
					},
					wif: 239,
				},
			},
		],
	);

	it("should derive an key from a seed", () => {
		assert.type(BIP32.fromSeed("000102030405060708090a0b0c0d0e0f").toBase58(), "string");
	});

	it("should derive an key from a base58", () => {
		assert.type(
			BIP32.fromBase58(
				"xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
			).toBase58(),
			"string",
		);
	});

	it("should derive an key from a public key", () => {
		assert.type(
			BIP32.fromPublicKey(
				"0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2",
				"873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508",
			).toBase58(),
			"string",
		);
	});

	it("should derive an key from a private key", () => {
		assert.type(
			BIP32.fromPrivateKey(
				"e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35",
				"873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508",
			).toBase58(),
			"string",
		);
	});
});
