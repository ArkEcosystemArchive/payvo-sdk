import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ExtendedPublicKeyService } from "./extended-public-key.service";

let subject: ExtendedPublicKeyService;

describe("ExtendedPublicKeyService livenet", () => {
	beforeEach(async () => {
		subject = createService(ExtendedPublicKeyService, "btc.livenet");
	});

	describe("#fromMnemonic", () => {
		it("should derive with BIP44", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip44: { account: 0 } })).resolves.toBe(
				"xpub6Cd4Wz2ewNDeT6kCWgFTCYp5ZDDHJ7xqBV9RSHwg8L6rB4VVu49LERSyohcRHsJhVS5hN5cNM6ox6FzvUYqUNfEGwDVpSSAyRoESe4QtvJh",
			);
		});

		it("should derive with BIP49", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip49: { account: 0 } })).resolves.toBe(
				"xpub6C1ahY33CWyaKzdZd3MQrGqR6GBpiqjExzJSBmdxwAP2ZeLi7XYXvoY48hRrGgYwsSZ1WKUqxLRqqkK9bR6sDvWpJSbq13wHHTmNTX89d5B",
			);
		});

		it("should derive with BIP84", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip84: { account: 0 } })).resolves.toBe(
				"xpub6Bk8X5Y1FN7pSecqoqkHe8F8gNaqMVApCrmMxZnRvSw4JpgqeM5T83Ze6uD4XEMiCSwZiwysnny8uQj5F6XAPF9FNKYNHTMoAu97bDXNtRe",
			);
		});
	});
});

describe("ExtendedPublicKeyService testnet", () => {
	beforeEach(async () => {
		subject = createService(ExtendedPublicKeyService, "btc.testnet");
	});

	describe("#fromMnemonic", () => {
		it("should derive with BIP44", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip44: { account: 0 } })).resolves.toBe(
				"tpubDEkXjhvVcm9C9EExE1q5auufrzBNtmHmDxBSh4FpYreCrMLVEg92dkbhnag4e6CinTybkxn2bVyJmEagup8XJpSA5JQ38UFT9YXZcnnADqp",
			);
		});

		it("should derive with BIP49", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip49: { account: 0 } })).resolves.toBe(
				"tpubDE4Gsa6iH89LKU1qUH2gWnAEu5c7UgAEVuQsgfDhwSqH4kVdU3gx69PxGTPStLNc4wr6VSKRkUaTUGA7Z93vXd2sCVYcTEcq9mVRMoZojFH",
			);
		});

		it("should derive with BIP84", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip84: { account: 0 } })).resolves.toBe(
				"tpubDEMJBTbYWmArsRne6mECkNrn216y3GvfaaeBbDDcJxzQ2mwgzvNTGY9pq1LBUStHxW7k1HcnjUmf6k2Q3gc6xT9qgrkvhTyMKKB5iRGtTym",
			);
		});
	});
});
