import { describe } from "@payvo/sdk-test";
import { WIF } from "@payvo/sdk-cryptography";

import { data, passphrase } from "../../../test/crypto/identity.json";
import { Address } from "./address.js";
import { Keys } from "./keys.js";

describe("Keys", ({ assert, it, stub }) => {
	it("fromPassphrase should return two keys in hex", () => {
		const keys = Keys.fromPassphrase("secret");

		assert.is(keys.publicKey, keys.publicKey);
		assert.is(keys.privateKey, keys.privateKey);
	});

	it("fromPassphrase should return address", () => {
		const keys = Keys.fromPassphrase(passphrase);
		// @ts-ignore
		const address = Address.fromPublicKey(keys.publicKey.toString("hex"));
		assert.is(address, data.address);
	});

	it("fromPrivateKey should return two keys in hex", () => {
		const keys = Keys.fromPrivateKey(data.privateKey);

		assert.is(keys.publicKey, data.publicKey);
		assert.is(keys.privateKey, data.privateKey);
	});

	it("fromWIF should return two keys in hex", () => {
		const keys = Keys.fromWIF("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA");

		assert.is(keys.publicKey, data.publicKey);
		assert.is(keys.privateKey, data.privateKey);
	});

	it("fromWIF should return address", () => {
		const keys = Keys.fromWIF(data.wif);
		const address = Address.fromPublicKey(keys.publicKey.toString("hex"));
		assert.is(address, data.address);
	});

	it("fromWIF should get keys from compressed WIF", () => {
		const keys = Keys.fromWIF("SAaaKsDdWMXP5BoVnSBLwTLn48n96UvG42WSUUooRv1HrEHmaSd4");

		assert.string(keys.publicKey);
		assert.string(keys.privateKey);
		assert.true(keys.compressed);
	});

	it("fromWIF should get keys from uncompressed WIF", () => {
		const keys = Keys.fromWIF("6hgnAG19GiMUf75C43XteG2mC8esKTiX9PYbKTh4Gca9MELRWmg");

		assert.string(keys.publicKey);
		assert.string(keys.privateKey);
		assert.false(keys.compressed);
	});

	it("fromWIF should fail with an invalid network version", () => {
		stub(WIF, "decode").returnValue({ version: 1 });

		assert.throws(() => {
			Keys.fromWIF("invalid");
		});
	});
});
