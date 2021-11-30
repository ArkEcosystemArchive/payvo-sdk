import { describe } from "@payvo/sdk-test";

import { data, passphrase } from "../../../test/crypto/identity.json";
import { devnet } from "../../../test/crypto/networks.json";
import { PrivateKey } from "./private-key";

describe("Private Key", ({ assert, it }) => {
	it("fromPassphrase", () => {
		assert.is(PrivateKey.fromPassphrase(passphrase), data.privateKey);
	});

	it("fromWIF", () => {
		assert.is(PrivateKey.fromWIF(data.wif, devnet), data.privateKey);
	});
});
