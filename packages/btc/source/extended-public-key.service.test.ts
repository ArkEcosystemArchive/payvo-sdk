import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ExtendedPublicKeyService } from "./extended-public-key.service.js";

let subject;

describe("ExtendedPublicKeyService", async ({ assert, each }) => {
	each(
		"should derive with BIP44",
		async ({ dataset }) => {
			subject = await createService(ExtendedPublicKeyService, dataset[0]);

			assert.is(await subject.fromMnemonic(identity.mnemonic, { bip44: { account: 0 } }), dataset[1]);
		},
		[
			[
				"btc.livenet",
				"xpub6Cd4Wz2ewNDeT6kCWgFTCYp5ZDDHJ7xqBV9RSHwg8L6rB4VVu49LERSyohcRHsJhVS5hN5cNM6ox6FzvUYqUNfEGwDVpSSAyRoESe4QtvJh",
			],
			[
				"btc.testnet",
				"tpubDDQk4rFQdee83hndqmtK8dRHEtLP5W4fBWtUojpnzmnjxqpaVfiYDFyNYpp9vRBhMCsMYBKv6bt3PTmcQC7j6QFg7JbWDRjir8sTFs7iMst",
			],
		],
	);

	each(
		"should derive with BIP49",
		async ({ dataset }) => {
			subject = await createService(ExtendedPublicKeyService, dataset[0]);

			assert.is(await subject.fromMnemonic(identity.mnemonic, { bip49: { account: 0 } }), dataset[1]);
		},
		[
			[
				"btc.livenet",
				"xpub6C1ahY33CWyaKzdZd3MQrGqR6GBpiqjExzJSBmdxwAP2ZeLi7XYXvoY48hRrGgYwsSZ1WKUqxLRqqkK9bR6sDvWpJSbq13wHHTmNTX89d5B",
			],
			[
				"btc.testnet",
				"tpubDCAE2fa7YNAF2x2CpTEPRQmabzG7jNMks69zsPC6vLSqECRtb6tUmgivduD1XSXvuKZ794J9GjbEuDdLjGhEKmWfwGX45YuoMwhAXb8dpGw",
			],
		],
	);

	each(
		"should derive with BIP84",
		async ({ dataset }) => {
			subject = await createService(ExtendedPublicKeyService, dataset[0]);

			assert.is(await subject.fromMnemonic(identity.mnemonic, { bip84: { account: 0 } }), dataset[1]);
		},
		[
			[
				"btc.livenet",
				"xpub6Bk8X5Y1FN7pSecqoqkHe8F8gNaqMVApCrmMxZnRvSw4JpgqeM5T83Ze6uD4XEMiCSwZiwysnny8uQj5F6XAPF9FNKYNHTMoAu97bDXNtRe",
			],
			[
				"btc.testnet",
				"tpubDC9zgMaiUXPoSRkpk8gvDuzwHobq6GUw5D1nzWdeBWrEXYZUxaQGDLwtXvVFsmvdNUVernGA2JWFbJsj4se5Vemx8WK6w9bzmxj4K36ivox",
			],
		],
	);
});
