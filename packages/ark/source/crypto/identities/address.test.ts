import { describe } from "@payvo/sdk-test";

import { data, passphrase } from "../../../test/crypto/identity.json";
import { devnet, mainnet } from "../../../test/crypto/networks.json";
import { Address } from "./address";
import { Keys } from "./keys";
import { PublicKey } from "./public-key";

describe("Address", ({ assert, it }) => {
	it("fromPassphrase", () => {
		assert.is(Address.fromPassphrase(passphrase, devnet), data.address);
	});

	it("fromPublicKey", () => {
		assert.is(Address.fromPublicKey(data.publicKey, devnet), data.address);
		assert.throws(() => {
			Address.fromPublicKey("invalid", devnet);
		}, "PublicKeyError");
	});

	it("fromWIF", () => {
		assert.is(Address.fromWIF(data.wif, devnet), data.address);
		assert.throws(() => {
			Address.fromWIF("invalid", devnet);
		}, "Error");
	});

	it("fromMultiSignatureAddress", () => {
		assert.is(
			Address.fromMultiSignatureAsset(
				{
					min: 3,
					publicKeys: ["secret 1", "secret 2", "secret 3"].map((secret) => PublicKey.fromPassphrase(secret)),
				},
				devnet,
			),
			"DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi",
		);
	});

	it("fromMultiSignatureAddress should create distinct addresses for different min", () => {
		const participants: string[] = [];
		const addresses = new Set();

		for (let i = 1; i < 16; i++) {
			participants.push(PublicKey.fromPassphrase(`secret ${i}`));
		}

		for (let i = 1; i < 16; i++) {
			addresses.add(
				Address.fromMultiSignatureAsset(
					{
						min: i,
						publicKeys: participants,
					},
					devnet,
				),
			);
		}

		assert.length([...addresses], 15);
	});

	it("should fail with invalid input", () => {
		assert.throws(() => {
			Address.fromMultiSignatureAsset(
				{
					min: 7,
					publicKeys: ["secret 1", "secret 2", "secret 3"].map((secret) => PublicKey.fromPassphrase(secret)),
				},
				devnet,
			);
		}, "InvalidMultiSignatureAssetError");

		assert.throws(() => {
			Address.fromMultiSignatureAsset(
				{
					min: 1,
					publicKeys: [],
				},
				devnet,
			);
		}, "InvalidMultiSignatureAssetError");

		assert.throws(() => {
			Address.fromMultiSignatureAsset(
				{
					min: 1,
					publicKeys: ["garbage"],
				},
				devnet,
			);
		}, "PublicKeyError");
	});

	it("fromPrivateKey", () => {
		assert.is(Address.fromPrivateKey(Keys.fromPassphrase(passphrase), devnet), data.address);
	});

	it("toBuffer", () => {
		assert.undefined(Address.toBuffer("DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi", devnet).addressError);
	});

	it("should not be OK", () => {
		assert.not.undefined(Address.toBuffer("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX", devnet).addressError);
	});

	it("fromBuffer", () => {
		const { addressBuffer } = Address.toBuffer("DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi", devnet);
		assert.equal(Address.fromBuffer(addressBuffer), "DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi");
	});

	it("validate", () => {
		assert.true(Address.validate(data.address, devnet));
		assert.false(Address.validate("invalid", devnet));
		assert.true(Address.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX", mainnet));
		assert.true(Address.validate("DARiJqhogp2Lu6bxufUFQQMuMyZbxjCydN", devnet));
	});
});
