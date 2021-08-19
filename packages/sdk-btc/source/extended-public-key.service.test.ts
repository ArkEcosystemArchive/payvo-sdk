import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ExtendedPublicKeyService } from "./extended-public-key.service";

let subject: ExtendedPublicKeyService;

beforeEach(async () => {
	subject = createService(ExtendedPublicKeyService);
});

describe("ExtendedPublicKeyService", () => {
	describe("#fromMnemonic", () => {
		it("should derive with BIP44", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip44: {account: 0 }})).resolves.toBe(
				"xpub6Cd4Wz2ewNDeT6kCWgFTCYp5ZDDHJ7xqBV9RSHwg8L6rB4VVu49LERSyohcRHsJhVS5hN5cNM6ox6FzvUYqUNfEGwDVpSSAyRoESe4QtvJh",
			);
		});

		it("should derive with BIP49", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip49: {account: 0 }})).resolves.toBe(
				"xpub6C1ahY33CWyaKzdZd3MQrGqR6GBpiqjExzJSBmdxwAP2ZeLi7XYXvoY48hRrGgYwsSZ1WKUqxLRqqkK9bR6sDvWpJSbq13wHHTmNTX89d5B",
			);
		});

		it("should derive with BIP84", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic, { bip84: {account: 0 }})).resolves.toBe(
				"xpub6Bk8X5Y1FN7pSecqoqkHe8F8gNaqMVApCrmMxZnRvSw4JpgqeM5T83Ze6uD4XEMiCSwZiwysnny8uQj5F6XAPF9FNKYNHTMoAu97bDXNtRe",
			);
		});
	});
});
