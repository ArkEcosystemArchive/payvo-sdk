import { describe } from "@payvo/sdk-test";

import { data, passphrase } from "../../../test/crypto/identity.json";
import { configManager } from "../managers/config.js";
import { Address } from "./address.js";
import { Keys } from "./keys.js";
import { PublicKey } from "./public-key.js";

describe("Address", ({ assert, it }) => {
	it("fromPassphrase", () => {
		assert.is(Address.fromPassphrase(passphrase), data.address);
	});

	it("fromPublicKey", () => {
		assert.is(Address.fromPublicKey(data.publicKey), data.address);
		assert.throws(() => {
			Address.fromPublicKey("invalid");
		}, "PublicKeyError");
	});

	it("fromWIF", () => {
		assert.is(Address.fromWIF(data.wif), data.address);
		assert.throws(() => {
			Address.fromWIF("invalid");
		}, "Error");
	});

	it("fromMultiSignatureAddress", () => {
		assert.is(
			Address.fromMultiSignatureAsset({
				min: 3,
				publicKeys: ["secret 1", "secret 2", "secret 3"].map((secret) => PublicKey.fromPassphrase(secret)),
			}),
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
				Address.fromMultiSignatureAsset({
					min: i,
					publicKeys: participants,
				}),
			);
		}

		assert.length([...addresses], 15);
	});

	it("should fail with invalid input", () => {
		assert.throws(() => {
			Address.fromMultiSignatureAsset({
				min: 7,
				publicKeys: ["secret 1", "secret 2", "secret 3"].map((secret) => PublicKey.fromPassphrase(secret)),
			});
		}, "InvalidMultiSignatureAssetError");

		assert.throws(() => {
			Address.fromMultiSignatureAsset({
				min: 1,
				publicKeys: [],
			});
		}, "InvalidMultiSignatureAssetError");

		assert.throws(() => {
			Address.fromMultiSignatureAsset({
				min: 1,
				publicKeys: ["garbage"],
			});
		}, "PublicKeyError");
	});

	it("fromPrivateKey", () => {
		assert.is(Address.fromPrivateKey(Keys.fromPassphrase(passphrase)), data.address);
	});

	it("toBuffer", () => {
		assert.not.throws(() => Address.toBuffer("DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi"));
	});

	it("should not be OK", () => {
		assert.throws(() => Address.toBuffer("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"));
	});

	it("fromBuffer", () => {
		const addressBuffer = Address.toBuffer("DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi");
		assert.equal(Address.fromBuffer(addressBuffer), "DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi");
	});

	it("validate", () => {
		assert.true(Address.validate(data.address));
		assert.false(Address.validate("invalid"));

		configManager.setFromPreset("mainnet");

		assert.true(Address.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"));

		configManager.setFromPreset("devnet");

		assert.true(Address.validate("DARiJqhogp2Lu6bxufUFQQMuMyZbxjCydN"));
	});
});
